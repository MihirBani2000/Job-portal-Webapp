const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ApplicantSchema = new Schema({
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
    education: {
        instituteName: {
            type: String,
            required: true
        },
        startYear: {
            type: Date,
            required: true
        },
        endYear: {
            type: Date
        }
    },
    skills: {
        type: [String],
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 5,
        default: 0
    },
    photo: {
        type: String
    },
    resume: {
        type: String
    }
});

module.exports = Applicant = mongoose.model("Applicant", ApplicantSchema);
