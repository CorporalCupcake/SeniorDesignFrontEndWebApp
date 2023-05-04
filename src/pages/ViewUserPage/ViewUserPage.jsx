import React, { useEffect, useState, useReducer } from 'react';
import ViewUser from '../../components/ViewUser/viewUser.component';

import { selectUser } from '../../redux/auth/auth.selector';
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import './ViewUserPage.css'

const ViewUserPage = ({ user }) => {

    const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

    const responsibilityList = user.RESPONSIBILITY_LIST.L.map((email, index) => {
        return (
            <option key={index} value={email.S}>{email.S}</option>
        )
    })

    const [selectedEmail, setSelectedEmail] = useState('')

    
    const handleEmailChange = (event) => {
        setSelectedEmail(event.target.value)
        forceUpdate();
    }

    return (<>

        <div className="select-wrapper">
            <div className="label_select">Driver Email:</div>
            <select onChange={handleEmailChange} value={selectedEmail}>
                <option value="">Select Email</option>
                {responsibilityList}
            </select>
        </div>

        {(selectedEmail === '') ? null : <ViewUser key={selectedEmail} email={selectedEmail} />}

    </>)

}

const mapStateToProps = createStructuredSelector({
    user: selectUser
});

export default connect(mapStateToProps)(ViewUserPage);
