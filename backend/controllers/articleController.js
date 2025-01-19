const { article: ArticleModel, conferenceAuthor: ConferenceAuthorModel } = require('../models');
const { articleReviewer: ArticleReviewModel } = require('../models');
const { conference: ConferenceModel } = require('../models');
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



const getArticlesByConference = async (req, res) => {
  try {
  
    const { conferenceId } = req.params;

    const conference = await ConferenceModel.findByPk(conferenceId);
    if (!conference) {
      return res.status(404).send({ message: 'Conferința nu a fost găsită.' });
    }

    const articles = await ArticleModel.findAll({
      where: { conferenceId },
    });

    res.status(200).send({
      message: `Articole pentru conferința ${conference.title}`,
      articles,
    });
  } catch (error) {
    console.error('Eroare la preluarea articolelor:', error);
    res.status(500).send({ message: 'Eroare internă de server.' });
  }
};


const reviewArticle = async (req, res) => {
  try {
    const { articleId } = req.params; 
    const { reviewerId, status, feedback } = req.body; 

   
    const article = await ArticleModel.findByPk(articleId);
    if (!article) {
      return res.status(404).send({ message: 'Articolul nu a fost găsit.' });
    }

    
    const articleReview = await ArticleReviewModel.findOne({
      where: {
        article_id: articleId,
        reviewer_id: reviewerId,
      },
    });

    if (!articleReview) {
      return res.status(403).send({ message: 'Nu aveți permisiunea să evaluați acest articol.' });
    }

   
    articleReview.status = status; 
    articleReview.feedback = feedback;
    await articleReview.save();


    const reviews = await ArticleReviewModel.findAll({
      where: { article_id: articleId },
    });

    const allApproved = reviews.every((review) => review.status === 'acceptat');
    const anyRejected = reviews.some((review) => review.status === 'respins');

    if (allApproved) {
      article.status = 'accepted';
    } else if (anyRejected) {
      article.status = 'rejected';
    } else {
      article.status = 'reviewed';
    }

    await article.save();

    res.status(200).send({ message: 'Review-ul a fost înregistrat cu succes.', article });
  } catch (error) {
    console.error('Eroare la evaluarea articolului:', error);
    res.status(500).send({ message: 'Eroare internă de server.' });
  }
};


module.exports = {
  uploadArticle,
  getArticlesByConference,
  reviewArticle
};
