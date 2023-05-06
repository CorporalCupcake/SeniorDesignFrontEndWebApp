import React, { useState, useEffect } from "react";
import { selectUser } from "../../redux/auth/auth.selector";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";

import { getUserByEmail } from "../../aws_services/dynamo_db";

import { getUserEmergencyContact } from "../../aws_services/dynamo_db";

import './viewUser.styles.css'


const ViewUser = ({ email }) => {
    const [EMERGENCY_CONTACTS, setEMERGENCY_CONTACTS] = useState([]);
    const [user, setUser] = useState(null)

    useEffect(() => {
        const func = async () => {
            const userTemp = await getUserByEmail({ email })
            setUser(userTemp.Items[0])
            if (userTemp.Items[0].BAND.S === 'DRIVER') {
                const temp = await getUserEmergencyContact(email)
                setEMERGENCY_CONTACTS(temp.EmergencyContacts)
            }
        }

        func()
    }, [])

    if (user === null) {
        return <></>
    }

    return (
        <div className="user-details">
            <h2>User Details</h2>
            <div className="user-info">
                <div className="user-info-row">
                    <div className="user-info-label">Full Name:&nbsp;</div>
                    <div className="user-info-value">{user.FULL_NAME.S}</div>
                </div>
                <div className="user-info-row">
                    <div className="user-info-label">Email:&nbsp;</div>
                    <div className="user-info-value">{user.EMAIL.S}</div>
                </div>
                <div className="user-info-row">
                    <div className="user-info-label">ID Number:&nbsp;</div>
                    <div className="user-info-value">{user.ID_NUMBER.S}</div>
                </div>
                <div className="user-info-row">
                    <div className="user-info-label">Superior Email:&nbsp;</div>
                    <div className="user-info-value">{user.SUPERIOR_EMAIL.S}</div>
                </div>
                <div className="user-info-row">
                    <div className="user-info-label">Band:&nbsp;</div>
                    <div className="user-info-value">{user.BAND.S}</div>
                </div>
                <div className="user-info-row">
                    <div className="user-info-label">Company:&nbsp;</div>
                    <div className="user-info-value">{user.COMPANY.S}</div>
                </div>
                {user.BAND.S === 'DRIVER' ?
                    <div className="user-info-row">
                        <div className="user-info-label"> Bike ID:</div>
                        <div className="user-info-value">{user.RESPONSIBILITY_LIST.L.map(item => item.S).join(", ")}</div>
                    </div>
                    :
                    <div className="user-info-row">
                        <div className="user-info-label">Responsibility List:</div>
                        <div className="user-info-value">{user.RESPONSIBILITY_LIST.L.map(item => item.S).join(", ")}</div>
                    </div>}

                {user.BAND.S === 'DRIVER' ? <div className="user-info-row">
                    <div className="user-info-label">Emergency Contacts:</div>
                    <div className="user-info-value">
                        {EMERGENCY_CONTACTS.map((contact, index) => (
                            <li key={index}>
                                <p>Name: {contact.name}</p>
                                <p>Email: {contact.email}</p>
                                <p>Phone Number: {contact.phoneNumber}</p>
                            </li>
                        ))}</div>
                </div> : null}
            </div>
        </div>
    );
}

const mapStateToProps = createStructuredSelector({
    user: selectUser
});

export default connect(mapStateToProps)(React.memo(ViewUser));