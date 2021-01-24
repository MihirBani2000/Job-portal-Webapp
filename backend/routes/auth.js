const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs')
const config = require('config')
const jwt = require('jsonwebtoken')
const auth = require('../middleware/auth')

// Load models
const Recruiter = require("../models/Recruiter");
const Applicant = require("../models/Applicant");

// load validators
const { validateLoginData } = require('../validation/login')
const { validateApplicantRegister, validateRecruiterRegister } = require('../validation/register')

// LOGIN

// function for checking and validating password
const validatePasswordLogin = (user, password, type, res) => {
    bcrypt.compare(password, user.password)
        .then(isMatch => {
            if (!isMatch) {
                let error = {}
                error.password = "Invalid credentials";
                return res.status(400).json(error)
            }
            jwt.sign(
                { // jwt payload
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    type: type
                },
                config.get('jwtSecret'),
                { expiresIn: config.get('tokenExpiry') },
                (err, token) => {
                    if (err) throw err;
                    res.json({
                        token,
                        user: {
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            type: type
                        }
                    })
                }
            )
        })
}


// @Post request - /login/
// Login/Authenticate an Applicant/Recruiter
// @Public
router.post("/login", (req, res) => {
    // VALIDATION
    const { errors, isValid } = validateLoginData(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;

    // check if already exists by email
    Applicant
        .findOne({ email })
        .then(applicant => {
            if (!applicant) {
                Recruiter
                    .findOne({ email })
                    .then((recruiter) => {
                        if (recruiter) {
                            // validating password
                            validatePasswordLogin(recruiter, password, "recruiter", res)
                        } else {
                            let error = {}
                            error.email = "Email not registered."
                            return res.status(400).json(error)
                        }
                    })
            } else {
                // validating password
                validatePasswordLogin(applicant, password, "applicant", res)
            }
        })
});


// APPLICANTS 

// @Post request - /register/applicant
// Register an Applicant, add it to db
// @Public
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
                error = {}
                error.email = "Email-id already registered"
                return res.status(400).json(error)
            }
            const newApplicant = new Applicant({
                name: req.body.name,
                email: email,
                password: req.body.password,
                skills: req.body.skills,
                rating: req.body.rating
            });
            if (req.body.education) newApplicant.education = req.body.education

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
    Recruiter.findOne({ email })
        .then(recruiter => {
            if (recruiter) {
                error = {}
                error.email = 'Email-id already registered';
                return res.status(400).json(error)
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
        .catch(err => console.log(err))
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

