const mongoose = require('mongoose');

const ClothsSet = new mongoose.Schema({
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
	},
	shirt: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],
	pants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],
	userID: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
	description: {
		type: String,
	},
	date: {
		type: Date,
		default: Date.now(),
	},
});

module.exports = mongoose.model('ClothsSet', ClothsSet);
