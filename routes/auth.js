const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const getToken = require('../middleware/getToken');

// @route    POST api/signup
// @desc     Signup User
// @access   Public

router.post(
	'/signup',
	[
		check('firstName', 'First name is required').not().isEmpty().trim(),
		check('lastName', 'Last name is required').not().isEmpty().trim(),
		check('email', 'Please enter valid email').isEmail(),
		check('password', 'Password must be greater than 6 character').isLength({
			min: 6,
		}),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		try {
			const { firstName, lastName, email, password } = req.body;

			let user = await User.findOne({ email });

			if (user) {
				return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
			}

			user = new User({
				firstName,
				lastName,
				email,
				password,
			});

			const salt = await bcrypt.genSalt(10);

			user.password = await bcrypt.hash(password, salt);

			await user.save();

			const payload = {
				id: user.id,
			};

			jwt.sign(payload, process.env.jwtSecret, { expiresIn: 360000 }, (err, token) => {
				if (err) {
					throw err;
				}
				res.cookie('token', token);
				res.json(token);
			});
		} catch (err) {
			console.error(err.massage);
			res.status(500).send('Server error');
		}
	}
);

// @route    POST api/login
// @desc     Login User
// @access   Public

router.post(
	'/login',
	[
		check('email', 'Email is invalid').isEmail(),
		check('password', 'Password is required').exists(),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		try {
			const { email, password } = req.body;

			const user = await User.findOne({ email });

			if (!user) {
				return res.status(400).json({ errors: [{ msg: 'Invalid Credential' }] });
			}

			const isMatch = await bcrypt.compare(password, user.password);

			if (!isMatch) {
				return res.status(400).json({ errors: [{ msg: 'Invalid Credential' }] });
			}

			const payload = {
				id: user.id,
			};
			jwt.sign(payload, process.env.jwtSecret, { expiresIn: 360000 }, (err, token) => {
				if (err) {
					throw err;
				}
				res.cookie('token', token);
				res.json(token);
			});
		} catch (err) {
			console.error(err);
			res.status(500).send('Server error');
		}
	}
);

// @route    GET api/auth
// @desc     Get logged in user
// @access   Private

router.get('/auth', getToken, async (req, res) => {
	try {
		const user = await User.findOne({ _id: req.user.id }).select('-password');
		res.json(user);
	} catch (err) {
		console.error(err.massage);
		res.status(500).send('Server error');
	}
});

module.exports = router;
