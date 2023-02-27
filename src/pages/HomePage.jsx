/**
 * This is the page the user will land on after successfully signing in. Therefore, this can be treated as the anding page for authenticated users.
 */

import React from "react";
import Spinner from 'react-bootstrap/Spinner';

import { connect } from 'react-redux';
import { selectUser } from "../redux/auth/auth.selector";
import { createStructuredSelector } from 'reselect';

import { withRouter } from 'react-router-dom';

const HomePage = ({user}) => (
    <div>
        <Spinner animation="grow" />
        Welcome to Homepage Mr. {user.FULL_NAME.S}
    </div>
)

const mapStateToProps = createStructuredSelector({
    user: selectUser
});

export default withRouter( connect(mapStateToProps)(HomePage) );