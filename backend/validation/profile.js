const Validator = require("validator");
const isEmpty = require("is-empty");


// for recriuter registration
const validateApplicantProfile = (data) => {
    let errors = {
    };

    // convert empty fields to empty strings so we can use validator
    data.name = !isEmpty(data.name) ? data.name : "";
    data.email = !isEmpty(data.email) ? data.email : "";
    data.skills && data.skills.forEach((item, index) => {
        data.skills[index] = !isEmpty(data.skills[index]) ? data.skills[index] : "";
    })
    data.education && data.education.forEach((item, index) => {
        data.education[index].instituteName = !isEmpty(data.education[index].instituteName) ? data.education[index].instituteName : "";
        data.education[index].startYear = !isEmpty(data.education[index].startYear) ? data.education[index].startYear : "";
        data.education[index].endYear = !isEmpty(data.education[index].endYear) ? data.education[index].endYear : "";
    })

    // check name
    if (Validator.isEmpty(data.name)) {
        errors.name = "Please tell us your name";
    }

    // check skills
    if (!(data.skills.length)) {
        errors.skills = "Please enter the required skills.";
    } else {
        data.skills.forEach((item, id) => {
            let skills_error = ''
            let isError = false;
            if (Validator.isEmpty(item)) {
                skills_error = "Please enter a skill."
                isError = true;
                // console.log("skill error", isError)
            }
            if (isError === true) {
                if (!("skills" in errors)) errors.skills = {}
                errors.skills[id] = skills_error;
            }
        })
    }

    // check education
    data.education && data.education.forEach((item, id) => {
        let education_error = {}
        let isError = false;
        // name check
        if (Validator.isEmpty(item.instituteName)) {
            education_error.instituteName = "Please enter the name of your Institute."
            isError = true;
        }
        // start year check
        if (Validator.isEmpty(item.startYear)) {
            education_error.startYear = "Please enter the start year in the institution."
            isError = true;
        } else if (!Validator.isNumeric(item.startYear) || item.startYear.length != 4) {
            education_error.startYear = "Institute start year field is not a valid year"
            isError = true;
        }
        // end year check
        if (!Validator.isEmpty(data.education.endYear)) {
            if (!Validator.isNumeric(data.education.endYear) || data.education.endYear.length != 4) {
                education_error.endYear = "Please enter a valid year.";
                isError = true;
            }
        }
        if (isError === true) {
            if (!("education" in errors)) errors.education = {}
            errors.education[id] = education_error;
        }
    })

    // check Email
    if (Validator.isEmpty(data.email)) {
        errors.email = "Please enter email";
    } else if (!Validator.isEmail(data.email)) {
        errors.email = "Invalid email address";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};

// for recriuter registration
const validateRecruiterProfile = (data) => {
    let errors = {};

    // convert empty fields to empty strings so we can use validator
    data.name = !isEmpty(data.name) ? data.name.toString() : "";
    data.bio = !isEmpty(data.bio) ? data.bio.toString() : "";
    data.contactNum = !isEmpty(data.contactNum) ? data.contactNum.toString() : "";
    data.email = !isEmpty(data.email) ? data.email.toString() : "";

    // check name
    if (Validator.isEmpty(data.name)) {
        errors.name = "Please tell us your name.";
    }

    // check bio
    if (Validator.isEmpty(data.bio)) {
        errors.bio = "Please tell us about yourself.";
    }

    // check contactNum
    if (Validator.isEmpty(data.contactNum)) {
        errors.contactNum = "Your mobile number, please?";
    } else if (!Validator.isMobilePhone(data.contactNum, "en-IN", { strictMode: true })) {
        errors.contactNum = "Please provide your Indian mobile number as 91XXXXXXXXXX."
    }

    // check Email
    if (Validator.isEmpty(data.email)) {
        errors.email = "We'll need your email, please?";
    } else if (!Validator.isEmail(data.email)) {
        errors.email = "That doesn't seem like a valid email address :(";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};


module.exports = {
    validateApplicantProfile,
    validateRecruiterProfile
}