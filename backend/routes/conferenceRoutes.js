const express = require('express');
const router = express.Router();

const {createConference, getAllConferences, updateConference, deleteConferenceById} = require('../controllers/conferenceController');

router.post('/create', createConference);
router.get('/getAll', getAllConferences);
router.put('/update/:id', updateConference)
router.delete('/delete/:id', deleteConferenceById);

module.exports = router;