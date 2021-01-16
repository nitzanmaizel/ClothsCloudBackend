const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const Set = require('../models/Set');
const FavoriteSets = require('../models/FavoriteSets');
const getToken = require('../middleware/getToken');

// @route    POST api/sets
// @desc     Add set to user collection
// @access   Private

router.post(
	'/:id',
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
			const { shirt, pants } = req.query;

			let set = await Set.findOne({ name });

			if (set) {
				return res.status(400).json({ errors: [{ msg: 'Set already exists' }] });
			}

			set = new Set({
				name,
				type,
				color,
				shirt,
				pants,
				description,
			});

			await set.save();

			res.json({ msg: 'A new set added successfully' });
		} catch (err) {
			console.error(err);
			res.status(500).send('Server Error');
		}
	}
);

// @route    GET api/sets
// @desc     Get all sets from user collection
// @access   Private

router.get('/', async (req, res) => {
	try {
		const sets = await Set.find({});
		if (sets.length === 0) {
			return res.status(404).send({ err: 'No sets found' });
		}
		res.json(sets);
	} catch (err) {
		console.error(err.massage);
		res.status(500).send('Server Error');
	}
});

// @route    GET api/sets/:id
// @desc     Get set by ID
// @access   Private

router.get('/:id', async (req, res) => {
	try {
		const set = await Set.findOne({ _id: req.params.id })
			.populate('shirt')
			.populate('pants');
		res.json(set);
	} catch (err) {
		console.error(err);
		res.status(500).send('Server Error');
	}
});

module.exports = router;
