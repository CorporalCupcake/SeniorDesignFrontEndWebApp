import React, { useState, useEffect, useReducer } from "react";
import Loading from '../loading/loading.component'
import { getBikes, deleteBike } from "../../aws_services/dynamo_db";
import { selectUser } from "../../redux/auth/auth.selector";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import "./BikeManagment.styles.css";
import { withRouter } from "react-router-dom";



const BikeManagment = ({ user, history }) => {

    const handleDelete = (bikeID) =>{
        deleteBike(bikeID);
        alert('Bike deleted.')
        forceUpdate()
    }

    const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(2);
    const [totalPages, setTotalPages] = useState(1);
    const [data, setData] = useState([])


    useEffect(() => {
        async function fetchBikes() {
            let rl = [];

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

    const handleCLickToEdit = (item) => {
        history.push({    // no need
            pathname: "/update-bike",
            state: { item }
        });
    }

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
                    <th>Delete</th>
                </tr>
            </thead>
            <tbody>
                {data.map((item, index) => (
                    <tr key={index} >
                        <td onClick={() => handleCLickToEdit(item)}>{item.BikeID}</td>
                        <td onClick={() => handleCLickToEdit(item)}>{item.DriverEmail}</td>
                        <td onClick={() => handleCLickToEdit(item)}>
                            <ul>
                                {item.Sensors.map((sensor, index) => (
                                    <li key={index} >
                                        {sensor.name} - {sensor.location} | {sensor.faulty ? 'Faulty' : 'Working'}
                                    </li>
                                ))}
                            </ul>
                        </td>
                        <td><button onClick={()=>handleDelete(item.BikeID)} className="delete-button">Delete</button></td>
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

export default withRouter(connect(mapStateToProps)(BikeManagment));
