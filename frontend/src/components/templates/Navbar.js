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

const NavBar = () => {
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
                    <Nav className="mr-auto" navbar>
                        <NavItem>
                            <NavLink href="/profile/">Profile</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink href="/register/">Register</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink href="/users/">Users</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink href="/login/">Login</NavLink>
                        </NavItem>
                        {/* <UncontrolledDropdown nav inNavbar>
                            <DropdownToggle nav caret>
                                Options
                            </DropdownToggle>
                            <DropdownMenu right>
                                <DropdownItem>
                                    Option 1
                            </DropdownItem>
                                <DropdownItem>
                                    Option 2
                            </DropdownItem>
                                <DropdownItem divider />
                                <DropdownItem>
                                    Reset
                                </DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown> */}
                    </Nav>
                    <NavbarText>NAME</NavbarText>
                </Collapse>
            </Navbar>
        </div>
        // <div>
        //     <nav className="navbar navbar-expand-lg navbar-light bg-light">
        //         <Link to="/" className="navbar-brand">Demo</Link>
        //         <div className="collapse navbar-collapse">
        //             <ul className="navbar-nav mr-auto">
        //                 <li className="navbar-item">
        //                     <Link to="/users" className="nav-link">Users</Link>
        //                 </li>
        //                 <li className="navbar-item">
        //                     <Link to="/register" className="nav-link">Register</Link>
        //                 </li>
        //                 <li className="navbar-item">
        //                     <Link to="/profile" className="nav-link">My Profile</Link>
        //                 </li>
        //             </ul>
        //         </div>
        //     </nav>
        // </div>
    )

}

export default NavBar;