import React, { useState, useEffect } from "react";

import { createStructuredSelector } from "reselect";
import { selectUser } from "../../redux/auth/auth.selector";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import TripsViewTable from '../../components/tripsViewTable/tripsViewTable.component'

import './TripsViewPage.css'

const TripsViewPage = ({ user, history }) => {
    const [selectedEmail, setSelectedEmail] = useState('');

    const handleEmailChange = (event) => {
        setSelectedEmail(event.target.value);
    }

    const handleTripClick = (item) => {
        history.push({
            pathname: "/trip-report",
            state: { item } // pass the item object as a prop to the new page
        });
    };

    const responsibilityList = user.RESPONSIBILITY_LIST.L.map((email, index) => {
        return (
            <option key={index} value={email.S}>{email.S}</option>
        )
    })

    return (
        <div className="tripsViewPageContainer">
            <div className="select-wrapper">
                <label><span>Driver Email</span></label>
                <select onChange={handleEmailChange} value={selectedEmail}>
                    <option value="">Select Email</option>
                    {responsibilityList}
                </select>
            </div>

            <TripsViewTable driverEmail={selectedEmail} onClickTripFunction={handleTripClick} />
        </div>
    );
}

const mapStateToProps = createStructuredSelector({
    user: selectUser
});

export default withRouter(connect(mapStateToProps)(TripsViewPage));
