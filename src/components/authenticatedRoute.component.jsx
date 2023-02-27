import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';

import { selectUser } from '../redux/auth/auth.selector';

const AuthenticatedRoute = ({ user, exact, path, component }) => (
    <div>
        {
            user !== null // User is signed in
            ? <Route exact={exact} path={path} component={component}/>
            : <Redirect exact to='/login'/>
        }
    </div>
)

const mapStateToProps = createStructuredSelector({
    user: selectUser
});

export default connect(mapStateToProps)(AuthenticatedRoute);