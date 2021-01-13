var express = require("express");
var router = express.Router();

// Load Jobs model
const Job = require("../models/Job");

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


// POST request 
// Add a new job to db
// @access Recruiter
router.post("/addnew", (req, res) => {
    const newJob = new Job({
        title: req.body.title,
        recruiter: { name: req.body.recruiter.name, email: req.body.recruiter.email },
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


// // Get request 
// // Get a job by id
// // @access Public
// router.get("/:id", (req, res) => {
//     Jobs.findById(req.params.id)
//         .then(job => job.remove().then(() => res.json({ success: true, desc: 'job deleted successfuly' })))
//         .catch(err => res.status(404).json({ success: false, desc: 'job not deleted' }))
// });


// Delete request 
// Delete a job
// @access Recruiter
router.delete("/:id", (req, res) => {
    Job.findById(req.params.id)
        .then(job => job.remove().then(() => res.json({ success: true, desc: 'job deleted successfuly' })))
        .catch(err => res.status(404).json({ success: false, desc: 'job not deleted' }))
});

module.exports = router;

