import React, { useState } from 'react';
import ViewUser from '../../components/ViewUser/viewUser.component';
import { selectUser } from '../../redux/auth/auth.selector';
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import './ViewUserPage.css'

const ViewUserPage = ({ user }) => {

    const responsibilityList = user.RESPONSIBILITY_LIST.L.map((email, index) => {
        return (
            <option key={index} value={email.S}>{email.S}</option>
        )
    })

    const [selectedEmail, setSelectedEmail] = useState('')

    const handleEmailChange = (event) => {
        setSelectedEmail(event.target.value)
    }

    return (<>

        <div className="select-wrapper">
            <div className="label_select">Driver Email:</div>
            <select onChange={handleEmailChange} value={selectedEmail}>
                <option value="">Select Email</option>
                {responsibilityList}
            </select>
        </div>

        {(selectedEmail === '') ? null : <ViewUser email={selectedEmail} />}

    </>)

}

const mapStateToProps = createStructuredSelector({
    user: selectUser
});

export default connect(mapStateToProps)(React.memo(ViewUserPage));
