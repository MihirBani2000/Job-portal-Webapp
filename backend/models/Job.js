const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Application = require("./Application");

// Create Schema
const JobSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    recruiter: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Recruiter',
            required: true
        },
        name: {
            type: String,
            ref: 'Recruiter',
            required: true
        },
        email: {
            type: String,
            ref: 'Recruiter',
            required: true,
            lowercase: true,
            match: /\S+@\S+\.\S+/
        }
    },
    maxApplicants: {
        type: Number,
        required: true
    },
    maxPositions: {
        type: Number,
        required: true
    },
    DOPost: {
        type: Date,
        required: true,
        default: Date.now
    },
    DOApp: {
        type: Date,
        required: true
    },
    skills: {
        type: [String],
        required: true,
    },
    typeOfJob: {
        type: String,
        required: true,
        lowercase: true,
        enum: ["full-time", "part-time", "work from home"]
    },
    duration: {
        type: Number,
        min: 0,
        max: 7,
        required: true,
    },
    salary: {
        type: Number,
        required: true
    },
    rating: {
        type: Number,
        // required: true,
        min: 0,
        max: 5,
        default: 0
    }

},
    { timestamp: true }
);


// JobSchema.pre('findOneAndDelete', () => {
//     console.log("inside pre hook");
//     Application
//         .find({ jobId: this._id })
//         .exec((err, query) => {
//             if (err) return console.log(err)
//             else
//                 return console.log(query)
//         })
// })

// JobSchema.pre('find', (next) => {
//     console.log("inside find pre hook", this);
//     Application
//         .find(
//             { jobId: this._id }
//         )
//         .exec(
//             (err, query) => {
//                 if (err) return console.log("err")
//                 else return console.log(query, this._id)
//             }
//         )
//     next()
//     console.log("after find pre hook");
// });

module.exports = Job = mongoose.model("Job", JobSchema);
