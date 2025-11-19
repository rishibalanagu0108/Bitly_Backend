const Link = require('../models/Link');
const { nanoid } = require('nanoid');

// Create a new link
exports.createLink = async (req, res) => {
  try {
    const { url, shortCode } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    let code = shortCode;
    if (!code) {
      code = nanoid(8);
    } else {
      // Check if custom code exists
      const existingLink = await Link.findOne({ shortCode: code });
      if (existingLink) {
        return res.status(409).json({ error: 'Short code already exists' });
      }
    }

    const newLink = new Link({
      originalUrl: url,
      shortCode: code,
    });

    await newLink.save();
    res.status(201).json(newLink);
  } catch (error) {
    console.error('Create link error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all links
exports.getLinks = async (req, res) => {
  try {
    const links = await Link.find().sort({ createdAt: -1 });
    res.json(links);
  } catch (error) {
    console.error('Get links error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get stats for a single link
exports.getLinkStats = async (req, res) => {
  try {
    const { code } = req.params;
    const link = await Link.findOne({ shortCode: code });

    if (!link) {
      return res.status(404).json({ error: 'Link not found' });
    }

    res.json(link);
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete a link
exports.deleteLink = async (req, res) => {
  try {
    const { code } = req.params;
    const link = await Link.findOneAndDelete({ shortCode: code });

    if (!link) {
      return res.status(404).json({ error: 'Link not found' });
    }

    res.json({ message: 'Link deleted' });
  } catch (error) {
    console.error('Delete link error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
