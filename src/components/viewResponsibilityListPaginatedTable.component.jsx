import React from "react";

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectUser } from "../redux/auth/auth.selector";

class viewResponsibilityListPaginatedTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            
        }
    }

    componentDidMount(){
        
    }

}

const mapStateToProps = createStructuredSelector({
    user: selectUser
})

export default connect(mapStateToProps)(viewResponsibilityListPaginatedTable);