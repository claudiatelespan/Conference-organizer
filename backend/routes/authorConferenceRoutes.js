const express = require("express");
const router = express.Router();
const authorConferenceController = require("../controllers/index").authorConferenceController;
const verifyToken = require('../middlewares/authMiddleware');

router.post('/joinConference', verifyToken, authorConferenceController.authorJoinConference);

module.exports = router;