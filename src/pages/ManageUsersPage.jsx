import React from "react";


import { selectUser } from "../redux/auth/auth.selector";
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';

import AddUser from "../components/addUser.component";
// import ViewUsers from "../components/viewUsers.component";

import { getAllUsersBasedOnBand } from "../aws_services/dynamo_db";
import { Button } from "react-bootstrap";

const ManageUsersPage = ({ user }) => (

    <div className='mx-4' style={{ width: "50rem" }}>
        <AddUser />
        {/* <ViewUsers /> */}
        
        <Button variant="outline-primary" onClick={()=> console.log(getAllUsersBasedOnBand({band:'DRIVER'}))} size='lg'>
                Click Moi!
            </Button>

    </div>
)


const mapStateToProps = createStructuredSelector({
    user: selectUser
});

export default connect(mapStateToProps)(ManageUsersPage);