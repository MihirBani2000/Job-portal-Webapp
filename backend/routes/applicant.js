var express = require("express");
var router = express.Router();
const auth = require('../middleware/auth')

// Load models
const Job = require("../models/Job");
const Recruiter = require("../models/Recruiter");
const Applicant = require("../models/Applicant");
const Application = require("../models/Application");

// Load validation functions
const { validateApplicantProfile } = require("../validation/profile");

// APPLICANT RELATED

// @Get request
// Get all the Applicants
router.get("/", (req, res) => {
    Applicant.find((err, applicant) => {
        if (err) {
            console.log(err);
        } else {
            res.json(applicant);
        }
    })
});

// Get request
// Get all the attributes of one applicant
// @access Protected - by applicant
router.get("/profile", auth, (req, res) => {
    const id = req.user.id;
    Applicant
        .findById(id)
        .select('-password').lean()
        .exec((err, applicant) => {
            if (err) {
                console.log(err);
            } else {
                res.json(applicant);
            }
        })
});

// PUT request
// Edit attributes of particular applicant 
// @access Protected - by applicant
router.put("/profile/edit", auth, (req, res) => {
    const id = req.user.id;
    const { errors, isValid } = validateApplicantProfile(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }
    Applicant.findByIdAndUpdate(
        id,
        req.body,
        { new: true },
        (err, job) => {
            if (err) {
                console.log(err);
            } else {
                res.json(job);
            }
        })
});


// JOB RELATED

// GET request 
// Get ALL the Jobs
// @access Protected - by applicant
router.get("/jobs/all", auth, (req, res) => {
    Job.find((err, job) => {
        if (err) {
            console.log(err);
        } else {
            res.json(job);
        }
    })
});


// POST request 
// Add a new job to db by a particular recruiter (id)
// @access Protected - by applicant
router.post("/jobs/:jobid/apply", auth, (req, res) => {
    const applicantId = req.user.id;
    const jobId = req.params.jobid;
    const newApplication = new Application({
        applicantId: applicantId,
        jobId: jobId,
        sop: req.body.sop
    });

    newApplication.save()
        .then(job => {
            res.status(200).json(job);
        })
        .catch(err => {
            res.status(400).send(err);
        });
});

// GET request 
// Get ALL the apllied Jobs
// still left
// @access Protected - by applicant
router.get("/jobs/applied", auth, (req, res) => {
    const applicantId = req.user.id;
    Application
        .find({ applicantId: applicantId })
        .populate('jobId')
        .exec((err, query) => {
            if (err) {
                console.log(err);
            } else {
                res.json(query);
            }
        })
});

module.exports = router;
