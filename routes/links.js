const express = require('express');
const router = express.Router();
const { createLink, getLinks, getLinkStats, deleteLink } = require('../controllers/linkController');

router.post('/', createLink);
router.get('/', getLinks);
router.get('/:code', getLinkStats);
router.delete('/:code', deleteLink);

module.exports = router;
