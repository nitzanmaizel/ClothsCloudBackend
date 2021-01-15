const mongoose = require('mongoose');

const ItemScheme = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	type: {
		type: String,
		required: true,
	},
	color: {
		type: String,
		required: false,
	},
	description: {
		type: String,
		required: false,
	},

	dateAdded: {
		type: Date,
		default: Date.now(),
	},
});

module.exports = mongoose.model('Item', ItemScheme);
