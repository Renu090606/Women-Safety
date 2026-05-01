const twilio = require('twilio');

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const notifyBoarding = async (req, res, next) => {
  try {
    const { passengerName, busNumber, busLatitude, busLongitude, emergencyContacts = [] } = req.body;
    const locationLink = `https://maps.google.com/?q=${busLatitude},${busLongitude}`;
    const message = `${passengerName} has boarded bus ${busNumber}. Track location: ${locationLink}`;
    const numbers = [...new Set((emergencyContacts || []).filter(Boolean))];

    for (const number of numbers) {
      await client.messages.create({ from: process.env.TWILIO_PHONE_NUMBER, to: number, body: message });
    }

    return res.json({ success: true, sentTo: numbers });
  } catch (error) {
    return next(error);
  }
};

module.exports = { notifyBoarding };
