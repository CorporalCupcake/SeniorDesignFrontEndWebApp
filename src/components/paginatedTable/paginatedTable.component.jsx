import React, { useState } from "react";
import { Table } from "react-bootstrap";
import "./paginatedTable.styles.css";

const PaginatedTable = ({ users, tableFields }) => {

    const [activeRow, setActiveRow] = useState(null);

    const handleRowClick = (index) => {
        setActiveRow(index === activeRow ? null : index);
    };

    return (
        <Table responsive bordered hover className="user-table">
            <thead>
                <tr>
                    {tableFields.map(str => <th>{str}</th>)}
                </tr>
            </thead>

            <tbody>
                {users.map((user, index) => (
                    <tr
                        key={index}
                        className={index === activeRow ? "active" : ""}
                        onClick={() => handleRowClick(index)}
                    >
                        <td>{user.FULL_NAME.S}</td>
                        <td>{user.BAND.S}</td>
                        <td>{user.EMAIL.S}</td>
                        <td>{user.ID_NUMBER.S}</td>
                        <td>{user.COMPANY.S}</td>
                        <td>
                            <ul>
                                {user.RESPONSIBILITY_LIST.L.map((responsibility, index) => (
                                    <li key={index}>{responsibility.S}</li>
                                ))}
                            </ul>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
};

export default PaginatedTable;