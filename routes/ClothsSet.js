const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const ClothsSet = require('../models/ClothsSet');
const getToken = require('../middleware/getToken');
const Item = require('../models/Item');

// @route    POST api/sets
// @desc     Add set to user collection
// @access   Private

router.post(
	'/:id',
	[
		check('name', 'Name is required').not().isEmpty().trim(),
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

			let clothsSet = await ClothsSet.findOne({ name });

			if (clothsSet) {
				return res.status(400).json({ errors: [{ msg: 'Set already exists' }] });
			}

			clothsSet = new ClothsSet({
				name,
				type,
				color,
				shirt,
				pants,
				description,
				// userID: req.user.id,
			});

			await clothsSet.save();

			res.json({ msg: 'A new set added successfully' });
		} catch (err) {
			console.error(err);
			res.status(500).send('Server Error');
		}
	}
);

// @route    PUT api/sets/:id
// @desc     Update set by ID
// @access   Private

router.put(
	'/:id',
	[
		check('name', 'Name is required').not().isEmpty().trim(),
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

			const updatedClothsSet = {
				name,
				type,
				color,
				shirt,
				pants,
				description,
			};

			await ClothsSet.findOneAndUpdate(
				{ _id: req.params.id },
				{ $set: updatedClothsSet },
				{ new: true }
			);

			res.json({ msg: 'Cloths Set update successfully' });
		} catch (err) {
			console.error(err.massage);
			res.status(500).send('Server error');
		}
	}
);

// @route    GET api/sets
// @desc     Get all sets from user collection
// @access   Private

router.get('/', async (req, res) => {
	try {
		const clothsSets = await ClothsSet.find({});
		if (clothsSets.length === 0) {
			return res.status(404).send({ err: 'No sets found' });
		}
		res.json(clothsSets);
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
		const clothsSet = await ClothsSet.findOne({ _id: req.params.id })
			.populate('shirt')
			.populate('pants');
		res.json(clothsSet);
	} catch (err) {
		console.error(err);
		res.status(500).send('Server Error');
	}
});

// @route    DELETE api/sets/:id
// @desc     Delete set by ID
// @access   Private

router.delete('/:id', async (req, res) => {
	try {
		await ClothsSet.findByIdAndDelete({ _id: req.params.id });
		res.json({ msg: 'Set deleted' });
	} catch (err) {
		console.error(err);
		res.status(500).send('Server Error');
	}
});

// @route    PUT api/sets/save/:id
// @desc     Save set to user favorite sets collection
// @access   Private

router.put('/save/:id/:userID', async (req, res) => {
	try {
		const ClothsSetID = req.params.id;
		const userID = req.params.userID;
		let user = await User.findOne({ _id: userID });
		const isSaved = user.favoriteSets.some((id) => id == ClothsSetID);
		if (isSaved) {
			return res.status(400).json({ err: 'Set already saved' });
		}
		user.favoriteSets.push(ClothsSetID);
		await user.save();
		res.json({ msg: 'Set saved successfully' });
	} catch (err) {
		console.error(err.massage);
		res.status(500).send('Server Error');
	}
});

// @route    GET api/sets/favorite
// @desc     Get user favorite sets collection
// @access   Private

router.get('/favorite/:id', async (req, res) => {
	try {
		const user = await User.findOne({ _id: req.params.id }).populate('favoriteSets');
		res.json(user);
	} catch (err) {
		console.error(err);
		res.status(500).send('Server Error');
	}
});

// @route    DELETE api/sets/save/:id
// @desc     Delete set from user favorite sets collection
// @access   Private

router.delete('/save/:id/:userID', async (req, res) => {
	try {
		const ClothsSetID = req.params.id;
		const userID = req.params.userID;
		let user = await User.findOne({ _id: userID });
		const isSaved = user.favoriteSets.some((id) => id == ClothsSetID);
		if (!isSaved) {
			return res.status(400).json({ err: 'Set not found' });
		}
		const index = user.favoriteSets.indexOf(ClothsSetID);
		user.favoriteSets.splice(index, 1);
		await user.save();
		res.json({ msg: 'Set deleted successfully' });
	} catch (err) {
		console.error(err.massage);
		res.status(500).send('Server Error');
	}
});

// @route    GET api/sets/search/item
// @desc     Get items By query's search
// @access   Private

// router.get('/search', async (req, res) => {
// 	try {
// 		let filter = {};
// 		if (req.query.name) filter.name = req.query.name;
// 		if (req.query.type) filter.type = req.query.type;
// 		if (req.query.color) filter.color = req.query.color;
// 		if (req.query.description) filter.description = req.query.description;
// 		const items = await Item.find(filter);
// 		const userItems = items.filter((id) => id === req.user.id);
// 		if (userItems.length === 0) {
// 			return res.status(404).send({ err: `No items found, try again ` });
// 		}
// 		res.json(userItems);
// 	} catch (err) {
// 		console.error(err.massage);
// 		res.status(500).send('Server Error');
// 	}
// });

module.exports = router;