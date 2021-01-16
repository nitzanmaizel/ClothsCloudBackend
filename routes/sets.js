const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const Sets = require('../models/Sets');
const FavoriteSets = require('../models/FavoriteSets');
const getToken = require('../middleware/getToken');

// @route    POST api/sets
// @desc     Add set to user collection
// @access   Private

router.post(
	'/',
	[
		check('shirt', 'Shirt is required').not().isEmpty().trim(),
		check('pants', 'Pants name is required').not().isEmpty().trim(),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		try {
			const { name, type, color, description } = req.body;
			const { hat, shirt, pants, shoes } = req.query;

			let set = await Sets.findOne({ name });

			if (set) {
				return res.status(400).json({ errors: [{ msg: 'Set already exists' }] });
			}

			set = new Sets({
				name,
				type,
				color,
				hat,
				shirt,
				pants,
				shoes,
				description,
			});

			res.json(set);
		} catch (err) {
			console.error(err);
			res.status(500).send('Server Error');
		}
	}
);

module.exports = router;
