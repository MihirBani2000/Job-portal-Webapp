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
    status: {
        type: String,
        default: "applied",
        enum: ["applied", "accepted", "shortlisted", "rejected"]
    }

});


module.exports = Application = mongoose.model("Application", ApplicationSchema);
