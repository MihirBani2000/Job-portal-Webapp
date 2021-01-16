const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs')
const config = require('config')
const jwt = require('jsonwebtoken')
const auth = require('../middleware/auth')

// Load models
const Job = require("../models/Job");
const Recruiter = require("../models/Recruiter");
const Applicant = require("../models/Applicant");
const Application = require("../models/Application");
const { isMatch } = require("fuzzy-search");


// APPLICANTS 



// Post request
// Login/Authenticate an Applicant
router.post("/auth/applicant", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    // VALIDATION - to be done

    // check if already exists by email
    Applicant.findOne({ email })
        .then(applicant => {
            if (!applicant) {
                return res.status(400).json({ msg: 'User does not exist' })
            }

            // validating password
            bcrypt.compare(password, applicant.password)
                .then(isMatch => {
                    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" })

                    jwt.sign(
                        { id: applicant.id },
                        config.get('jwtSecret'),
                        { expiresIn: config.get('tokenExpiry') },
                        (err, token) => {
                            if (err) throw err;
                            res.json({
                                token,
                                applicant: {
                                    id: applicant.id,
                                    name: applicant.name,
                                    email: applicant.email
                                }
                            })
                        }
                    )
                })
        })
});



// Post request
// Register an Applicant, add it to db
router.post("/register/applicant", (req, res) => {
    const email = req.body.email;

    // check if already exists by email
    Applicant.findOne({ email })
        .then(applicant => {
            if (applicant) {
                return res.status(400).json({ msg: 'User already exists' })
            }

            const newApplicant = new Applicant({
                name: req.body.name,
                email: email,
                password: req.body.password,
                education: {
                    instituteName: req.body.education.instituteName,
                    startYear: req.body.education.startYear,
                    endYear: req.body.education.endYear
                },
                skills: req.body.skills,
                rating: req.body.rating
            });

            // Create salt and hash
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newApplicant.password, salt, (err, hash) => {
                    if (err) throw err;
                    newApplicant.password = hash;
                    newApplicant.save()
                        .then(applicant => {
                            jwt.sign(
                                { id: applicant.id },
                                config.get('jwtSecret'),
                                { expiresIn: config.get('tokenExpiry') },
                                (err, token) => {
                                    if (err) throw err;
                                    res.json({
                                        token,
                                        applicant: {
                                            id: applicant.id,
                                            name: applicant.name,
                                            email: applicant.email
                                        }
                                    })
                                }
                            )

                        })
                        .catch(err => res.status(400).send(err))
                })
            })
        })
});


// Get request
// Get applicant details
// @access Private
router.get('/applicant', auth, (req, res) => {
    Applicant.findById(req.user.id)
        .select('-password')
        .then(applicant => res.json(applicant));
});

// RECRUITERS

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

