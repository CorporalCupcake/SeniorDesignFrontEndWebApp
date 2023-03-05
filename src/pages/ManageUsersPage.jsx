import React from "react";


import { selectUser } from "../redux/auth/auth.selector";
import { createStructuredSelector } from 'reselect';

import AddUser from "../components/addUser.component";
// import ViewUsers from "../components/viewUsers.component";

const ManageUsersPage = () => (

    <div className='mx-4' style={{ width: "50rem" }}>
        <AddUser />
        {/* <ViewUsers /> */}
    </div>
)


const mapStateToProps = createStructuredSelector({
    user: selectUser
});

export default mapStateToProps(ManageUsersPage);