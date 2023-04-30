import React from "react";
import "./signIn.styles.css";

import { MD5 } from 'crypto-js';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { getUserByEmailAndPassword } from "../../aws_services/dynamo_db";
import { signInAction } from "../../redux/auth/auth.actions";


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

    handleChange = (fieldName, event) => {
        event.preventDefault();
        this.setState({
            [fieldName]: event.target.value
        })
    }

    handleSubmit = async () => {
        const { email, password } = this.state;
        this.setState({
            isError: false,
            errorMessage: null
        })

        const data = await getUserByEmailAndPassword({ email, password: MD5(password).toString() })

        if (data.$metadata.httpStatusCode === 200) { // Successful Connection
            if (data.Count === 1) { // User found in database
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

    render() {
        return (
            <form className='form-container'>

                {/* Display an error banner if there is an error*/}
                {this.state.isError ? <div key='danger' className='error'>{this.state.errorMessage}</div> : null}

                <div className="form-field" onChange={event => this.handleChange('email', event)}>
                    <label htmlFor="formBasicEmail" className="form-label">Email address</label>
                    <input type="email" className="form-input" id="formBasicEmail" placeholder="Enter email" />
                </div>

                <div className="form-field" onChange={event => this.handleChange('password', event)}>
                    <label htmlFor="formBasicPassword" className="form-label">Password</label>
                    <input type="password" className="form-input" id="formBasicPassword" placeholder="Password" />
                </div>

                <button type="button" className="form-button" onClick={this.handleSubmit}>
                    Sign In
                </button>
            </form>
        )
    }
}


const mapDispatchToProps = dispatch => ({
    setUserInStore: user => dispatch(signInAction(user))
})

export default withRouter(connect(null, mapDispatchToProps)(SignIn));
