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
		type: Number,
		required: true
	},
	bio: {
		type: String,
		required: true
	},
	hashed_password: {
		type: String,
		required: true
	},
	salt: String,
	about: {
		type: String
	},
	role: {
		type: Number,
		trim: true
	},
	photo: {
		data: Buffer,
		contentType: String
	},
	resetPasswordLink: {
		data: String,
		default: ''
	}
},
	{ timestamp: true }
);

module.exports = User = mongoose.model("Users", UserSchema);
