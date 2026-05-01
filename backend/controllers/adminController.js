const { db, admin } = require('../config/firebase');

const listBuses = async (req, res, next) => {
  try {
    const snap = await db.collection('buses').get();
    return res.json(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  } catch (error) { return next(error); }
};

const listDrivers = async (req, res, next) => {
  try {
    const snap = await db.collection('drivers').get();
    return res.json(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  } catch (error) { return next(error); }
};

const listPassengers = async (req, res, next) => {
  try {
    const snap = await db.collection('users').where('role', '==', 'passenger').get();
    return res.json(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  } catch (error) { return next(error); }
};

const listSosAlerts = async (req, res, next) => {
  try {
    const snap = await db.collection('sos_alerts').orderBy('timestamp', 'desc').get();
    return res.json(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  } catch (error) { return next(error); }
};

const assignBus = async (req, res, next) => {
  try {
    const { driverUid, busNumber } = req.body;
    await db.collection('drivers').doc(driverUid).set({ assignedBus: busNumber }, { merge: true });

    const busSnap = await db.collection('buses').where('busNumber', '==', busNumber).limit(1).get();
    if (busSnap.empty) {
      return res.status(404).json({ error: 'Bus not found' });
    }
    await busSnap.docs[0].ref.update({ assignedDriverUid: driverUid });

    return res.json({ success: true });
  } catch (error) { return next(error); }
};

module.exports = { listBuses, listDrivers, listPassengers, listSosAlerts, assignBus };
