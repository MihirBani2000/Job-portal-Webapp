var express = require("express");
var router = express.Router();

// Load Jobs model
const Job = require("../models/Job");

// @access Applicant

// GET request 
// Get ALL the Jobs
router.get("/", (req, res) => {
    Job.find((err, job) => {
        if (err) {
            console.log(err);
        } else {
            res.json(job);
        }
    })
});


// @access Recruiter

// POST request 
// Add a new job to db
router.post("/by_recruiter/addnew", (req, res) => {
    // const recruiterId = result.id
    const newJob = new Job({
        title: req.body.title,
        recruiter: { id: req.body.recruiter.id, name: req.body.recruiter.name, email: req.body.recruiter.email },
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
// Get ALL the Jobs by recruiter
router.get("/by_recruiter", (req, res) => {
    Job.find((err, job) => {
        if (err) {
            console.log(err);
        } else {
            res.json(job);
        }
    })
});

// Delete a job by id
router.delete("/by_recruiter/:id", (req, res) => {
    Job.findById(req.params.id)
        .then(job => job.remove().then(() => res.json({ success: true, desc: 'job deleted successfuly' })))
        .catch(err => res.status(404).json({ success: false, desc: 'job not deleted' }))
});

module.exports = router;

