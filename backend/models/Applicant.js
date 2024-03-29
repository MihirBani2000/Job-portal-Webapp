const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Education Schema
const EducationSchema = new Schema({
    instituteName: {
        type: String,
        required: true
    },
    startYear: {
        type: String,
        required: true,
        maxLength: 4
    },
    endYear: {
        type: String,
        maxLength: 4
    }
});

// Create Applicant Schema 
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
    password: {
        type: String,
        required: true
    },
    education: {
        type: [EducationSchema],
        required: true
    },
    skills: {
        type: [String],
        required: true
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },

});

module.exports = Applicant = mongoose.model("Applicant", ApplicantSchema);
