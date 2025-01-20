const { article: ArticleModel, conferenceAuthor: ConferenceAuthorModel } = require('../models');
const { articleReviewer: ArticleReviewModel } = require('../models');
const { conference: ConferenceModel } = require('../models');
const ConferenceReviewerModel = require('../models/index').conferenceReviewers
const userModel = require('../models/index').user;
const path = require('path'); 
const fs = require('fs'); 

const uploadArticle = async (req, res) => {
  try {
    const { conferenceId, userId } = req.body;  
    const { file } = req; 

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
      filePath: file.filename, 
    });

  
    const reviewers = await ConferenceReviewerModel.findAll({
      where: { conferenceId },
      attributes: ['reviewerId'],
    });

   
    for (const reviewer of reviewers) {
      await ArticleReviewModel.create({
        article_id: newArticle.id,
        reviewer_id: reviewer.reviewerId,
        status: 'neverificat', 
        feedback: null,
      });
    }

    return res.status(201).send({
      message: 'Articol încărcat cu succes și reviewerii au fost asociați.',
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

    // Preluăm review-urile pentru articole
    const articleReviews = await ArticleReviewModel.findAll({
      where: {
        article_id: articles.map(article => article.id), // Găsim articolele din conferință
      },
    });

    // Preluăm reviewerii pentru fiecare review
    const reviewers = await userModel.findAll({
      attributes: ['id', 'email'],
      where: { role: 'reviewer' },
    });

    // Creăm o mapare a reviewerilor pentru articole
    const reviewersMap = reviewers.reduce((acc, reviewer) => {
      acc[reviewer.id] = reviewer;
      return acc;
    }, {});

    const articlesWithReviews = articles.map((article) => {
      // Găsim review-urile pentru fiecare articol
      const reviewsForArticle = articleReviews
        .filter((review) => review.article_id === article.id)
        .map((review) => ({
          ...review.toJSON(),
          reviewer: reviewersMap[review.reviewer_id], // Atașăm reviewer-ul la fiecare review
        }));

      return {
        ...article.toJSON(),
        reviews: reviewsForArticle, // Adăugăm review-urile la articol
      };
    });

    res.status(200).send({
      message: `Articole pentru conferința ${conference.title}`,
      articles: articlesWithReviews, // Trimitem articolele cu review-urile
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
    console.log(req.body)
   
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

const updateArticle = async (req, res) => {
  try {
    const { articleId } = req.params; 
    const userId = req.user.id; 
    const { file } = req; 

    
    const article = await ArticleModel.findOne({
      where: { id: articleId, authorId: userId },
    });

    if (!article) {
      return res.status(404).send({ message: 'Articolul nu a fost găsit sau nu aveți permisiunea să-l modificați.' });
    }

    
    if (!file) {
      return res.status(400).send({ message: 'Fișierul lipsă. Te rugăm să încarci un document nou.' });
    }

   
    if (article.filePath) {
      fs.unlinkSync(path.join(__dirname, '..', 'uploads', article.filePath));
    }

    
    article.filePath = file.filename;
    article.status = 'submitted'; 
    await article.save();

    await ArticleReviewModel.update(
      { status: 'neverificat', feedback: null },
      { where: { article_id: articleId } }
    );

    res.status(200).send({ message: 'Articolul a fost actualizat cu succes.', article });
  } catch (error) {
    console.error('Eroare la actualizarea articolului:', error);
    res.status(500).send({ message: 'Eroare internă de server.' });
  }
};

const downloadFile = async (req, res) => {
  try {
    const { articleId } = req.params; 

  
    const article = await ArticleModel.findByPk(articleId);

    if (!article) {
      return res.status(404).send({ message: 'Articolul nu a fost găsit.' });
    }

    const filePath = path.resolve(article.filePath);


    return res.download(filePath, (err) => {
      if (err) {
        console.error('Eroare la descărcarea fișierului:', err);
        return res.status(500).send({ message: 'Eroare la descărcarea fișierului.' });
      }
    });
  } catch (error) {
    console.error('Eroare la descărcarea fișierului:', error);
    return res.status(500).send({ message: 'Eroare internă de server.' });
  }
};

const getArticleDetails = async (req, res) => {
  try {
    const { articleId } = req.params;

    const article = await ArticleModel.findByPk(articleId, {
      attributes: ['id', 'title', 'status', 'filePath', 'conferenceId', 'authorId'],
    });

    if (!article) {
      return res.status(404).send({ message: 'Articolul nu a fost găsit.' });
    }

    const reviews = await ArticleReviewModel.findAll({
      where: { article_id: articleId },
      include: [
        {
          model: userModel,
          as: 'reviewer', 
          attributes: ['id', 'email', 'role'], 
        },
      ],
    });

   
    const formattedReviews = reviews.map((review) => ({
      reviewer: {
        id: review.reviewer.id,
        email: review.reviewer.email,
        role: review.reviewer.role,
      },
      status: review.status,
      feedback: review.feedback,
    }));

    res.status(200).send({
      message: 'Detalii despre articol.',
      article: {
        id: article.id,
        title: article.title,
        status: article.status,
        filePath: article.filePath,
        conferenceId: article.conferenceId,
        authorId: article.authorId,
      },
      reviews: formattedReviews,
    });
  } catch (error) {
    console.error('Eroare la obținerea detaliilor articolului:', error);
    res.status(500).send({ message: 'Eroare internă de server.' });
  }
};

module.exports = {
  uploadArticle,
  getArticlesByConference,
  reviewArticle,
  updateArticle,
  downloadFile,
  getArticleDetails
};
