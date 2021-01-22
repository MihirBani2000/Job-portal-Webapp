import React, { Component, useState } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    NavbarText,
    Container
} from 'reactstrap';

const NavBar = (props) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => {
        setIsOpen(!isOpen)
    }

    return (
        <div>
            <Navbar color="dark" dark expand="md">
                <NavbarBrand href="/">Home</NavbarBrand>
                <NavbarToggler onClick={toggle} />
                <Collapse isOpen={isOpen} navbar>
                    {
                        props.isLoggedIn && props.userType === 'recruiter' &&
                        <Nav className="mr-auto" navbar>
                            <NavItem>
                                <NavLink href="/recruiter/profile/">Profile</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="/recruiter/dashboard/">Dashboard</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="/users/">Jobs</NavLink>
                            </NavItem>
                        </Nav>
                    }
                    {
                        props.isLoggedIn && props.userType === 'applicant' &&
                        <Nav className="mr-auto" navbar>
                            <NavItem>
                                <NavLink href="/applicant/profile/">Profile</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="/applicant/dashboard/">Dashboard</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="/users/">Jobs</NavLink>
                            </NavItem>
                        </Nav>
                    }
                    {
                        !props.isLoggedIn &&
                        <Nav className="mr-auto" navbar>
                            <NavItem>
                                <NavLink href="/register/">Register</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="/login/">Login</NavLink>
                            </NavItem>

                        </Nav>
                    }
                    {
                        props.isLoggedIn &&
                        <NavbarText>
                            Logged in as - <b>{props.userName}</b> ({props.userType})
                        </NavbarText>
                    }
                    {
                        props.isLoggedIn &&
                        <NavLink href="/logout">LOGOUT</NavLink>
                    }

                </Collapse>
            </Navbar>
        </div>
    )
}

export default NavBar;