const express = require("express");
const router = express.Router();
const auth = require('../middleware/auth')
const _ = require('lodash')

// Load models
const Job = require("../models/Job");
const Recruiter = require("../models/Recruiter");
const Applicant = require("../models/Applicant");
const Application = require("../models/Application");

// Load validation functions
const { validateApplicantProfile } = require("../validation/profile");


async function asyncforEach(array, callback) {
    for (let i = 0; i < array.length; i++) {
        await callback(array[i], i);
    }
}

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
// Get ALL the Jobs, non rejected and before deadline
// @access Protected - by applicant
router.get("/jobs/all", auth, async (req, res) => {
    const applicantId = req.user.id;

    await Job
        .find({ status: 'active' })
        .lean()
        .then((queries) => {
            let jobs = []
            const func = async () => {
                await asyncforEach(queries, async (query) => {
                    // return if deadline passed
                    if (query.DOApp < Date.now) return;

                    let job = _.cloneDeep(query)

                    // check if already applied
                    const tempApplications = await Application
                        .findOne({ applicantId, jobId: query._id })

                    if (tempApplications) {
                        job.status = tempApplications.status;
                        // console.log("J - A", job.status, tempApplications.status)
                    }

                    // check for vacancy
                    if (job.status === "active") {
                        let count = await Application
                            .find({ jobId: query._id, status: { $ne: 'rejected' } })
                        count = count.length;

                        if (count >= query.maxApplicants) {
                            job.status = "full";
                        }
                    }

                    if (job.status !== 'full' && job.status !== 'active' && job.status !== 'rejected')
                        job.status = 'applied'
                    // console.log(job.status)
                    if (job.status !== "rejected")
                        jobs.push(job);
                })
                res.json(jobs);
            }
            func();
        })
        .catch(err => console.log(err))
})


// POST request 
// Add a new job to db by a particular recruiter (id)
// @access Protected - by applicant
router.post("/jobs/:jobid/apply", auth, (req, res) => {
    const applicantId = req.user.id;
    const jobId = req.params.jobid;
    const newApplication = new Application({
        applicantId: applicantId,
        jobId: jobId,
        sop: req.body.sop,
    });

    // let maxApplicants = await Job.findById(jobId)
    //     .then((query) => {
    //         return query.maxApplicants
    //     }).catch(err => { throw err })

    // let numApp = await Application.find({ jobId })
    // numApp = numApp.length
    // if (numApp < maxApplicants) {
    newApplication.save()
        .then(job => {
            res.status(200).json(job);
        })
        .catch(err => {
            res.status(400).send(err);
        })
    // }
});

// GET request 
// Get ALL the applied Jobs
// still left
// @access Protected - by applicant
router.get("/jobs/applied", auth, (req, res) => {
    const applicantId = req.user.id;
    // console.log("applicantId", applicantId)
    Application
        .find({ applicantId })
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
