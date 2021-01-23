import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";

const EnforceLogin = (props) => {
    const desiredType = ["applicant", "recruiter"];
    let isLoggedIn = true;
    const userName = localStorage.getItem("Name");
    const userType = localStorage.getItem("Type");

    console.log("inside EnforceLogin", userName);
    // console.log("inside EnforceLogin", props.hasProps);

    if (localStorage.getItem("Token"))
        isLoggedIn = true;

    if (!desiredType.includes(userType)) {
        isLoggedIn = false;
    }

    if (!isLoggedIn) {
        return <Redirect to="/login" />;
    } else {
        if (props.hasProps) {
            return <Route to={props.path} exact render={
                () => props.component
            } />;
        } else {
            return <Route to={props.path} exact component={props.component} />
        }
    }
}
export default EnforceLogin;