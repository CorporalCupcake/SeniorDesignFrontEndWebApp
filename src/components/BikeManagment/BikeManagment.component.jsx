import React, { useState, useEffect } from "react";

import Loading from '../loading/loading.component'

import { getBikes } from "../../aws_services/dynamo_db";


import { selectUser } from "../../redux/auth/auth.selector";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";


import "./BikeManagment.styles.css";

const BikeManagment = ({ user }) => {

    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(2);
    const [totalPages, setTotalPages] = useState(1);
    const [data, setData] = useState([])


    useEffect(() => {
        async function fetchBikes() {
            const rl = [];

            user.BAND.S === 'DRIVER'
                ? rl = [user.EMAIL.S]
                : user.RESPONSIBILITY_LIST.L.forEach(item => rl.push(item.S))

            getBikes(pageNumber, pageSize, rl, user.BAND.S !== 'DRIVER')
                .then((res) => {
                    setTotalPages(res.totalPages)
                    setPageNumber(res.pageNumber)
                    setData(res.results)
                    console.log(res.results)
                })
                .catch(err => console.error(err))

        }

        fetchBikes();
    }, [pageNumber, pageSize]);


    const handlePrevPage = () => {
        if (pageNumber > 1) {
            setPageNumber(pageNumber - 1);
        }
    };

    const handleNextPage = () => {
        if (pageNumber < totalPages) {
            setPageNumber(pageNumber + 1);
        }
    };

    if (data === null) {
        return <Loading />
    }

    return (<>
        <table>
            <thead>
                <tr>
                    <th>Bike ID</th>
                    <th>Driver Email</th>
                    <th>Prototype Sensors</th>
                </tr>
            </thead>
            <tbody>
                {data.map((item, index) => (
                    <tr key={index}>
                        <td>{item.BikeID}</td>
                        <td>{item.DriverEmail}</td>
                        <td>
                            <ul>
                                {item.Sensors.map((sensor, index) => (
                                    <li key={index}>
                                        {sensor.name} - {sensor.location} | {sensor.faulty ? 'Faulty' : 'Working'}
                                    </li>
                                ))}
                            </ul>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>


        <div className="pagination">
            <button className='previous-button' onClick={handlePrevPage} disabled={pageNumber === 1}>Prev</button>
            <button className='next-button' onClick={handleNextPage} disabled={pageNumber === totalPages}>Next</button>
        </div>
    </>)
}

const mapStateToProps = createStructuredSelector({
    user: selectUser
});

export default connect(mapStateToProps)(BikeManagment);