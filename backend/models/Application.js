const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ApplicationSchema = new Schema({
    applicantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Applicant',
        required: true
    },
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    sop: {
        type: String,
        required: true
    },
    DOJ: {
        type: Date,
        default: ''
    },
    status: {
        type: String,
        default: "applied",
        enum: ["applied", "accepted", "shortlisted", "rejected"]
    },
    ratingByRecruiter: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    ratingByApplicant: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    }

});


module.exports = Application = mongoose.model("Application", ApplicationSchema);
