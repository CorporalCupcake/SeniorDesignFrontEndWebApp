import React from "react";
import { Button } from "react-bootstrap";

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectUser } from "../redux/auth/auth.selector";

import { getItemsByPageNumber } from "../aws_services/dynamo_db";
import PaginatedTable from "./paginatedTable/paginatedTable.component";

class ViewResponsibilityListPaginatedTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            page_number: 1,
            users: {},
            tableFields: ["Name", "Band", "Email", "ID Number", "Company", "Responsibility List"]
        }
    }

    componentWillMount = async () => {
        this.setState({
            users: await getItemsByPageNumber(this.props.user, 1, 2)
        })
    }

    render() {
        return (<>
            {console.log(this.state.users)}
            <PaginatedTable
                tableFields={this.state.tableFields}
                users={this.state.users}
            />
        </>)
    }



}

const mapStateToProps = createStructuredSelector({
    user: selectUser
})

export default connect(mapStateToProps)(ViewResponsibilityListPaginatedTable);