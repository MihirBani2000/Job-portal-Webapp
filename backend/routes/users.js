var express = require("express");
var router = express.Router();

// Load models
const Job = require("../models/Job");
const User = require("../models/User");
const Recruiter = require("../models/Recruiter");
const Applicant = require("../models/Applicant");
const Application = require("../models/Application");

// GET request 
// Getting all the users
router.get("/", function (req, res) {
    User.find(function (err, user) {
        if (err) {
            console.log(err);
        } else {
            res.json(user);
        }
    })
});


// POST request 
// Add a user to db
router.post("/register", (req, res) => {
    const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        contactNum: req.body.contactNum,
        bio: req.body.bio,
        date: req.body.date
    });

    newUser.save()
        .then(user => {
            res.status(200).json(user);
        })
        .catch(err => {
            res.status(400).send(err);
        });
});

// POST request 
// Login
router.post("/login", (req, res) => {
    const email = req.body.email;
    // Find user by email
    User.findOne({ email }).then(user => {
        // Check if user email exists
        if (!user) {
            return res.status(404).json({
                error: "Email not found",
            });
        }
        else {
            res.send("Email Found");
            return user;
        }
    });
});

module.exports = router;

