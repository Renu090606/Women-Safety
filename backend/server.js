require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const sosRoutes = require('./routes/sos');
const notifyRoutes = require('./routes/notify');
const busRoutes = require('./routes/buses');
const journeyRoutes = require('./routes/journey');
const adminRoutes = require('./routes/admin');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ ok: true }));
app.use('/api/auth', authRoutes);
app.use('/api/sos', sosRoutes);
app.use('/api/notify', notifyRoutes);
app.use('/api/buses', busRoutes);
app.use('/api/journey', journeyRoutes);
app.use('/api/admin', adminRoutes);
app.use(errorHandler);

const PORT = Number(process.env.PORT || 5000);
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
