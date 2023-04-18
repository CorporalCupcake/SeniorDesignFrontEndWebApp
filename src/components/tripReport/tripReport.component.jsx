import React from 'react';
import './tripReport.styles.css';
import Loading from '../loading/loading.component';

const TripReport = ({ tripData }) => {
    return (<>
        {!tripData ? <Loading /> :
            <div className="report-form">
                <u><h2>Trip Report</h2></u>
                <div className="trip-details">
                    <h3>Trip Details</h3>
                    <p><strong>Trip ID:</strong> {tripData.item.TripID.S}</p>
                    <p><strong>Driver Email:</strong> {tripData.item.DriverEmail.S}</p>
                    <p><strong>Start Time:</strong> {tripData.item.StartTime.S}</p>
                    <p><strong>End Time:</strong> {tripData.item.EndTime.S}</p>
                    <p><strong>Risk Level:</strong> {tripData.item.RiskLevel.N}</p>
                    <p><strong>Accident:</strong> {tripData.item.Accident.BOOL ? 'Yes' : 'No'}</p>
                </div>
                <div className="videos">
                    <h3>Videos</h3>
                    {tripData.item.Videos ?
                        tripData.item.Videos.L.map((video, videoIndex) => (
                            <div key={videoIndex}>
                                <p><a className='button' href={video.M.link.S}>{video.M.location.S.toLowerCase().charAt(0).toUpperCase() + video.M.location.S.slice(1)}</a></p>
                            </div>
                        ))
                        : null
                    }
                </div>
                <div className="instance-reports">
                    <h3>Instance Reports</h3>
                    {tripData.item.InstanceReports.L.map((instanceReport, index) => (
                        <div key={index} className="instance-report">
                            <p><strong>Instance ID:</strong> {instanceReport.M?.instanceID?.S || ''}</p>
                            <p><strong>Classification:</strong> {instanceReport.M?.classification?.S || ''}</p>
                            <p><strong>Average Distance:</strong> {instanceReport.M?.avgDistance?.L?.[0]?.N || ''}</p>
                            <p><strong>Warning:</strong> {instanceReport.M?.warning?.S || ''}</p>
                        </div>
                    ))}
                </div>
            </div>}

    </>);
};

export default TripReport;