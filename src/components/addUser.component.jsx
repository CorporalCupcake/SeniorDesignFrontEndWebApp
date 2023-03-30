/**
 * @description
 * This component will allow a logged in user to add a new user to the database. The component has different behaviours
 * for differet user bands.
 * - SUPERUSER: The superuser can create admins that can belong to any company.
 * - ADMIN: The admin can create managers that belong to the same company.
 * - MANAGER: The manager can create drivers that belong to the same company.
 * - DRIVER: Drivers are not permitted access to this component from the ManageUsers Page.
 * 
 * After a user creates another user, the component also add the newly created user to the signed-in
 * user's responsibility list.
 * 
 * @author Ameen Ayub
 * 
 */


/*
TO DO
* Check all fields are not empty
* Check if user already exists via email
*/


import React from "react";

import { putItemInTable } from "../aws_services/dynamo_db";
import { updateUserResponsibilityList } from "../aws_services/dynamo_db";

import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { selectUser } from "../redux/auth/auth.selector";
import { createStructuredSelector } from "reselect";

import { MD5 } from "crypto-js";

import Alert from "react-bootstrap/Alert";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";


class AddUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: null,
            password: null,
            full_name: null,
            company:
                this.props.user.BAND.S === "SUPERUSER"
                    ? null
                    : this.props.user.COMPANY.S,
            band: null,
            id_number: null,
            isError: false,
            errorMessage: null,
            isSuccess: false,
            successMessage: null,
        };
    }


    handleChange = (fieldName, event) => {
        event.preventDefault();
        this.setState({
            [fieldName]: event.target.value,
        });
    };


    handleSubmit = async () => {
        const { email, password, full_name, company, band, id_number } = this.state;

        this.setState({
            isError: false,
            errorMessage: null,
            isSuccess: false,
            successMessage: null
        });


        const data = await putItemInTable({
            TableName: "users",
            Item: {
                EMAIL: { S: email },
                PASSWORD: { S: MD5(password).toString() },
                BAND: { S: band },
                COMPANY: { S: company },
                FULL_NAME: { S: full_name },
                RESPONSIBILITY_LIST: { L: [] },
                ID_NUMBER: { S: id_number },
            },
        });


        if (data.$metadata.httpStatusCode === 200) { // Success
            this.setState({
                isSuccess: true,
                successMessage: `User ${this.state.full_name} created successfully.`,
            });

            updateUserResponsibilityList({
                currentUser: this.props.user,
                newUserEmail: this.state.email
            })


        } else {
            this.setState({
                isError: true,
                errorMessage: "Error. Please try again",
            });
        }
    };


    render() {
        return (
            <div className='mx-4' style={{ width: "50rem" }}>

                {/* Display an error banner if there is an error*/}
                {this.state.isError ? <Alert key='danger' variant='danger'>{this.state.errorMessage}</Alert> : null}

                {/* Display an success banner if there is an error*/}
                {this.state.isSuccess ? <Alert key='success' variant='success'>{this.state.successMessage}</Alert> : null}

                <Form>
                    {/* -------------------------- EMAIL --------------------------*/}
                    <Form.Group
                        className="mb-3"
                        controlId="formBasicEmail"
                        onChange={(event) => this.handleChange("email", event)}
                    >
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" />
                    </Form.Group>

                    {/* -------------------------- PASSWORD --------------------------*/}
                    <Form.Group
                        className="mb-3"
                        controlId="formBasicPassword"
                        onChange={(event) => this.handleChange("password", event)}
                    >
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" />
                    </Form.Group>

                    {/* -------------------------- FULL NAME --------------------------*/}
                    <Form.Group
                        className="mb-3"
                        controlId="formBasicPassword"
                        onChange={(event) => this.handleChange("full_name", event)}
                    >
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control type="text" placeholder="Full Name" />
                    </Form.Group>

                    {/* -------------------------- ID NUMBER --------------------------*/}
                    <Form.Group
                        className="mb-3"
                        controlId="formBasicPassword"
                        onChange={(event) => this.handleChange("id_number", event)}
                    >
                        <Form.Label>ID Number</Form.Label>
                        <Form.Control type="text" placeholder="ID Number" />
                    </Form.Group>

                    {/* -------------------------- BAND --------------------------*/}
                    <div style={{ marginBottom: "0.4rem" }}>User Band</div>
                    <Form.Select
                        aria-label="Select band of new user"
                        onChange={(event) => this.handleChange("band", event)}
                        style={{ marginBottom: "1.05rem" }}
                    >
                        <option>Select band of new user</option>

                        {this.props.user.BAND.S === "MANAGER" ? (
                            <option value="DRIVER">DRIVER</option>
                        ) : null}

                        {this.props.user.BAND.S === "ADMIN" ? (
                            <option value="MANAGER">MANAGER</option>
                        ) : null}

                        {this.props.user.BAND.S === "SUPERUSER" ? (
                            <option value="ADMIN">ADMIN</option>
                        ) : null}
                    </Form.Select>

                    {/* -------------------------- COMPANY --------------------------*/}
                    {this.props.user.BAND.S === "SUPERUSER" ? (
                        <Form.Group
                            className="mb-3"
                            controlId="formBasicPassword"
                            onChange={(event) => this.handleChange("company", event)}
                        >
                            <Form.Label>Company</Form.Label>
                            <Form.Control type="text" placeholder="Company" />
                        </Form.Group>
                    ) : (
                        // Disabled Form
                        <Form.Group className="mb-3">
                            <Form.Label>Company</Form.Label>
                            <Form.Control placeholder={this.props.user.COMPANY.S} disabled />
                        </Form.Group>
                    )}

                    <Button variant="outline-primary" onClick={this.handleSubmit}>
                        Create User
                    </Button>
                </Form>
            </div>
        );
    }
}

const mapStateToProps = createStructuredSelector({
    user: selectUser
});

export default withRouter(connect(mapStateToProps)(AddUser));