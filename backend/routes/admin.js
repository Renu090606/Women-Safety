const express = require('express');
const {
  listBuses,
  listDrivers,
  listPassengers,
  listSosAlerts,
  assignBus,
} = require('../controllers/adminController');

const router = express.Router();
router.get('/buses', listBuses);
router.get('/drivers', listDrivers);
router.get('/passengers', listPassengers);
router.get('/sos-alerts', listSosAlerts);
router.post('/assign-bus', assignBus);
module.exports = router;
