import React from "react";
import "./header.styles.css";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

import { createStructuredSelector } from "reselect";

import { selectUser } from "../../redux/auth/auth.selector";
import { connect } from "react-redux";

import { signOutAction } from "../../redux/auth/auth.actions";

import { withRouter } from "react-router-dom";

const Header = ({ user, history }) => {
    return (
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Container>

                < Navbar.Brand onClick={() => history.push('/')} >
                    <img
                        alt="logo"
                        src={require("../../resources/images/logo.png")}
                        width="30"
                        height="30"
                        className="d-inline-block align-top logo"
                    />{" "}
                    <>{"Fatamat Bike"}</>
                </Navbar.Brand >

                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link onClick={() => history.push('/create-user')}>Create User</Nav.Link>
                        <Nav.Link onClick={() => history.push('/view-users')}>View Users</Nav.Link>
                        <Nav.Link onClick={() => history.push('/manage-trips')}>Manage Trips</Nav.Link>
                        <Nav.Link onClick={() => history.push('/manage-bikes')}>Manage Bikes</Nav.Link>
                        <Nav.Link onClick={() => history.push('/sandbox')}>Sandbox</Nav.Link>
                    </Nav>

                    <Nav>
                        {
                            user === null
                                ? <Nav.Link onClick={() => history.push('/login')} className="login-link">Sign In</Nav.Link>  // User is currently not signed in
                                : <Nav.Link onClick={signOutAction} href='/' className="logout-link">Log Out</Nav.Link>  // User is currently signed in
                        }
                    </Nav>

                </Navbar.Collapse>

            </Container>
        </Navbar>
    );
};

const mapStateToProps = createStructuredSelector({
    user: selectUser
});

export default withRouter(connect(mapStateToProps)(Header));
