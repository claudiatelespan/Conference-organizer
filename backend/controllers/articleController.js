const { article: ArticleModel, conferenceAuthor: ConferenceAuthorModel } = require('../models');
const path = require('path'); 
const fs = require('fs'); 

const uploadArticle = async (req, res) => {
  try {

    const { conferenceId, userId } = req.body;  
    const { file } = req; 
    
   // const { conferenceId } = req.body; 
    //const userId = req.user.id; 
    //const { file } = req; 

    
    const isRegistered = await ConferenceAuthorModel.findOne({
      where: { conferenceId, authorId: userId },
    });

    if (!isRegistered) {
      return res.status(403).send({ message: 'Nu ești înscris la această conferință' });
    }

  
    if (!file) {
      return res.status(400).send({ message: 'Fișierul lipsă. Te rugăm să încarci un document.' });
    }

   
    const newArticle = await ArticleModel.create({
      title: req.body.title || `Articol - ${Date.now()}`, 
      conferenceId: conferenceId,
      authorId: userId,
      status: 'submitted',
      filePath: file.path, 
    });

    return res.status(201).send({
      message: 'Articol încărcat cu succes!',
      article: newArticle,
    });
  } catch (error) {
    console.error('Eroare la încărcarea articolului:', error);
    return res.status(500).send({ message: 'Eroare internă de server.' });
  }
};

module.exports = {
  uploadArticle,
};
