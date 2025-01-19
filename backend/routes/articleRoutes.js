const express = require('express');
const router = express.Router();
const { uploadArticle } = require('../controllers/articleController');
const upload = require('../middlewares/uploadMiddleware'); 
const verifyToken = require('../middlewares/authMiddleware');
const { getArticlesByConference } = require('../controllers/articleController');
const { reviewArticle, updateArticle } = require('../controllers/articleController');

router.post('/upload',verifyToken, upload.single('file'), uploadArticle);
router.get('/getAllArticlesPerConference/:conferenceId',verifyToken, getArticlesByConference);
router.post('/review/:articleId', reviewArticle);

module.exports = router;
