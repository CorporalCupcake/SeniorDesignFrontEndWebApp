import React from "react";
import { Button } from "react-bootstrap";

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectUser } from "../redux/auth/auth.selector";

import { getItemsByPageNumber } from "../aws_services/dynamo_db";

class ViewResponsibilityListPaginatedTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            page_number: 1,
        }
    }



    // componentDidMount() {

    // }

    render() {
        return (
            <Button variant="outline-success" onClick={()=>console.log(getItemsByPageNumber(this.props.user.RESPONSIBILITY_LIST.L))}> RESP LIST </Button>
        )
    }



}

const mapStateToProps = createStructuredSelector({
    user: selectUser
})

export default connect(mapStateToProps)(ViewResponsibilityListPaginatedTable);