var express = require("express");
var router = express.Router();

// Load models
const Job = require("../models/Job");
const Recruiter = require("../models/Recruiter");
const Applicant = require("../models/Applicant");
const Application = require("../models/Application");


// Post request
// Register an Applicant, add it to db
router.post("/register/applicant", (req, res) => {
    const newApplicant = new Applicant({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        education: {
            instituteName: req.body.education.instituteName,
            startYear: req.body.education.startYear,
            endYear: req.body.education.endYear
        },
        skills: req.body.skills,
        rating: req.body.rating
    });

    newApplicant.save()
        .then(applicant => {
            res.status(200).json(applicant);
        })
        .catch(err => {
            res.status(400).send(err);
        });
});


// Post request
// Register an Recruiter, add it to db
router.post("/register/recruiter", (req, res) => {
    const newRecruiter = new Recruiter({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        contactNum: req.body.contactNum,
        bio: req.body.bio
    });

    newRecruiter.save()
        .then(recruiter => {
            res.status(200).json(recruiter);
        })
        .catch(err => {
            res.status(400).send(err);
        });
});



// POST request 
// Login applicant
router.post("/login/applicant", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    // Find Applicant by email
    Applicant.findOne({ email }).then(applicant => {
        // Check if applicant email exists
        if (!applicant) {
            return res.status(404).json({
                error: "Email not found",
            });
        }
        else {
            res.send("Email Found");
            return applicant;
        }
    });
});


module.exports = router;

