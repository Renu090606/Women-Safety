const { db, admin } = require('../config/firebase');

const startJourney = async (req, res, next) => {
  try {
    const payload = req.body;
    const ref = await db.collection('journeys').add({
      ...payload,
      status: 'active',
      boardedAt: admin.firestore.FieldValue.serverTimestamp(),
      completedAt: null,
    });
    await ref.update({ journeyId: ref.id });
    return res.status(201).json({ success: true, journeyId: ref.id });
  } catch (error) {
    return next(error);
  }
};

const completeJourney = async (req, res, next) => {
  try {
    const { journeyId, busNumber } = req.body;
    await db.collection('journeys').doc(journeyId).update({
      status: 'completed',
      completedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    const busSnap = await db.collection('buses').where('busNumber', '==', busNumber).limit(1).get();
    if (!busSnap.empty) {
      await busSnap.docs[0].ref.update({
        currentFemaleCount: admin.firestore.FieldValue.increment(-1),
      });
    }

    return res.json({ success: true });
  } catch (error) {
    return next(error);
  }
};

module.exports = { startJourney, completeJourney };
