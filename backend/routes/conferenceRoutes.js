const express = require('express');
const router = express.Router();
const {createConference, getAllConferences, updateConference, deleteConferenceById, getConferencesByReviewer,getReviewersByConferenceId} = require('../controllers/conferenceController');

const verifyToken = require('../middlewares/authMiddleware');

router.post('/create', verifyToken, createConference);
router.get('/getAll', verifyToken, getAllConferences);
router.put('/update/:id', verifyToken, updateConference)
router.delete('/delete/:id', verifyToken, deleteConferenceById);
router.get('/getAllConferencesPerReviewer/:reviewerId', getConferencesByReviewer);
router.get('/reviewers/:conferenceId', getReviewersByConferenceId);


module.exports = router;