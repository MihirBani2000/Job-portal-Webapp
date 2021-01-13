const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		lowercase: true,
		unique: true,
		match: /\S+@\S+\.\S+/
	},
	contactNum: {
		type: String,
		required: true
	},
	bio: {
		type: String,
		required: true
	},
	date: {
		type: Date,
		default: Date.now
	}
},
	{ timestamp: true }
);

module.exports = User = mongoose.model("User", UserSchema);
