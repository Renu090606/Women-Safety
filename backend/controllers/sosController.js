const twilio = require('twilio');
const { db, admin } = require('../config/firebase');

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const sendSMS = async (to, body) => {
  await client.messages.create({ from: process.env.TWILIO_PHONE_NUMBER, to, body });
};

const sendSos = async (req, res, next) => {
  try {
    const { passengerName, busNumber, latitude, longitude, emergencyContacts = [] } = req.body;
    const locationLink = `https://maps.google.com/?q=${latitude},${longitude}`;
    const message = `EMERGENCY ALERT: ${passengerName} needs help. Bus: ${busNumber}. Location: ${locationLink}`;
    const numbers = [...new Set([...(emergencyContacts || []), process.env.WOMEN_HELPLINE_NUMBER].filter(Boolean))];

    for (const number of numbers) {
      await sendSMS(number, message);
    }

    await db.collection('sos_alerts').add({
      alertId: `SOS-${Date.now()}`,
      passengerName,
      busNumber,
      latitude,
      longitude,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      sentTo: numbers,
    });

    return res.json({ success: true, sentTo: numbers });
  } catch (error) {
    return next(error);
  }
};

module.exports = { sendSos };
