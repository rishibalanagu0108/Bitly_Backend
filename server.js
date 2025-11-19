const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const linkRoutes = require('./routes/links');
const Link = require('./models/Link');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/links', linkRoutes);

// Health Check
app.get('/healthz', (req, res) => {
  res.status(200).json({ ok: true, version: '1.0' });
});

// Redirect Route
app.get('/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const link = await Link.findOne({ shortCode: code });

    if (link) {
      link.clicks += 1;
      link.lastClickedAt = new Date();
      await link.save();
      return res.redirect(link.originalUrl);
    } else {
      return res.status(404).send('Link not found');
    }
  } catch (error) {
    console.error('Redirect error:', error);
    res.status(500).send('Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
