const express = require('express');
const { startJourney, completeJourney } = require('../controllers/journeyController');
const router = express.Router();
router.post('/start', startJourney);
router.post('/complete', completeJourney);
module.exports = router;
