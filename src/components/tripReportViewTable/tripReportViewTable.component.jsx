import { useState, useEffect } from "react";
import { getTripReportsByDriverEmail } from "../../aws_services/dynamo_db";
import Loading from '../loading/loading.component'
import "./TripReportViewTable.styles.css";

import React from 'react';

const TripReportViewTable = ({ driverEmail }) => {

    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize] = useState(2);
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

    return (
        <>{tripReports === null ? <Loading /> :
            <table>
                <thead>
                    <tr>
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
                        <tr key={index}>
                            {console.log(item)}
                            <td>{item.TripID.S}</td>
                            <td>{item.DriverEmail.S}</td>
                            <td>{item.StartTime.S}</td>
                            <td>{item.EndTime.S}</td>
                            <td>{item.RiskLevel.N}</td>
                            <td>{item.InstanceReports.L.length}</td>
                            <td>
                                {item.Videos.L.map((video, videoIndex) => (
                                    <div key={videoIndex}>
                                        <p>Location: {video.M.location.S}</p>
                                        <p>Link: {video.M.link.S}</p>
                                    </div>
                                ))}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        }</>
    );
}

{/* <td>
{item.InstanceReports.L.map((instance, instanceIndex) => (
    <div key={instanceIndex}>
        <p>Instance ID: {instance.M.instanceID.S}</p>
        <p>Classification: {instance.M.classification.S}</p>
        <p>Avg Distance: {instance.M.avgDistance.L.map((avg, avgIndex) => (
            <span key={avgIndex}>{avg.N}, </span>
        ))}</p>
        <p>Warning: {instance.M.warning.S}</p>
    </div>
))}
</td> */}

export default TripReportViewTable;
