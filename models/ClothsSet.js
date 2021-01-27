const mongoose = require('mongoose');

const ClothsSet = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	style: {
		type: String,
		required: true,
	},
	season: {
		type: String,
	},
	shirt: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Items' }],
	pants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Items' }],
	userID: {
		type: String,
		required: true,
	},
	date: {
		type: Date,
		default: Date.now(),
	},
});

module.exports = mongoose.model('ClothsSet', ClothsSet);
