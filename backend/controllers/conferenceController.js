const conferenceModel = require('../models').conference;
const userModel = require('../models').user;
const conferenceReviewersModel = require('../models').conferenceReviewers;

//conferintele la care e alocat un reviewer
//la fel pt autor la care e inscris
//la fel pt org pe cele pe care le a facut 


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


const getAllConferences = async(req, res) => {
    const listaConference = await conferenceModel.findAll();
    res.status(200).send({message:"lista de conferinte", data: listaConference});
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

module.exports = {
    createConference,
    getAllConferences,
    getConferenceById,
    updateConference,
    deleteConferenceById
}