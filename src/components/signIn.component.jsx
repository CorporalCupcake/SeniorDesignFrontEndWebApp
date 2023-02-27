import React from "react";

import { MD5 } from 'crypto-js';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

// Bootstrap imports
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import { getUserByEmailAndPassword } from "../aws_services/dynamo_db";
import { signInAction } from "../redux/auth/auth.actions";


class SignIn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: null,
            password: null,
            isError: false,
            errorMessage: null
        }
    }

    handleChange = async (fieldName, event) => {
        event.preventDefault();
        this.setState({
            [fieldName]: event.target.value
        })
    }

    handleSubmit = async () => {
        const { email, password} = this.state;
        this.setState({
            isError: false,
            errorMessage: null
        })


        const data = await getUserByEmailAndPassword({email, password: MD5(password).toString()})

        /*
        -- Returned Fields --
        $metadata: {httpStatusCode: 200, requestId: "ROIJ918DSHCM4F6C9JHS2JRH3BVV4KQNSO5AEMVJF66Q9ASUAAJG", extendedRequestId: undefined, cfId: undefined, attempts: 1, …}
        ConsumedCapacity: undefined
        Count: 1
        Items: [Object] (1)
        LastEvaluatedKey: undefined
        ScannedCount: 1
        */
        
        if(data.$metadata.httpStatusCode === 200){ // Successful Connection
            if(data.Count === 1){ // User found in database
                this.props.setUserInStore(data.Items[0])
                this.props.history.push('/home')
            } else { // User does not exist in database
                this.setState({
                    isError: true,
                    errorMessage: 'Email or password is incorrect. Please re-enter or make a new account'
                })
            }
        } else {
            this.setState({
                isError: true,
                errorMessage: 'Error. Please check you connection and try again'
            })
        }
             
    }

    render() {return (
        <Form className='m-4' style={{width : '50%'}}>

            {/* Display an error banner if there is an error*/}
            {this.state.isError ? <Alert key='danger' variant='danger'>{this.state.errorMessage}</Alert> : null}

            <Form.Group className="mb-3" controlId="formBasicEmail" onChange={event => this.handleChange('email', event)}>
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword" onChange={event => this.handleChange('password', event)}>
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" />
            </Form.Group>
            
            <Button variant="outline-primary" onClick={this.handleSubmit} size='lg'>
                Sign In
            </Button>
        </Form>
    )}
}


const mapDispatchToProps = dispatch => ({
    setUserInStore: user => dispatch(signInAction(user))
})


export default withRouter(connect(null, mapDispatchToProps)(SignIn));