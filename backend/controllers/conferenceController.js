const conferenceModel = require('../models').conference;
const userModel = require('../models').user;
const conferenceReviewersModel = require('../models').conferenceReviewers;


const createConference = async (req, res) => {
    try {
     
        const { title, description, date, organizer_id, reviewers } = req.body;

        console.log(req.body);

        if (!title) {
            console.log("Titlul lipsește");
        }
        if (!description) {
            console.log("Descrierea lipsește");
        }
        if (!date) {
            console.log("Data lipsește");
        }
        if (!organizer_id) {
            console.log("ID-ul organizatorului lipsește");
        }
        if (!reviewers) {
            console.log("Reviewerii lipsesc");
        }
        if (reviewers.length !== 2) {
            console.log("Reviewerii nu sunt exact 2:", reviewers);
        }
        

        
        const organizer = await userModel.findOne({ where: { id: organizer_id, role: 'organizer' } });

        if (!organizer) {
            return res.status(400).send({ message: "Id invalid sau userul nu are rolul de organizator" });
        }

      
        const vfReviewers = await userModel.findAll({
            where: {
                id: reviewers,
                role: "reviewer"
            }
        });

        if (vfReviewers.length !== 2) {
            return res.status(400).send({ message: "Trebuie selectați exact 2 useri cu rolul de reviewer" });
        }

        
        const newConference = await conferenceModel.create({
            title,
            description,
            date,
            organizer_id
        });

       
        for (const reviewerId of reviewers) {
            await conferenceReviewersModel.create({
                conferenceId: newConference.id,
                reviewerId,
            });
        }

        res.status(201).send({
            message: "Conferința creată cu succes!",
            conference: newConference
        });
    } catch (error) {
        console.error("Eroare la crearea conferinței:", error);
        res.status(500).send({ message: "Eroare internă la server." });
    }
};


const getAllConferences = async (req, res) => {
    try {
      const conferences = await conferenceModel.findAll();
      const conferenceReviewers = await conferenceReviewersModel.findAll();
      const reviewers = await userModel.findAll({
        attributes: ['id', 'email'],
        where: { role: 'reviewer' },
      });
  
      const reviewersMap = reviewers.reduce((acc, user) => {
        acc[user.id] = user;
        return acc;
      }, {});
  
      const conferencesWithReviewers = conferences.map((conference) => {
        const reviewersForConference = conferenceReviewers
          .filter((reviewer) => reviewer.conferenceId === conference.id)
          .map((reviewer) => reviewersMap[reviewer.reviewerId]);
  
        return {
          ...conference.toJSON(),
          reviewers: reviewersForConference,
        };
      });
  
      res.status(200).send({
        message: 'List of conferences with their reviewers',
        data: conferencesWithReviewers,
      });
    } catch (error) {
      console.error('Error fetching conferences with reviewers:', error);
      res.status(500).send({ message: 'Error fetching conferences' });
    }
  };
  

const getConferenceById = async(req, res) => {
    const id = req.params.id;
    const conferenceSearched = await conferenceModel.findByPk(id);

    if(conferenceSearched===null)
    {
        res.status(404).send({message:"Nu s-a gasit nicio conferinta cu acest id"});
    }
    res.status(200).send({message:"S a gasit", data: conferenceSearched});
}

const updateConference = async(req, res) => {
    const conferenceId = req.params.id;
    try{
        const conference = await conferenceModel.findByPk(conferenceId);
        if(!conference)
        {

            return res.status(404).send('Nu s-a gasit conferinta cu acest id');
        }
        else {
            const conferenceModificat = {
                title: req.body.title,
                description: req.body.description,
                date:req.body.date,
                organizer_id : req.body.organizer_id
            };
            
            const rezultat = await conferenceModel.update(conferenceModificat, {
                where: {
                    id: conferenceId
                }
            });
            
            res.status(200).send({message:"Conferinta a fost modificata", data: conference});
        }

    }catch(error)
    {
        res.status(500).send(error);
    }
}

const deleteConferenceById = async(req, res) => {
    const id = req.params.id;
    try{
        const conference = await conferenceModel.findByPk(id);
        if(!conference)
        {
            return res.status(404).send('Nu s a gasit conferinta');

        }

        await conferenceModel.destroy({
            where: {
                id:id
            }
        });
        res.status(200).send('Conferinta a fost stearsa');
    } catch(error) {
        res.status(500).send(error);
    }
}


const getConferencesByReviewer = async (req, res) => {
  try {

    const { reviewerId } = req.params;
 const conferences = await conferenceModel.findAll({
      include: [
        {
          model: conferenceReviewersModel,
          as: 'conferenceReviewers', 
          where: { reviewerId }, 
          attributes: [], 
        },
      ],
    });

   
    if (!conferences || conferences.length === 0) {
      return res.status(404).send({ message: 'Reviewer-ul nu este alocat la nicio conferință.' });
    }


    res.status(200).send({
      message: `Conferințele la care este alocat reviewer-ul cu ID-ul ${reviewerId}:`,
      conferences,
    });
  } catch (error) {
    console.error('Eroare la preluarea conferințelor:', error);
    res.status(500).send({ message: 'Eroare internă de server.' });
  }
};

const getReviewersByConferenceId = async (req, res) => {
    try {
      const { conferenceId } = req.params;
  
  
      const conference = await conferenceModel.findByPk(conferenceId);
      if (!conference) {
        return res.status(404).send({ message: 'Conferința nu a fost găsită.' });
      }
  
      
      const reviewers = await conferenceReviewersModel.findAll({
        where: { conferenceId },
        include: [
          {
            model: userModel,
            as: 'reviewer', 
            attributes: ['id', 'email', 'role'],
          },
        ],
      });
  
     
      const formattedReviewers = reviewers.map((reviewer) => reviewer.reviewer);
  
      res.status(200).send({
        message: `Revieweri pentru conferința ${conference.title}`,
        reviewers: formattedReviewers,
      });
    } catch (error) {
      console.error('Eroare la obținerea reviewerilor:', error);
      res.status(500).send({ message: 'Eroare internă de server.' });
    }
  };

module.exports = {
    createConference,
    getAllConferences,
    getConferenceById,
    updateConference,
    deleteConferenceById,
    getConferencesByReviewer,
    getReviewersByConferenceId
}