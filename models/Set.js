const mongoose = require('mongoose');

const Set = new mongoose.Schema({
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
	description: {
		type: String,
	},
	date: {
		type: Date,
		default: Date.now(),
	},
});

module.exports = mongoose.model('Set', Set);
