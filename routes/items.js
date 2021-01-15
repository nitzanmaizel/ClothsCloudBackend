const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const Item = require('../models/Item');
const getToken = require('../middleware/getToken');

// @route    POST api/signup
// @desc     Signup User
// @access   Public

router.post(
	'/addItem',
	[
		check('name', 'name is required').not().isEmpty().trim(),
		check('type', 'Type name is required').not().isEmpty().trim(),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		try {
			const { name, type, color, description, dateAdded } = req.body;

			let item = await Item.findOne({ name });

			if (item) {
				return res
					.status(400)
					.json({ errors: [{ msg: 'Item already exists' }] });
			}

			item = new Item({
				name,
				type,
				color,
				description,
				dateAdded,
			});

			await item.save();
			res.status(200).send('Item was added successfully');
		} catch (err) {
			console.error(err);
			res.status(500).send('Server error');
		}
	}
);

// @route    POST api/login
// @desc     Login User
// @access   Public

// @route    GET api/user
// @desc     Get logged in user
// @access   Private

router.get('/user', getToken, async (req, res) => {
	try {
		const user = await User.findOne({ _id: req.user.id }).select('-password');
		res.json(user);
	} catch (err) {
		console.error(err.massage);
		res.status(500).send('Server error');
	}
});

module.exports = router;
