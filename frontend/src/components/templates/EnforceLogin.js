import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";

const EnforceLogin = (props) => {
    // render() {
    let isLoggedIn = true;
    if (!props.isLoggedIn) {
        isLoggedIn = false;
    }
    if (!props.desiredType.includes(props.type)) {
        isLoggedIn = false;
    }

    if (!isLoggedIn) {
        return <Redirect to="/login" />;
    } else {
        if (props.hasProps) {
            return <Route to={props.path} render={
                (props) => props.component
            } />;
        } else {
            return <Route to={props.path} exact component={props.component} />
        }
    }
    // }
}
export default EnforceLogin;