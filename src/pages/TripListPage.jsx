import React from "react";

import { createStructuredSelector } from "reselect";

import { selectUser } from "../../redux/auth/auth.selector";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import TripViewTable from "../";

class TripViewPage extends React.Component {




    render() { return (
        <div>

        </div>
    )}
}


const mapStateToProps = createStructuredSelector({
    user: selectUser
});

export default withRouter(connect(mapStateToProps)(TripViewPage));