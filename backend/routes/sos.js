const express = require('express');
const { sendSos } = require('../controllers/sosController');
const router = express.Router();
router.post('/send', sendSos);
module.exports = router;
