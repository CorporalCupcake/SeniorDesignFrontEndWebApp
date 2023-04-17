import React, { useState, useEffect } from "react";

import { createStructuredSelector } from "reselect";

import { selectUser } from "../redux/auth/auth.selector";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import TripsViewTable from '../components/tripsViewTable/tripsViewTable.component'
const TripsViewPage = ({ user }) => {

    const [driverEmail, setDriverEmail] = useState(user.EMAIL.S)


    return (
        <div>
            <TripsViewTable driverEmail={driverEmail} />

        </div>
    );
}


const mapStateToProps = createStructuredSelector({
    user: selectUser
});

export default withRouter(connect(mapStateToProps)(TripsViewPage));