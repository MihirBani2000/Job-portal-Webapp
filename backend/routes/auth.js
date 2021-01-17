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

// load validators
const { validateLoginData } = require('../validation/login')
const { validateApplicantRegister, validateRecruiterRegister } = require('../validation/register')

// function for checking and validating password
const validatePasswordLogin = (user, password) => {
    bcrypt.compare(password, user.password)
        .then(isMatch => {
            if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" })

            jwt.sign(
                { id: user.id },
                config.get('jwtSecret'),
                { expiresIn: config.get('tokenExpiry') },
                (err, token) => {
                    if (err) throw err;
                    res.json({
                        token,
                        user: {
                            id: user.id,
                            name: user.name,
                            email: user.email
                        }
                    })
                }
            )
        })
}


// APPLICANTS 

// @Post request - /login/applicant
// Login/Authenticate an Applicant
router.post("/login/applicant", (req, res) => {

    // VALIDATION
    const { errors, isValid } = validateLoginData(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;

    // check if already exists by email
    Applicant.findOne({ email })
        .then(applicant => {
            if (!applicant) {
                return res.status(400).json({ msg: 'User does not exist' })
            }
            // validating password
            validatePasswordLogin = (applicant, password)
            // bcrypt.compare(password, applicant.password)
            //     .then(isMatch => {
            //         if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" })

            //         jwt.sign(
            //             { id: applicant.id },
            //             config.get('jwtSecret'),
            //             { expiresIn: config.get('tokenExpiry') },
            //             (err, token) => {
            //                 if (err) throw err;
            //                 res.json({
            //                     token,
            //                     applicant: {
            //                         id: applicant.id,
            //                         name: applicant.name,
            //                         email: applicant.email
            //                     }
            //                 })
            //             }
            //         )
            //     })
        })
});



// @Post request - /register/applicant
// Register an Applicant, add it to db
router.post("/register/applicant", (req, res) => {

    // VALIDATION
    const { errors, isValid } = validateApplicantRegister(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }

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

// @Post request - /register/recruiter
// Register an Recruiter, add it to db
router.post("/register/recruiter", (req, res) => {
    // VALIDATION
    const { errors, isValid } = validateRecruiterRegister(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    // check if already exists by email
    recruiter.findOne({ email })
        .then(recruiter => {
            if (recruiter) {
                return res.status(400).json({ msg: 'User already exists' })
            }

            const newRecruiter = new Recruiter({
                name: req.body.name,
                email: email,
                password: req.body.password,
                contactNum: req.body.contactNum,
                bio: req.body.bio
            });

            // Create salt and hash
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newRecruiter.password, salt, (err, hash) => {
                    if (err) throw err;
                    newRecruiter.password = hash;
                    newRecruiter.save()
                        .then(recruiter => {
                            jwt.sign(
                                { id: recruiter.id },
                                config.get('jwtSecret'),
                                { expiresIn: config.get('tokenExpiry') },
                                (err, token) => {
                                    if (err) throw err;
                                    res.json({
                                        token,
                                        recruiter: {
                                            id: recruiter.id,
                                            name: recruiter.name,
                                            email: recruiter.email
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



// @POST request - login/recruiter
// Login recruiter
router.post("/login/recruiter", (req, res) => {
    // VALIDATION
    const { errors, isValid } = validateLoginData(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;

    // check if already exists by email
    Recruiter.findOne({ email })
        .then(recruiter => {
            if (!recruiter) {
                return res.status(400).json({ msg: 'User does not exist' })
            }

            // validating password
            validatePasswordLogin = (recruiter, password)
            // bcrypt.compare(password, recruiter.password)
            //     .then(isMatch => {
            //         if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" })

            //         jwt.sign(
            //             { id: recruiter.id },
            //             config.get('jwtSecret'),
            //             { expiresIn: config.get('tokenExpiry') },
            //             (err, token) => {
            //                 if (err) throw err;
            //                 res.json({
            //                     token,
            //                     recruiter: {
            //                         id: recruiter.id,
            //                         name: recruiter.name,
            //                         email: recruiter.email
            //                     }
            //                 })
            //             }
            //         )
            //     })
        })

});

// Get request
// Get recruiter details
// @access Private
router.get('/recruiter', auth, (req, res) => {
    Applicant.findById(req.user.id)
        .select('-password')
        .then(applicant => res.json(applicant));
});


module.exports = router;

