var express = require("express");
var router = express.Router();
const auth = require('../middleware/auth')

// Load models
const Job = require("../models/Job");
const Recruiter = require("../models/Recruiter");
const Applicant = require("../models/Applicant");
const Application = require("../models/Application");

// load validators
const { validateJobData, validateEditJobData } = require('../validation/jobs');
const { validateRecruiterProfile } = require("../validation/profile");

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
// Get all the attributes of one recruite
// @Private
router.get("/profile", auth, (req, res) => {
    const id = req.user.id;
    Recruiter
        .findById(id).lean()
        .select("-password")
        .exec((err, profile) => {
            if (err) {
                console.log(err);
                res.status(500).json(error)
            } else {
                res.json(profile);
            }
        })
});

// PUT request
// Edit attributes of particular recruiter
// @Private
router.put("/profile/edit", auth, (req, res) => {
    const id = req.user.id;
    const { errors, isValid } = validateRecruiterProfile(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }

    Recruiter.findByIdAndUpdate(
        id,
        req.body,
        { new: true },
        (err, profile) => {
            if (err) {
                console.log(err);
            } else {
                res.json(profile);
            }
        })
});


// JOBS RELATED

// GET request 
// Get ALL the Jobs by recruiter
// @Private
router.get("/jobs/", auth, (req, res) => {
    const recruiterId = req.user.id
    Job
        .find({ "recruiter.id": recruiterId })
        .lean()
        .exec((err, job) => {
            if (err) {
                res.status(500).json(error);
                console.log(err);
            } else {
                res.json(job);
            }
        })
});

// POST request 
// Add a new job to db by a particular recruiter (id)
// @Private
router.post("/jobs/addnew/", auth, (req, res) => {
    // VALIDATION
    const { errors, isValid } = validateJobData(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }

    // const recruiterId = req.params.id;
    const recruiterId = req.user.id;
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
        // rating: Number(req.body.rating)
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
// @Private
router.get("/jobs/:jobid", auth, (req, res) => {
    const recruiterId = req.user.id;
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
// @Private
router.put("/jobs/:jobid/edit", auth, (req, res) => {
    const { errors, isValid } = validateEditJobData(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }
    const recruiterId = req.user.id;
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
// @Private
router.delete("/jobs/:jobid/delete", auth, (req, res) => {
    const recruiterId = req.user.id;
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
// @Private
router.get("/jobs/:jobid/applications", auth, (req, res) => {
    const recruiterId = req.user.id;
    const jobId = req.params.jobid;
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
// @Private
router.get("/jobs/:jobid/applications/accepted", auth, (req, res) => {
    const recruiterId = req.user.id;
    const jobId = req.params.jobid;
    Application
        .find({ jobId: jobId, status: "accepted" })
        .populate('applicantId').populate('jobId')
        .then(application => res.json(application))
        .catch(err => console.log(err))
});


// POST request
// To change the status of the application
// @Private
router.post("/jobs/:jobid/applications/:status", auth, (req, res) => {
    const recruiterId = req.user.id;
    const jobId = req.params.jobid;
    const newStatus = req.params.status;
    let currentDate = Date.now()
    if (newStatus === "accepted") {
        Application
            .findOneAndUpdate(
                { jobId, status: { $in: ["applied", "shortlisted"] } },
                { status: newStatus, DOJ: currentDate },
                { new: true, upsert: true }
            )
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
// @Private
router.delete("/jobs/:jobid/applications/rejected", (req, res) => {
    const recruiterId = req.user.id;
    const jobId = req.params.jobid;

    Application
        .findOneAndDelete({ jobId: jobId, status: "rejected" })
        .then(application => res.json(application))
        .catch(err => res.json(err))
});

module.exports = router;