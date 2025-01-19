const express = require('express');
const router = express.Router();
const { uploadArticle } = require('../controllers/articleController');
const upload = require('../middlewares/uploadMiddleware'); 
const verifyToken = require('../middlewares/authMiddleware');
const { getArticlesByConference } = require('../controllers/articleController');
const { reviewArticle, updateArticle, downloadFile} = require('../controllers/articleController');

router.post('/upload', upload.single('file'), uploadArticle);
router.get('/getAllArticlesPerConference/:conferenceId',verifyToken, getArticlesByConference);
router.post('/review/:articleId', reviewArticle);
router.put('/:articleId', upload.single('file'), updateArticle);
router.get('/download/:articleId', downloadFile);
module.exports = router;
