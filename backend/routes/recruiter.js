var express = require("express");
var router = express.Router();
const auth = require('../middleware/auth')

// Load models
const Job = require("../models/Job");
const Recruiter = require("../models/Recruiter");
const Applicant = require("../models/Applicant");
const Application = require("../models/Application");

// load validators
const { validateJobData } = require('../validation/jobs')

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
    // VALIDATION
    const { errors, isValid } = validateJobData(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }

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
        // DOPost: req.body.DOPost,
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

    Job.find(
        { "recruiter.id": recruiterId, "_id": jobId },
        (err, job) => {
            if (err) return res.json(err);
            else {
                Application
                    .deleteMany({ jobId: jobId })
                    .then(query => console.log(query))
                    .catch(err => console.log(err));
                Job
                    .findByIdAndDelete(jobId)
                    .then(jobq => res.json({ success: true, desc: jobq }))
                    .catch(err => res.json({ success: false, desc: err }))
                return res.json(job)
            }
        }
    );

});



// GET request
// To get all the applications on the job
router.get("/:id/jobs/:jobid/applications", (req, res) => {
    const recruiterId = req.params.id;
    const jobId = req.params.jobid;
    // Job.find(
    //     { "recruiter.id": recruiterId, "_id": jobId },
    //     (err, job) => {
    //         if (err) return console.log(err)
    //         else {
    //             Application
    //                 .find({ jobId: jobId })
    //                 .populate('applicantId')
    //                 .then(application => res.json(application))
    //                 .catch(err => console.log(err))
    //             res.json(job)
    //         }
    //     }
    // );
    Application
        .find({ jobId: jobId })
        .populate('applicantId').populate('jobId')
        .then(application => res.json(application))
        .catch(err => console.log(err))
});


// TESTING
// GET request
// To get all the applications on the job
// router.get("/:id/jobs/:jobid/testing", (req, res) => {
//     const recruiterId = req.params.id;
//     const jobId = req.params.jobid;
//     Job.find(
//         { "recruiter.id": recruiterId, "_id": jobId },
//         (err, job) => {
//             if (err) return console.log(err)
//             else {
//                 // Application
//                 //     .find({ jobId: jobId })
//                 //     .populate('applicantId')
//                 //     .then(application => res.json(application))
//                 //     .catch(err => console.log(err))
//                 res.json(job)
//             }
//         }
//     );
//     //     Application
//     //         .find({ jobId: jobId })
//     //         .populate('applicantId').populate('jobId')
//     //         .then(application => res.json(application))
//     //         .catch(err => console.log(err))
// });

// GET request
// To get all the accepted applications on the job
router.get("/:id/jobs/:jobid/applications/accepted", (req, res) => {
    const recruiterId = req.params.id;
    const jobId = req.params.jobid;
    Application
        .find({ jobId: jobId, status: "accepted" })
        .populate('applicantId').populate('jobId')
        .then(application => res.json(application))
        .catch(err => console.log(err))
});



// POST request
// To change the status of the application
router.post("/:id/jobs/:jobid/applications/:status", (req, res) => {
    const recruiterId = req.params.id;
    const jobId = req.params.jobid;
    const newStatus = req.params.status;

    if (newStatus === "accepted") {
        Application
            .findOneAndUpdate({ jobId: jobId, status: { $in: ["applied", "shortlisted"] } }, { status: newStatus })
            .then(application => res.json(application))
            .catch(err => res.json(err))
    } else if (newStatus === "shortlisted") {
        Application
            .findOneAndUpdate({ jobId: jobId, status: { $in: ["applied"] } }, { status: newStatus })
            .then(application => res.json(application))
            .catch(err => res.json(err))
    } else {
        Application
            .findOneAndUpdate({ jobId: jobId }, { status: newStatus })
            .then(application => res.json(application))
            .catch(err => res.json(err))
    }
});

// DELETE request
// To delete a rejected application
router.delete("/:id/jobs/:jobid/applications/rejected", (req, res) => {
    const recruiterId = req.params.id;
    const jobId = req.params.jobid;

    Application
        .findOneAndDelete({ jobId: jobId, status: "rejected" })
        .then(application => res.json(application))
        .catch(err => res.json(err))
});

module.exports = router;