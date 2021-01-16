const mongoose = require('mongoose');

const Sets = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	type: {
		type: String,
		required: true,
	},
	hat: {
		type: String,
	},
	shirt: {
		type: String,
		required: true,
	},
	pants: {
		type: String,
		required: true,
	},
	color: {
		type: String,
		required: false,
	},
	Shoes: {
		type: String,
	},
	description: {
		type: String,
	},
	date: {
		type: Date,
		default: Date.now(),
	},
});

module.exports = mongoose.model('Sets', Sets);
