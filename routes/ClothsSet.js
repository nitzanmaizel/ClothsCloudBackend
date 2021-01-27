const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const ClothsSet = require('../models/ClothsSet');
const getToken = require('../middleware/getToken');

// @route    GET api/clothsset/randomset
// @desc     Get logged in user
// @access   Private

router.get('/randomset/:id', async (req, res) => {
	try {
		let filter = {};
		if (req.query.description) filter.description = req.query.description;
		const user = await User.findOne({ _id: req.params.id })
			.populate('items')
			.select('-password');
		const userShirts = user.items.filter(
			(item) => item.type === 'shirt' && item.description === filter.description
		);
		const randShirt = userShirts[Math.floor(Math.random() * userShirts.length)];
		const userPants = user.items.filter(
			(item) => item.type === 'pants' && item.description === filter.description
		);
		const randPants = userPants[Math.floor(Math.random() * userPants.length)];

		res.json({ randShirt, randPants });
	} catch (err) {
		console.error(err);
		res.status(500).send('Server error');
	}
});

// @route    POST api/clothsset
// @desc     Add Cloths Set to user collection
// @access   Private

router.post(
	'/',
	getToken,
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
			const { name, style, season, pants, shirt } = req.body;

			const userID = req.user.id;

			let user = await User.findOne({ _id: userID }).select('-password');

			const isBelongsShirt = user.items.some((id) => id == shirt);

			const isBelongsPants = user.items.some((id) => id == pants);

			if (!isBelongsShirt || !isBelongsPants) {
				return res.status(400).json({ msg: 'Item doesnt belongs to the user' });
			}

			let clothsSet = await ClothsSet.findOne({ name });

			if (clothsSet) {
				return res.status(400).json({ msg: 'Set already exists' });
			}

			clothsSet = new ClothsSet({
				name,
				style,
				shirt,
				pants,
				season,
				userID,
			});

			await clothsSet.save();

			user.clothsSets.push(clothsSet._id);

			await user.save();

			res.json({ msg: 'A new set added successfully' });
		} catch (err) {
			console.error(err);
			res.status(500).send('Server Error');
		}
	}
);

// @route    PUT api/clothsset/:id
// @desc     Update Cloths Set by ID
// @access   Private

router.put(
	'/:id',
	getToken,

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
			const { name, style, color, season } = req.body;

			const { shirt, pants } = req.query;

			const userID = req.user.id;

			let user = await User.findOne({ _id: userID }).select('-password');

			const isBelongsClothsSet = user.clothsSets.some((id) => id == req.params.id);

			if (!isBelongsClothsSet) {
				return res.status(400).json({ msg: 'Cloths Set doesnt belongs to the user' });
			}

			console.log(isBelongsClothsSet);

			const updatedClothsSet = {
				name,
				style,
				color,
				shirt,
				pants,
				season,
				userID,
			};

			await ClothsSet.findOneAndUpdate(
				{ _id: req.params.id },
				{ $set: updatedClothsSet },
				{ new: true }
			);

			res.json({ msg: 'Cloths Set update successfully' });
		} catch (err) {
			console.error(err);
			res.status(500).send('Server error');
		}
	}
);

// @route    GET api/clothsset
// @desc     Get all Cloths Sets from user collection
// @access   Private

router.get('/userSets', getToken, async (req, res) => {
	try {
		const userID = req.user.id;

		let user = await User.findOne({ _id: userID }).populate('clothsSets');

		if (!user) {
			return res.status(400).json({ msg: 'User not exists' });
		}

		if (user.clothsSets.length === 0) {
			return res.status(404).send({ err: 'No Cloths Sets found' });
		}

		res.json(user.clothsSets);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

// @route    GET api/clothsset/:id
// @desc     Get Cloths Set by ID
// @access   Private

router.get('/userSet/:id', getToken, async (req, res) => {
	try {
		const userID = req.user.id;

		const clothsSet = await ClothsSet.findOne({ _id: req.params.id })
			.populate('shirt')
			.populate('pants');

		if (clothsSet.userID !== userID) {
			return res.status(400).json({ msg: 'Cloths set doesnt belongs to the user' });
		}

		res.json(clothsSet);
	} catch (err) {
		console.error(err);
		res.status(500).send('Server Error');
	}
});

// @route    DELETE api/clothsset/:id
// @desc     Delete set by ID
// @access   Private

router.delete('/:id', getToken, async (req, res) => {
	try {
		const userID = req.user.id;

		let user = await User.findOne({ _id: userID });

		if (!user) {
			return res.status(400).json({ msg: 'User not exists' });
		}

		const clothsSet = await ClothsSet.findOne({ _id: req.params.id });

		if (clothsSet.userID !== userID) {
			return res.status(400).json({ msg: 'Cloths set doesnt belongs to the user' });
		}

		await ClothsSet.findByIdAndDelete({ _id: req.params.id });

		const index = user.clothsSets.indexOf(req.params.id);

		user.clothsSets.splice(index, 1);

		await user.save();

		res.json({ msg: 'Set deleted' });
	} catch (err) {
		console.error(err);
		res.status(500).send('Server Error');
	}
});

// @route    PUT api/clothsset/save/:id
// @desc     Save set to user favorite sets collection
// @access   Private

router.put('/save/:id', getToken, async (req, res) => {
	try {
		const ClothsSetID = req.params.id;

		const userID = req.user.id;

		const clothsSet = await ClothsSet.findOne({ _id: req.params.id });

		if (clothsSet.userID != userID) {
			return res.status(400).json({ msg: 'Cloths set doesnt belongs to the user' });
		}

		let user = await User.findOne({ _id: userID });

		const isSaved = user.favoriteSets.some((id) => id == ClothsSetID);

		if (isSaved) {
			return res.status(400).json({ err: 'Set already saved' });
		}

		user.favoriteSets.push(ClothsSetID);

		await user.save();

		res.json({ msg: 'Set saved successfully' });
	} catch (err) {
		console.error(err);
		res.status(500).send('Server Error');
	}
});

// @route    DELETE api/clothsset/save/:id
// @desc     Delete set from user favorite sets collection
// @access   Private

router.delete('/save/:id', getToken, async (req, res) => {
	try {
		const ClothsSetID = req.params.id;

		const userID = req.user.id;

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
		console.error(err);
		res.status(500).send('Server Error');
	}
});

// @route    GET api/clothsset/favorite
// @desc     Get user favorite sets collection
// @access   Private

router.get('/fav', getToken, async (req, res) => {
	try {
		// const user = await User.findOne({ _id: req.params.id });

		// res.json(user);
		res.json('hello');
	} catch (err) {
		console.error(err);
		res.status(500).send('Server Error');
	}
});

// @route    GET /api/clothsset/search/set/search
// @desc     Get clothSet By query's search
// @access   Private

router.get('/search/:id', getToken, async (req, res) => {
	try {
		let filter = {};
		filter.userID = req.params.id;
		if (req.query.name) filter.name = req.query.name;
		if (req.query.style) filter.style = req.query.style;
		if (req.query.color) filter.color = req.query.color;
		if (req.query.season) filter.season = req.query.season;
		console.log(filter);
		const closthSet = await ClothsSet.find(filter);
		if (closthSet.length === 0) {
			return res.status(404).send({ err: `No items found, try again ` });
		}
		res.json(closthSet);
	} catch (err) {
		console.error(err);
		res.status(500).send('Server Error');
	}
});

module.exports = router;
