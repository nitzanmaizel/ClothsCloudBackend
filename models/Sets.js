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
	color: {
		type: String,
		required: false,
	},
	hat: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],
	shirt: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],
	pants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],
	shoes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],
	description: {
		type: String,
	},
	date: {
		type: Date,
		default: Date.now(),
	},
});

module.exports = mongoose.model('Sets', Sets);
