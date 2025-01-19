const express = require('express')
const router = express.Router();

const conferenceRouter = require('./conferenceRoutes');
const userRouter = require('./userRoutes');
const authorConferenceRouter = require('./authorConferenceRoutes');
const articleRouter = require('./articleRoutes');

router.use('/conferences', conferenceRouter);
router.use('/users', userRouter);
router.use('/conferenceRegistration', authorConferenceRouter);
router.use('/articles', articleRouter);

module.exports = router;