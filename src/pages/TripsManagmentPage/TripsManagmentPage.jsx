import React, { useState, useEffect } from "react";

import { createStructuredSelector } from "reselect";
import { selectUser } from "../../redux/auth/auth.selector";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import './TripsManagmentPage.css'
import TripsManagment from "../../components/tripsManagment/tripsManagment.component";

const TripsViewPage = ({ user, history }) => {

    return (

            <TripsManagment />
    );
}

const mapStateToProps = createStructuredSelector({
    user: selectUser
});

export default withRouter(connect(mapStateToProps)(TripsViewPage));
