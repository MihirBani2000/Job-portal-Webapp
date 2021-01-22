import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link, Switch, Redirect } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"
import jwt_decode from 'jwt-decode';
import './App.css';

import setAuthToken from './set-auth-token';
import UsersList from './components/Users/UsersList'
import Home from './components/Common/Home'
import Login from './components/Common/Login'
import Register from './components/Common/Register'
import Landing from './components/Common/Landing'
import RegisterRecruiter from './components/Common/RegisterRecruiter'
import RegisterApplicant from './components/Common/RegisterApplicant'
import Navbar from './components/templates/Navbar'
import EnforceLogin from './components/templates/EnforceLogin'
import EnforceLogout from './components/templates/EnforceLogout'
import Profile from './components/Users/Profile'

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userType, setUserType] = useState(null);
  const [token, setToken] = useState(null);

  const attemptLogin = (token) => {
    localStorage.setItem("Token", token);
    setAuthToken(token);
    const decoded = jwt_decode(token);
    setIsLoggedIn(true);
    setUserName(decoded.name);
    setUserId(decoded.id);
    setUserType(decoded.type);
    setToken(token);
  }

  const logout = () => {
    console.log("Logged out")
    if (localStorage && localStorage.Token) {
      localStorage.removeItem("Token");
    }

    setIsLoggedIn(false);
    setUserName(null);
    setUserId(null);
    setUserType(null);
    setToken(null);

    return <Redirect to="/" />
  }

  useEffect(() => {
    // Anything in here is fired on component mount.
    if (localStorage && localStorage.weBuyToken) {
      attemptLogin(localStorage.weBuyToken);
    }
    return () => {
      // Anything in here is fired on component unmount.
    }
  }, [])

  return (
    <Router>
      <div className="container">
        <Navbar />
        <br />
        <Route path="/" exact component={Landing} />

        <Route path="/users" exact component={UsersList} />
        <Route path="/profile" component={Profile} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/register/applicant" exact component={RegisterApplicant} />

        <Route exact path="/register/recruiter"
          render={
            (props) => <EnforceLogout {...props}
              isLoggedIn={isLoggedIn}
              type={userType}
              desiredType={["applicant", "recruiter"]}
              path="/register/recruiter"
              hasProps={false}
              component={RegisterRecruiter}
            />} />
        {/* <Route path="/register/recruiter" exact component={RegisterRecruiter} /> */}

      </div>
    </Router>
  );
}

export default App;
