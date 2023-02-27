import React from "react";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

import { createStructuredSelector } from "reselect";
import { selectUser } from "../redux/auth/auth.selector";
import { connect } from "react-redux";

import { signOutAction } from "../redux/auth/auth.actions";

import { projectName } from "../centralStorage";

const Header = ({ user }) => {
    return (
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Container>

                < Navbar.Brand href="/" >
                    <img
                        alt="logo"
                        src={require("../resources/images/logo.png")}
                        width="30"
                        height="30"
                        className="d-inline-block align-top"
                    />{" "}
                    { projectName.cus }
                </Navbar.Brand >

                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="#features">Features</Nav.Link>
                        <Nav.Link href="#pricing">Pricing</Nav.Link>
                    </Nav>

                    <Nav>
                        { 
                            user === null 
                            ? <Nav.Link href="/login">Sign In</Nav.Link>  // User is currently not signed in
                            : <Nav.Link onClick={signOutAction} href='/'>Log Out</Nav.Link>  // User is currently signed in
                        }          
                    </Nav>

                </Navbar.Collapse>

            </Container>
        </Navbar>
    );
};

const mapStateToProps = createStructuredSelector({
    user: selectUser,
});

export default connect(mapStateToProps)(Header);
