const express = require('express')
const router = express.Router();

const conferenceRouter = require('./conferenceRoutes');
const userRouter = require('./userRoutes');

router.use('/conference', conferenceRouter);
router.use('/users', userRouter);

module.exports = router;