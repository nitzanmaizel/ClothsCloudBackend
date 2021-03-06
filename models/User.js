const mongoose = require('mongoose');

const UserScheme = new mongoose.Schema({
	firstName: {
		type: String,
		required: true,
	},
	lastName: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	favoriteSets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ClothsSet' }],
	clothsSets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ClothsSet' }],
	favoriteItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],
	items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],
	password: {
		type: String,
		required: true,
	},
	date: {
		type: Date,
		default: Date.now(),
	},
});

module.exports = mongoose.model('User', UserScheme);
