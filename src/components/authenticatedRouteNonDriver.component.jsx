import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';

import { selectUser } from '../redux/auth/auth.selector';

const AuthenticatedRouteNonDriver = ({ user, exact, path, component }) => (
    <div>
        {
            user.BAND.S !== 'DRIVER' && user !== null // User is signed in and isn't a driver
            ? <Route exact={exact} path={path} component={component}/>
            : <Redirect exact to='/home'/>
        }
    </div>
)

const mapStateToProps = createStructuredSelector({
    user: selectUser
});

export default connect(mapStateToProps)(AuthenticatedRouteNonDriver);

