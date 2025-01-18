const express = require('express');
const router = express.Router();
const { uploadArticle } = require('../controllers/articleController');
const upload = require('../middlewares/uploadMiddleware'); 
const verifyToken = require('../middlewares/authMiddleware');


router.post('/upload',verifyToken, upload.single('file'), uploadArticle);

module.exports = router;
