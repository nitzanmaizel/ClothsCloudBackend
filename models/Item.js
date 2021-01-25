const mongoose = require('mongoose');

const ItemScheme = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	bodyPart: {
		type: String,
		required: true,
	},
	season: {
		type: String,
		required: true,
	},
	color: {
		type: String,
		required: false,
	},
	style: {
		type: String,
		required: false,
	},
	userID: {
		type: String,
		required: true,
	},
	imageUrl: {
		type: String,
		required: true,
	},
	dateAdded: {
		type: Date,
		default: Date.now(),
	},
});

module.exports = mongoose.model('Item', ItemScheme);
