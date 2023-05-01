import React from 'react';
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