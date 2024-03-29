import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link, Switch, Redirect } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"
import jwt_decode from 'jwt-decode';
import './App.css';

// Templates and root
import setAuthToken from './set-auth-token';
import EnforceLogin from './components/templates/EnforceLogin'
import EnforceLogout from './components/templates/EnforceLogout'
import Navbar from './components/templates/Navbar'
// Common
import Home from './components/Common/Home'
import Login from './components/Common/Login'
import Register from './components/Common/Register'
import Landing from './components/Common/Landing'
import RegisterRecruiter from './components/Common/RegisterRecruiter'
import RegisterApplicant from './components/Common/RegisterApplicant'
// Applicant
import ProfileApplicant from './components/Applicant/ProfileApplicant'
import MyApplications from './components/Applicant/MyApplications'
import DashboardApplicant from './components/Applicant/JobsDashboardApplicant'
// Recruiter
import ProfileRecruiter from './components/Recruiter/ProfileRecruiter'
import JobsDashboardRecruiter from './components/Recruiter/JobsDashboardRecruiter'
import AddJob from './components/Recruiter/AddJob'

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userType, setUserType] = useState(null);
  const [token, setToken] = useState(null);

  const attemptLogin = (token) => {
    console.log("inside attemptLogin");
    localStorage.setItem("Token", token);
    setAuthToken(token);
    const decoded = jwt_decode(token);
    // console.log("decoded", decoded);
    setIsLoggedIn(true);
    setUserName(decoded.name);
    setUserId(decoded.id);
    setUserType(decoded.type);
    setToken(token);
    localStorage.setItem("Id", decoded.id);
    localStorage.setItem("Name", decoded.name);
    localStorage.setItem("Email", decoded.email);
    localStorage.setItem("Type", decoded.type);
  }

  const logout = () => {
    console.log("Logged out")
    if (localStorage && localStorage.Token) {
      localStorage.removeItem("Token");
      localStorage.removeItem("Id");
      localStorage.removeItem("Name");
      localStorage.removeItem("Email");
      localStorage.removeItem("Type");
    }

    setIsLoggedIn(false);
    setUserName(null);
    setUserId(null);
    setUserType(null);
    setToken(null);

    return <Redirect to="/" />
  }

  useEffect(() => {
    // Anything in here is fired on A mount.
    if (localStorage && localStorage.Token) {
      attemptLogin(localStorage.Token);
    }
  }, [])

  return (
    <Router>
      <div className="container">
        <Navbar isLoggedIn={isLoggedIn} userName={userName} userType={userType} />
        <br />

        <Route exact path="/"
          render={
            (props) => <EnforceLogout {...props}
              isLoggedIn={isLoggedIn}
              type={userType}
              path="/"
              hasProps={false}
              component={Landing}
            />} />
        {/* <Route path="/" exact component={Landing} /> */}

        <Route path="/register" component={Register} />

        <Route exact path="/login"
          render={
            (props) => <EnforceLogout {...props}
              isLoggedIn={isLoggedIn}
              type={userType}
              path="/login"
              hasProps={true}
              component={<Login attemptLogin={attemptLogin} />}
            />} />
        {/* <Route path="/login" component={Login} /> */}

        <Route exact path="/register/recruiter"
          render={
            (props) => <EnforceLogout {...props}
              isLoggedIn={isLoggedIn}
              type={userType}
              path="/register/recruiter"
              hasProps={false}
              component={RegisterRecruiter}
            />} />
        {/* <Route path="/register/recruiter" exact component={RegisterRecruiter} /> */}

        <Route exact path="/register/applicant"
          render={
            (props) => <EnforceLogout {...props}
              isLoggedIn={isLoggedIn}
              type={userType}
              path="/register/applicant"
              hasProps={false}
              component={RegisterApplicant}
            />} />
        {/* <Route path="/register/applicant" exact component={RegisterApplicant} /> */}


        <Route exact path="/recruiter/dashboard/"
          render={
            (props) => <EnforceLogin {...props}
              path="/recruiter/dashboard/"
              hasProps={false}
              component={JobsDashboardRecruiter}
            />} />
        {/* <Route path="/recruiter/jobs/addnew" component={JobsRecruiter} /> */}

        <Route exact path="/recruiter/jobs/addnew"
          render={
            (props) => <EnforceLogin {...props}
              path="/recruiter/jobs/addnew"
              hasProps={false}
              component={AddJob}
            />} />
        {/* <Route path="/recruiter/jobs/addnew" component={AddJob} /> */}


        <Route exact path="/recruiter/profile/"
          render={
            (props) => <EnforceLogin {...props}
              path="/recruiter/profile/"
              hasProps={false}
              component={ProfileRecruiter}
            />} />
        {/* <Route path="/recruiter/jobs/addnew" component={JobsRecruiter} /> */}

        <Route exact path="/applicant/profile/"
          render={
            (props) => <EnforceLogin {...props}
              path="/applicant/profile/"
              hasProps={false}
              component={ProfileApplicant}
            />} />
        {/* <Route path="/applicant/jobs/addnew" component={JobsApplicant} /> */}
        <Route exact path="/applicant/dashboard/"
          render={
            (props) => <EnforceLogin {...props}
              path="/applicant/dashboard/"
              hasProps={false}
              component={DashboardApplicant}
            />} />

        <Route exact path="/applicant/myApplications/"
          render={
            (props) => <EnforceLogin {...props}
              path="/applicant/myApplications/"
              hasProps={false}
              component={MyApplications}
            />} />

        <Route exact path="/logout" render={logout} />

      </div>
    </Router>
  );
}

export default App;
