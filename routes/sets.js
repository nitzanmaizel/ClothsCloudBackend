const express = require('express');
const router = express.Router();
const User = require('../models/User');
const sets = require('../models/Sets');
const FavoriteSets = require('../models/FavoriteSets');
const getToken = require('../middleware/getToken');

// @route    POST api/sets
// @desc     Add set to user collection
// @access   Private

router.post('/', async (req, res) => {
	res.send('sets route');
});

module.exports = router;
