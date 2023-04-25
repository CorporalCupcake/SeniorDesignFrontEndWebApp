import React, { useState, useEffect } from "react";

import { getTripReportsByDriverEmail } from "../../aws_services/dynamo_db";
import Loading from '../loading/loading.component'

import { withRouter } from "react-router-dom";

import "./tripsViewTable.styles.css";



const TripsViewTable = ({ driverEmail, history }) => {

    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(2);
    const [totalPages, setTotalPages] = useState(1);
    const [tripReports, setTripReports] = useState(null);

    useEffect(() => {
        async function fetchTripReports() {
            const { results, totalPages } = await getTripReportsByDriverEmail(
                driverEmail,
                pageNumber,
                pageSize
            );
            setTripReports(results);
            setTotalPages(totalPages);
        }

        fetchTripReports();
    }, [driverEmail, pageNumber, pageSize]);

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

    const handleTripClick = (item) => {
        history.push({
            pathname: "/trip-report",
            state: { item } // pass the item object as a prop to the new page
        });
    };

    return (
        <>{tripReports === null ? <Loading /> :
            <>
                <table className="trip-table">
                    <thead>
                        <tr>
                            <th>Index</th>
                            <th>Trip ID</th>
                            <th>Driver Email</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Risk Level</th>
                            <th>Risky Instance(s) Count</th>
                            <th>Videos</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tripReports.map((item, index) => (
                            <tr key={index} onClick={() => handleTripClick(item)}>
                                <td>{index}</td>
                                <td>{item.TripID.S}</td>
                                <td>{item.DriverEmail.S}</td>
                                <td>{item.StartTime.S}</td>
                                <td>{item.EndTime.S}</td>
                                <td>{item.RiskLevel.N}</td>
                                <td>{item.InstanceReports.L.length}</td>
                                <td>
                                    {item.Videos ?
                                        item.Videos.L.map((video, videoIndex) => (
                                            <div key={videoIndex}>
                                                <p><a href={video.M.link.S}>{video.M.location.S.toLowerCase().charAt(0).toUpperCase() + video.M.location.S.slice(1)}</a></p>
                                            </div>
                                        ))
                                        : null
                                    }

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="pagination">
                    <button className='previous-button' onClick={handlePrevPage} disabled={pageNumber === 1}>Prev</button>
                    <button className='next-button' onClick={handleNextPage} disabled={pageNumber === totalPages}>Next</button>
                </div>
            </>}
        </>
    )
}

export default withRouter(TripsViewTable);