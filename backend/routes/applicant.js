var express = require("express");
var router = express.Router();
const FuzzySearch = require("fuzzy-search");
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

async function asyncforEach(array, callback) {
    for (let i = 0; i < array.length; i++) {
        await callback(array[i], i);
    }
}

// JOB RELATED

// GET request 
// Get ALL the Jobs, non rejected and before deadline
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
// Get ALL the Jobs, non rejected and before deadline
// @access Protected - by applicant
router.post("/jobs/all", auth, (req, res) => {
    const applicantId = req.user.id;
    Job.find({ status: "active" }, (err, queries) => {
        if (err) {
            console.log(err);
        } else {
            let jobs = []
            const func = async () => {
                await asyncforEach(queries, async (query) => {
                    // need number of job_applications with status => {Applied, Selected}

                    let curr_time = new Date();
                    let deadline = new Date(query.DOApp);

                    if (curr_time > deadline) return;

                    job = {
                        title: query.title,
                        recruiter: {
                            id: query.recruiter.id,
                            name: query.recruiter.$nename,
                            email: query.recruiter.email
                        },
                        maxApplicants: query.maxApplicants,
                        maxPositions: query.maxPositions,
                        DOApp: query.DOApp,
                        skills: query.skills,
                        typeOfJob: query.typeOfJob,
                        duration: query.duration,
                        salary: query.salary,
                    };
                    job.id = query._id;
                    job.status = "Apply";

                    await Application
                        .find({ applicantId, jobId: query._id })
                        .lean()
                        .exec((error, app) => {
                            if (error) {
                                res.status(200).json(error);
                                return;
                            }
                            job.status = app.status;
                        })

                    if (job.status === "Apply") {
                        await Application
                            .countDocuments({
                                applicantId,
                                job_id: query._id,
                                status: { $ne: 'Rejected' }
                            }, (err, count) => {
                                if (count >= query.maxApplicants) {
                                    job.status = "Full";
                                } else {
                                    job.status = "Apply";
                                }
                            })
                    }

                    if (job.status !== "Rejected")
                        jobs.push(job);
                })

                if (req.body.search && !isEmpty(req.body.search)) {
                    const searcher = new FuzzySearch(jobs, ['title'], {
                        caseSensitive: false,
                        sort: true
                    });
                    jobs = searcher.search(req.body.search)
                }

                res.json(jobs);
            }
            func();
        }
    })
});

// router.post('/home', auth, (req, res) => {
//     const applicant_id = req.user.id;
//     Job
//         .find({})
//         .lean()
//         // .populate('recruiter_id')
//         .exec((error, queries) => {
//             if (error) {
//                 res.status(500).json(error);
//                 return;
//             }
//             let jobs = []
//             const func = async () => {
//                 await asyncforEach(queries, async (query) => {
//                     // need number of job_applications with status => {Applied, Selected}

//                     let curr_time = new Date();
//                     let deadline = new Date(query.deadline);

//                     if (curr_time > deadline) return;

//                     job = {}
//                     job.title = query.title;
//                     job.recruiter.name = query.recruiter_id.name;
//                     job.recruiter_rating = query.recruiter_id.rating;
//                     job.salary = query.salary;
//                     job.deadline = query.deadline;
//                     job.duration = query.duration;
//                     job.type = query.job_type;
//                     job.id = query._id;
//                     job.status = "Apply";

//                     await JobApplication
//                         .find({ applicant_id: applicant_id, job_id: query._id })
//                         .lean()
//                         .exec((error, app) => {
//                             if (error) {
//                                 res.status(200).json(error);
//                                 return;
//                             }
//                             job.status = app.status;
//                         })

//                     if (job.status === "Apply") {
//                         await JobApplication
//                             .countDocuments({
//                                 applicant_id: applicant_id,
//                                 job_id: query._id,
//                                 status: { $ne: 'Rejected' }
//                             }, (err, count) => {
//                                 if (count >= query.max_applications) {
//                                     job.status = "Full";
//                                 } else {
//                                     job.status = "Apply";
//                                 }
//                             })
//                     }

//                     if (job.status !== "Rejected")
//                         jobs.push(job);
//                 })

//                 if (req.body.search && !isEmpty(req.body.search)) {
//                     const searcher = new FuzzySearch(jobs, ['title'], {
//                         caseSensitive: false,
//                         sort: true
//                     });
//                     jobs = searcher.search(req.body.search)
//                 }

//                 res.json(jobs);
//             }
//             func();
//         })
// })


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
// Get ALL the applied Jobs
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
