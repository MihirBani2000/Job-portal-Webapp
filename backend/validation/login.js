const Validator = require("validator");
const isEmpty = require("is-empty");

const validateLoginData = (data) => {
    let errors = {};

    // Convert empty fields to an empty string so we can use validator
    data.email = !isEmpty(data.email) ? data.email : "";
    data.password = !isEmpty(data.password) ? data.password : "";

    // check email
    if (Validator.isEmpty(data.email)) {
        errors.email = "Please enter your registered Email";
    } else if (!Validator.isEmail(data.email)) {
        errors.email = "Invalid email address.";
    }

    // check password
    if (Validator.isEmpty(data.password)) {
        errors.password = "Please enter password";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};


module.exports = {
    validateLoginData
}