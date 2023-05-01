import React, { useState, useEffect } from 'react';
import './tripReport.styles.css';
import Loading from '../loading/loading.component';

const TripReport = ({ tripData }) => {
    const convertTime = (datetimeStr) => {
        const year = datetimeStr.slice(4, 8);
        const month = parseInt(datetimeStr.slice(2, 4)) - 1; // months are 0-indexed in JS Date objects
        const day = datetimeStr.slice(0, 2);
        const hour = datetimeStr.slice(9, 11);
        const minute = datetimeStr.slice(11, 13);

        const dateObj = new Date(Date.UTC(year, month, day, hour, minute)); // create date object in UTC timezone

        const options = { timeZone: 'Asia/Dubai', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true };
        const finalDateTimeStr = dateObj.toLocaleString('en-US', options); // convert date object to string in the desired format (in Dubai timezone)
        return finalDateTimeStr;
    }

    const [topTwoWarnings, setTopTwoWarnings] = useState('')
    const [topTwoClassifications, setTopTwoClassifications] = useState('')

    useEffect(() => {
        const func = () => {
            const frequencyTable = {};

            tripData.InstanceReports.L.forEach((obj) => {
                const { classification, warning } = obj.M;

                if (classification && classification.S) {
                    const cls = classification.S;
                    frequencyTable[cls] = (frequencyTable[cls] || 0) + 1;
                }

                if (warning && warning.S) {
                    const wrn = warning.S;
                    frequencyTable[wrn] = (frequencyTable[wrn] || 0) + 1;
                }
            });

            const sortedFreqTable = Object.entries(frequencyTable).sort((a, b) => b[1] - a[1]);

            const topTwoClassifications = sortedFreqTable
                .filter(([key]) => key.includes("_"))
                .slice(0, 2)
                .map(([key]) => key);

            const topTwoWarnings = sortedFreqTable
                .filter(([key]) => key.includes("|"))
                .slice(0, 2)
                .map(([key]) => key);

            setTopTwoWarnings(topTwoWarnings);
            setTopTwoClassifications(topTwoClassifications);
        }

        func();
    }, [tripData])

    console.log(topTwoClassifications)
    console.log(topTwoWarnings)

    return (<>
        {!tripData ? <Loading /> :
            <div className="report-form">
                <u><h2>Trip Report</h2></u>
                <div className="trip-details">
                    <h3>Trip Details</h3>
                    <p><strong>Trip ID:</strong> {tripData.TripID.S}</p>
                    <p><strong>Driver Email:</strong> {tripData.DriverEmail.S}</p>
                    <p><strong>Start Time:</strong> {convertTime(tripData.StartTime.S)}</p>
                    <p><strong>End Time:</strong> {convertTime(tripData.EndTime.S)}</p>
                    <p><strong>Risk Level:</strong> {tripData.RiskLevel.N}</p>
                    <p><strong>Accident:</strong> {tripData.Accident.BOOL ? 'Yes' : 'No'}</p>
                    <p><strong>Top 2 Frequent Warnings:</strong> {topTwoWarnings}</p>
                    <p><strong>Top 2 Frequent Classifications:</strong> {topTwoClassifications}</p>

                </div>

                <div className="videos">
                    <h3>Videos</h3>
                    {tripData.Videos ?
                        tripData.Videos.L.map((video, videoIndex) => (
                            <div key={videoIndex}>
                                <p><a className='button' href={video.M.link.S}>{video.M.location.S.toLowerCase().charAt(0).toUpperCase() + video.M.location.S.slice(1)}</a></p>
                            </div>
                        ))
                        : null
                    }
                </div>
                <div className="instance-reports">
                    <h3>Instance Reports</h3>
                    {tripData.InstanceReports.L.map((instanceReport, index) => (
                        <div key={index} className="instance-report">
                            <p><strong>Instance ID:</strong> {instanceReport.M?.instanceID?.S || ''}</p>
                            <p><strong>Classification:</strong> {instanceReport.M?.classification?.S || ''}</p>
                            <p><strong>Average Distance:</strong> {instanceReport.M?.avgDistance?.L?.[0]?.N || ''} m</p>
                            <p><strong>Warning:</strong> {instanceReport.M?.warning?.S || ''}</p>
                        </div>
                    ))}
                </div>
            </div>}
    </>);
};

export default TripReport;