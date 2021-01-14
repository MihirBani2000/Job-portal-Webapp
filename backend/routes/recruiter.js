var express = require("express");
var router = express.Router();

// Load models
const Job = require("../models/Job");
const Recruiter = require("../models/Recruiter");
const Applicant = require("../models/Applicant");
const Application = require("../models/Application");


// Get request
// Get all the recruiters
router.get("/", (req, res) => {
    Recruiter.find((err, job) => {
        if (err) {
            console.log(err);
        } else {
            res.json(job);
        }
    })
});

// Get request
// Get all the attributes of one recruiter by id
router.get("/:id/profile", (req, res) => {
    Recruiter.findById(req.params.id, (err, job) => {
        if (err) {
            console.log(err);
        } else {
            res.json(job);
        }
    })
});

// PUT request
// Edit attributes of particular recruiter by id
router.put("/:id/profile/edit", (req, res) => {
    Recruiter.findByIdAndUpdate(
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

// JOBS RELATED

// GET request 
// Get ALL the Jobs by recruiter
router.get("/:id/jobs/", (req, res) => {
    const recruiterId = req.params.id
    Job
        .find({ "recruiter.id": recruiterId })
        .exec((err, job) => {
            if (err) {
                console.log(err);
            } else {
                res.json(job);
            }
        })
});

// POST request 
// Add a new job to db by a particular recruiter (id)
router.post("/:id/jobs/addnew/", (req, res) => {
    const recruiterId = req.params.id;
    const newJob = new Job({
        title: req.body.title,
        recruiter: {
            id: recruiterId,
            name: req.body.recruiter.name,
            email: req.body.recruiter.email
        },
        maxApplicants: Number(req.body.maxApplicants),
        maxPositions: Number(req.body.maxPositions),
        DOPost: req.body.DOPost,
        DOApp: req.body.DOApp,
        skills: req.body.skills,
        typeOfJob: req.body.typeOfJob,
        duration: Number(req.body.duration),
        salary: Number(req.body.salary),
        rating: Number(req.body.rating)
    });

    newJob.save()
        .then(job => {
            res.status(200).json(job);
        })
        .catch(err => {
            res.status(400).send(err);
        });
});

// GET request 
// Get a particular job by recruiter
router.get("/:id/jobs/:jobid", (req, res) => {
    const recruiterId = req.params.id;
    const jobId = req.params.jobid;
    Job
        .find({ "recruiter.id": recruiterId, "_id": jobId })
        .exec((err, job) => {
            if (err) {
                console.log(err);
            } else {
                res.json(job);
            }
        })
});

// PUT request
// Edit job attributes by particular recruiter
router.put("/:id/jobs/:jobid/edit", (req, res) => {
    const recruiterId = req.params.id;
    const jobId = req.params.jobid;
    Job.findOneAndUpdate(
        { "recruiter.id": recruiterId, "_id": jobId },
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

// @Delete request
// Delete a job by id
router.delete("/:id/jobs/:jobid/delete", (req, res) => {
    const recruiterId = req.params.id;
    const jobId = req.params.jobid;
    Application
        .find({ jobId: jobId })
        .then(job => job.remove().then(() => res.json({ success: true, desc: 'application deleted successfuly' })))
        .catch(err => res.status(404).json({ success: false, desc: 'application not deleted, because not found' }))

    Job
        .find({ "recruiter.id": recruiterId, "_id": jobId })
        .then(job => job.remove().then(() => res.json({ success: true, desc: 'job deleted successfuly' })))
        .catch(err => res.status(404).json({ success: false, desc: 'job not deleted, because not found' }))
});


module.exports = router;