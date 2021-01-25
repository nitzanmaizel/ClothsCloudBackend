const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const Item = require('../models/Item');

const getToken = require('../middleware/getToken');

const { cloudinary } = require('../util/cloudinary');

// @route    GET api/sets/search/item
// @desc     Get items By query's search
// @access   Private

router.get('/search', getToken, async (req, res) => {
	try {
		let filter = {};

		filter.userID = req.user.id;

		if (req.query.name) filter.name = req.query.name;

		if (req.query.type) filter.type = req.query.type;

		if (req.query.color) filter.color = req.query.color;

		if (req.query.description) filter.description = req.query.description;

		const items = await Item.find(filter);

		if (items.length === 0) {
			return res.status(404).send({ err: `No items found, try again ` });
		}

		res.json(items);
	} catch (err) {
		console.error(err);
		res.status(500).send('Server Error');
	}
});

// @route
// @desc
// @access

router.get('/item/:id', async (req, res) => {
	console.log(req.params.id);
	try {
		const item = await Item.findOne({ _id: req.params.id });
		res.json(item);
	} catch (err) {
		console.error(err.massage);
		res.status(500).send('Server error');
	}
});

router.post(
	'/addItem',
	getToken,
	[
		check('name', 'Name is required').not().isEmpty().trim(),
		check('season', 'Season is required').not().isEmpty().trim(),
		check('style', 'Style name is required').not().isEmpty().trim(),
	],
	async (req, res) => {
		// const userID = req.user.id;

		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		try {
			const { bodyPart, color, style, season, imageUrl, name, userID } = req.body;

			const uploadResponse = await cloudinary.uploader.upload(imageUrl, {
				upload_preset: 'cloudcloset',
			});

			const user = await User.findOne({ _id: userID }).select('-password');

			const items = await Item.find({ name });

			const isExists = items.some((item) => item.userID === userID);

			if (isExists) {
				return res.status(400).json({ errors: [{ msg: 'Item already exists' }] });
			}

			const newItem = new Item({
				bodyPart,
				color,
				style,
				season,
				name,
				userID,
				imageUrl: uploadResponse.url,
			});

			await newItem.save();

			user.items.push(newItem._id);

			await user.save();

			res.status(200).send('Item was added successfully');
		} catch (err) {
			console.error(err);
			res.status(500).send('Server error');
		}
	}
);

// @route
// @desc
// @access

router.put(
	'/:id',
	[
		check('name', 'Name is required').not().isEmpty().trim(),
		check('type', 'Type is required').not().isEmpty().trim(),
		check('color', 'Color is required').not().isEmpty().trim(),
		check('description', 'Description is required').not().isEmpty().trim(),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		try {
			const { name, type, color, description } = req.body;

			const updatedItem = {
				name,
				type,
				color,
				description,
			};

			await Item.findOneAndUpdate(
				{ _id: req.params.id },
				{ $set: updatedItem }
				// { new: true }
			);
		} catch (err) {
			console.error(err);
			res.status(500).send('Server error');
		}
	}
);

module.exports = router;
