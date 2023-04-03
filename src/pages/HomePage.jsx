/**
 * This is the page the user will land on after successfully signing in. Therefore, this can be treated as the anding page for authenticated users.
 */

import React from "react";
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';

import { connect } from 'react-redux';
import { selectUser } from "../redux/auth/auth.selector";
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';

import { getItemsByPageNumber } from "../aws_services/dynamo_db";


const HomePage = ({ user, history }) => (
    <div>
        <Spinner animation="grow" />
        Welcome to Homepage Mr. {user.FULL_NAME.S}

        <div className="d-flex mx-4" style={{ padding: '2rem 2rem' }}>
            {/* <Button variant="outline-success" onClick={() => history.push('/manage-users')}>Manage Users</Button> */}
            <Button variant="outline-success" onClick={()=>console.log(getItemsByPageNumber(2))}> HA </Button>
        </div>

    </div>
)


const mapStateToProps = createStructuredSelector({
    user: selectUser
});

export default withRouter(connect(mapStateToProps)(HomePage));