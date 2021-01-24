const Validator = require("validator");
const isEmpty = require("is-empty");


// for adding a new job
const validateJobData = (data) => {
    let errors = {};

    // convert empty fields to empty strings so we can use validator
    data.title = !isEmpty(data.title) ? data.title : "";
    data.skills && data.skills.forEach((item, index) => {
        data.skills[index] = !isEmpty(data.skills[index]) ? data.skills[index] : "";
    })
    data.salary = !isEmpty(String(data.salary)) ? String(data.salary) : "";
    data.duration = !isEmpty(String(data.duration)) ? String(data.duration) : "";
    data.DOApp = !isEmpty(data.DOApp) ? data.DOApp : "";
    data.typeOfJob = !isEmpty(data.typeOfJob) ? data.typeOfJob : "";
    data.maxApplicants = !isEmpty(String(data.maxApplicants)) ? String(data.maxApplicants) : "";
    data.maxPositions = !isEmpty(String(data.maxPositions)) ? String(data.maxPositions) : "";
    // data.rating = !isEmpty(data.rating) ? data.rating : "";

    // check title
    if (Validator.isEmpty(data.title)) {
        errors.title = "Please tell the title of the Job.";
    }

    // check skills
    if (!data.skills) {
        errors.skills = "Please enter the required skills.";
    }
    else if (!data.skills.length) {
        errors.skills = "Please enter the required skills.";
    }
    // console.log("inside validate job data", data.skills);

    // check DOApp
    if (Validator.isEmpty(data.DOApp)) {
        errors.DOApp = "Please enter the required last Date Of Application.";
    } else if (Validator.isDate(data.DOApp)) {
        errors.DOApp = "Please enter a valid date.";
    }

    // check typeOfJob
    if (Validator.isEmpty(data.typeOfJob)) {
        errors.typeOfJob = "Please enter the type Of Job.";
    } else if (!Validator.isIn(data.typeOfJob, ["full-time", "part-time", "work from home"])) {
        errors.typeOfJob = "Please enter from the following types: [ full-time, part-time, work from home].";
    }
    // check duration
    if (Validator.isEmpty(data.duration)) {
        errors.duration = "Please enter the duration of the job"
    } else if (!Validator.isInt(data.duration, { min: 0, max: 7 })) {
        errors.duration = "Duration should be between 0 and 7."
    }
    // check salary
    if (Validator.isEmpty(data.salary)) {
        errors.salary = "Please enter the required salary.";
    } else if (!Validator.isInt(data.salary, { min: 0 })) {
        errors.salary = "Salary must be minimum 0."
    }
    // check maxApplicants
    if (Validator.isEmpty(data.maxApplicants)) {
        errors.maxApplicants = "Please enter the max number of applicants allowed.";
    } else if (!Validator.isInt(data.maxApplicants, { min: 1 })) {
        errors.maxApplicants = "Should be a number greater than 0."
    }

    // check maxPositions
    if (Validator.isEmpty(data.maxPositions)) {
        errors.maxPositions = "Please enter the max number of positions.";
    } else if (!Validator.isInt(data.maxPositions, { min: 1 })) {
        errors.maxPositions = "Should be a number greater than 0."
    }

    // console.log("exiting validate job data")
    return {
        errors,
        isValid: isEmpty(errors)
    };
};


// for editing a job
const validateEditJobData = (data) => {
    let errors = {};

    // convert empty fields to empty strings so we can use validator
    data.DOApp = !isEmpty(data.DOApp) ? data.DOApp : "";
    data.maxApplicants = !isEmpty(String(data.maxApplicants)) ? String(data.maxApplicants) : "";
    data.maxPositions = !isEmpty(String(data.maxPositions)) ? String(data.maxPositions) : "";

    // check DOApp
    if (Validator.isEmpty(data.DOApp)) {
        errors.DOApp = "Please enter the required last Date Of Application.";
    } else if (Validator.isDate(data.DOApp)) {
        errors.DOApp = "Please enter a valid date.";
    }

    // check maxApplicants
    if (Validator.isEmpty(data.maxApplicants)) {
        errors.maxApplicants = "Please enter the max number of applicants allowed.";
    } else if (!Validator.isInt(data.maxApplicants, { min: 1 })) {
        errors.maxApplicants = "Should be a number greater than 0."
    }

    // check maxPositions
    if (Validator.isEmpty(data.maxPositions)) {
        errors.maxPositions = "Please enter the max number of positions.";
    } else if (!Validator.isInt(data.maxPositions, { min: 1 })) {
        errors.maxPositions = "Should be a number greater than 0."
    }

    // console.log("exiting validate job data")
    return {
        errors,
        isValid: isEmpty(errors)
    };
};

module.exports = {
    validateJobData,
    validateEditJobData

}