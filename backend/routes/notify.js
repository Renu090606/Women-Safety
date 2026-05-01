const express = require('express');
const { notifyBoarding } = require('../controllers/notifyController');
const router = express.Router();
router.post('/boarding', notifyBoarding);
module.exports = router;
