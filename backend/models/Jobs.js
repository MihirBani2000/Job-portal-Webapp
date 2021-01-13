const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const JobSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    recruiter: {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            lowecase: true,
            match: /\S+@\S+\.\S+/
        }
    },
    maxApplicants: {
        type: Number,
        required: true
    },
    maxPositions: {
        type: Number,
        required: true
    },
    DOPost: {
        type: Date,
        required: true,
        default: Date.now
    },
    DOApp: {
        type: Date,
        required: true
    },
    skills: {
        type: [String],
        required: true,
    },
    typeOfJob: {
        type: String,
        required: true,
        lowecase: true,
        enum: ["full-time", "part-time", "work from home"]
    },
    duration: {
        type: Number,
        min: 0,
        max: 7,
        required: true,
    },
    salary: {
        type: Number,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 5,
        default: 0
    }

},
    { timestamp: true }
);

module.exports = Jobs = mongoose.model("Jobs", JobSchema);
