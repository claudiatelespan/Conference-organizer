const express = require('express');
const router = express.Router();
const userController = require("../controllers/index").userController

const verifyToken = require('../middlewares/authMiddleware');

router.post('/login', userController.login);
router.post('/register', userController.register);
router.get('/getAllReviewers', verifyToken, userController.getAllReviewers);

module.exports = router;