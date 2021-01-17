const Validator = require("validator");
const isEmpty = require("is-empty");


// for recriuter registration
const validateApplicantRegister = (data) => {
    let errors = {};

    // convert empty fields to empty strings so we can use validator
    data.name = !isEmpty(data.name) ? data.name : "";
    data.email = !isEmpty(data.email) ? data.email : "";
    data.password = !isEmpty(data.password) ? data.password : "";
    data.password2 = !isEmpty(data.password2) ? data.password2 : "";
    data.skills = !isEmpty(data.skills) ? data.skills : "";
    data.rating = !isEmpty(data.rating) ? data.rating : "";
    data.education.instituteName = !isEmpty(data.education.instituteName) ? data.education.instituteName : "";
    data.education.startYear = !isEmpty(data.education.startYear) ? data.education.startYear : "";

    // check name
    if (Validator.isEmpty(data.name)) {
        errors.name = "Please tell us your name";
    }

    // check rating
    if (Validator.isEmpty(data.rating)) {
        errors.rating = "Please enter rating.";
    }

    // check skills
    if (Validator.isEmpty(data.skills)) {
        errors.skills = "Please enter skills (don't feel the pressure).";
    }

    // check education.instituteName
    if (Validator.isEmpty(data.education.instituteName)) {
        errors.education.instituteName = "Please enter the name of your Institute.";
    }

    // check education.startYear
    if (Validator.isEmpty(data.education.startYear)) {
        errors.education.startYear = "Please enter the start year in the institution.";
    }

    // check Email
    if (Validator.isEmpty(data.email)) {
        errors.email = "Please enter email";
    } else if (!Validator.isEmail(data.email)) {
        errors.email = "Invalid email address";
    }

    // check password
    if (Validator.isEmpty(data.password)) {
        errors.password = "Please enter password";
    }

    if (Validator.isEmpty(data.password2)) {
        errors.password2 = "This has to be the same as other.";
    }

    if (!Validator.isLength(data.password, {
        min: 6
    })) {
        errors.password = "Minimum 6 characters long.";
    }
    if (!Validator.equals(data.password, data.password2)) {
        errors.password2 = "This has to be the same as that.";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};

// for recriuter registration
const validateRecruiterRegister = (data) => {
    let errors = {};

    // convert empty fields to empty strings so we can use validator
    data.name = !isEmpty(data.name) ? data.name : "";
    data.bio = !isEmpty(data.bio) ? data.bio : "";
    data.contactNum = !isEmpty(data.contactNum) ? data.contactNum : "";
    data.email = !isEmpty(data.email) ? data.email : "";
    data.password = !isEmpty(data.password) ? data.password : "";
    data.password2 = !isEmpty(data.password2) ? data.password2 : "";

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
        errors.contactNum = "Please provide your Indian mobile number as +91XXXXXXXXXX."
    }

    // check Email
    if (Validator.isEmpty(data.email)) {
        errors.email = "We'll need your email, please?";
    } else if (!Validator.isEmail(data.email)) {
        errors.email = "That doesn't seem like a valid email address :(";
    }

    // check password
    if (Validator.isEmpty(data.password)) {
        errors.password = "Please enter a password";
    }

    if (Validator.isEmpty(data.password2)) {
        errors.password2 = "This has to be the same as that.";
    }

    if (!Validator.isLength(data.password, {
        min: 6,
    })) {
        errors.password = "Minimum 6 characters long.";
    }
    if (!Validator.equals(data.password, data.password2)) {
        errors.password2 = "This has to be the same as that.";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};


module.exports = {
    validateApplicantRegister,
    validateRecruiterRegister
}