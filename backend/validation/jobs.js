const Validator = require("validator");
const isEmpty = require("is-empty");


// for adding a new job
const validateJobData = (data) => {
    let errors = {};

    // convert empty fields to empty strings so we can use validator
    data.title = !isEmpty(data.title) ? data.title : "";
    data.rating = !isEmpty(data.rating) ? data.rating : "";
    data.skills = !isEmpty(data.skills) ? data.skills : "";
    data.salary = !isEmpty(data.salary) ? data.salary : "";
    data.duration = !isEmpty(data.duration) ? data.duration : "";
    data.DOPost = !isEmpty(data.DOPost) ? data.DOPost : "";
    data.DOApp = !isEmpty(data.DOApp) ? data.DOApp : "";
    data.typeOfJob = !isEmpty(data.typeOfJob) ? data.typeOfJob : "";
    data.maxApplicants = !isEmpty(data.maxApplicants) ? data.maxApplicants : "";
    data.maxPositions = !isEmpty(data.maxPositions) ? data.maxPositions : "";

    // check title
    if (Validator.isEmpty(data.title)) {
        errors.title = "Please tell the title of the Job.";
    }

    // check rating
    if (Validator.isEmpty(data.rating)) {
        errors.rating = "Please enter rating of the Job.";
    }

    // check skills
    if (Validator.isEmpty(data.skills)) {
        errors.skills = "Please enter the required skills.";
    }

    // check salary
    if (Validator.isEmpty(data.salary)) {
        errors.salary = "Please enter the required salary.";
    }

    // // check DOPost
    // if (Validator.isEmpty(data.DOPost)) {
    //     errors.DOPost = "Please enter the required Date Of Post.";
    // } else if(Validator.isDate(data.DOPost)) {
    //     errors.DOPost = "Please enter a valid date.";
    // }

    // check DOApp
    if (Validator.isEmpty(data.DOApp)) {
        errors.DOApp = "Please enter the required last Date Of Application.";
    } else if (Validator.isDate(data.DOApp)) {
        errors.DOApp = "Please enter a valid date.";
    }

    // check typeOfJob
    if (Validator.isEmpty(data.typeOfJob)) {
        errors.typeOfJob = "Please enter the type Of Job.";
    } else if (Validator.isIn(data.typeOfJob, ["full-time", "part-time", "work from home"])) {
        errors.typeOfJob = "Please enter from the following types: [ full-time, part-time, work from home].";
    }

    // check maxApplicants
    if (Validator.isEmpty(data.maxApplicants)) {
        errors.maxApplicants = "Please enter the max number of applicants allowed.";
    }

    // check maxPositions
    if (Validator.isEmpty(data.maxPositions)) {
        errors.maxPositions = "Please enter the max number of positions.";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};

module.exports = {
    validateJobData
}