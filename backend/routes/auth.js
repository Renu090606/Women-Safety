const express = require('express');
const { body } = require('express-validator');
const { verifyAadhaar, verifyLicense } = require('../controllers/authController');

const router = express.Router();
router.post('/verify-aadhaar', [body('aadhaarNumber').isLength({ min: 12, max: 12 })], verifyAadhaar);
router.post('/verify-license', [body('licenseId').notEmpty()], verifyLicense);
module.exports = router;
