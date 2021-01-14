var express = require("express");
var router = express.Router();

// Load models
const Job = require("../models/Job");
const Recruiter = require("../models/Recruiter");
const Applicant = require("../models/Applicant");
const Application = require("../models/Application");

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
// Get all the attributes of one aapplicant by id
router.get("/:id/profile", (req, res) => {
    Applicant.findById(req.params.id, (err, applicant) => {
        if (err) {
            console.log(err);
        } else {
            res.json(applicant);
        }
    })
});

// PUT request
// Edit attributes of particular applicant by id
router.put("/:id/profile/edit", (req, res) => {
    Applicant.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
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
router.get("/:id/jobs/all", (req, res) => {
    Job.find((err, job) => {
        if (err) {
            console.log(err);
        } else {
            res.json(job);
        }
    })
});

// GET request 
// Get ALL the Jobs
// router.get("/jobs/all", (req, res) => {
//     Job.find((err, job) => {
//         if (err) {
//             console.log(err);
//         } else {
//             res.json(job);
//         }
//     })
// });

// POST request 
// Add a new job to db by a particular recruiter (id)
router.post("/:id/jobs/:jobid/apply", (req, res) => {
    const applicantId = req.params.id;
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
router.get("/:id/jobs/applied", (req, res) => {
    const applicantId = req.params.id;
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
