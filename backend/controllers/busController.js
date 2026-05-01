const { rtdb } = require('../config/firebase');

const getActiveBuses = async (req, res, next) => {
  try {
    const snapshot = await rtdb.ref('bus_locations').get();
    if (!snapshot.exists()) {
      return res.json([]);
    }
    const raw = snapshot.val();
    const active = Object.entries(raw)
      .filter(([, val]) => val && val.isActive)
      .map(([busNumber, val]) => ({ busNumber, ...val }));
    return res.json(active);
  } catch (error) {
    return next(error);
  }
};

module.exports = { getActiveBuses };
