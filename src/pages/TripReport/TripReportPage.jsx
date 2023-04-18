import React from "react";

import { createStructuredSelector } from "reselect";
import { selectUser } from "../../redux/auth/auth.selector";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import TripReport from "../../components/tripReport/tripReport.component";

import './TripReportPage.css'

const TripReportPage = ({ location }) => {
    return (
        <TripReport tripData={location.state} />
    )
}

const mapStateToProps = createStructuredSelector({
    user: selectUser
});

export default withRouter(connect(mapStateToProps)(TripReportPage));
