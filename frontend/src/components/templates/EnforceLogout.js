import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom';
// import Login from '../Common/Login';

const EnforceLogout = (props) => {
    console.log("inside enforceLogout", props);
    let isLoggedIn = props.isLoggedIn;
    const desiredType = ["applicant", "recruiter"]

    if (!desiredType.includes(props.type)) {
        isLoggedIn = false;
    }
    if (isLoggedIn) {
        console.log("enforce logout isLoggedIn", isLoggedIn);
        if (props.type === "applicant") {
            return <Redirect to="/applicant/dashboard" />;
        } else {
            return <Redirect to="/recruiter/dashboard" />;
        }
    } else {
        if (props.hasProps) {
            // console.log("enforce logout hasprops", props);
            return <Route to={props.path} exact render={
                () => props.component
            } />;
        } else {
            return <Route to={props.path} exact component={props.component} />
        }
    }
}

export default EnforceLogout;