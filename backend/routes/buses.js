const express = require('express');
const { getActiveBuses } = require('../controllers/busController');
const router = express.Router();
router.get('/active', getActiveBuses);
module.exports = router;
