import React from "react";
import { Link } from "react-router-dom";


const Landing = () => {
    return (
        <div>
            <h1>Hi there, register here</h1>
            <div className="container mt-5">

                <div className="row">
                    <div className="col-12 d-flex flex-column flex-md-row justify-content-center">
                        <Link to="/register/recruiter" className="shadow-move btn red mx-md-2 my-2 my-md-0">Register as Recruiter</Link>
                        <Link to="/register/applicant" className="shadow-move btn muave mx-md-2 my-2 my-md-0">Register as Applicant</Link>
                        <Link to="/login" className="shadow-move btn light-grey mx-md-2 my-2 my-md-0">Login</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Landing;