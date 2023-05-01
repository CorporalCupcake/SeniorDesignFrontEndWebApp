import React, { useState, useEffect } from "react";

import { getTripReportsByDriverEmail } from "../../aws_services/dynamo_db";
import Loading from '../loading/loading.component'
import { HiOutlineDocumentReport } from 'react-icons/hi';
import { IconContext } from "react-icons";

import BehaviourReport from "../BehviourReport/behaviourReport";

import { selectUser } from "../../redux/auth/auth.selector";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";

import TripReport from '../tripReport/tripReport.component'

import "./tripsManagment.styles.css";

const TripsManagment = ({ user }) => {

    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(100);
    const [totalPages, setTotalPages] = useState(1);

    const [tripReports, setTripReports] = useState(null);
    const [selectedTripIds, setSelectedTripIds] = useState([]);

    const [tripReportToView, setTripReportToView] = useState(null)

    const [driverEmail, setDriverEmail] = useState('');
    const [viewBR, setViewBR] = useState(false)

    const responsibilityList = user.RESPONSIBILITY_LIST.L.map((email, index) => {
        return (
            <option key={index} value={email.S}>{email.S}</option>
        )
    })

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



    const handleEmailChange = (event) => {
        setDriverEmail(event.target.value);
    }

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

    const handleCheckboxClick = (e, tripId) => {
        if (e.target.checked) {
            setSelectedTripIds([...selectedTripIds, tripId]);
        } else {
            setSelectedTripIds(selectedTripIds.filter(id => id !== tripId));
        }
    };

    const isChecked = (tripID) => {
        return selectedTripIds.includes(tripID)
    }



    if (tripReports === null) {
        return <Loading />
    }


    if (tripReportToView !== null) {
        return <TripReport className='trip-report' tripData={tripReportToView} />
    }

    if (viewBR === true) {
        return <BehaviourReport tripIDs={selectedTripIds} />
    }



    return (<>
        <div className="select-wrapper">
            <div className="label_select">Driver Email:</div>
            <select onChange={handleEmailChange} value={driverEmail}>
                <option value="">Select Email</option>
                {responsibilityList}
            </select>
        </div>


        <table className="trip-table">
            <thead>
                <tr>
                    <th>Include in Behavioural Report</th>
                    <th>Trip ID</th>
                    <th>Driver Email</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                    <th>Risk Level</th>
                    <th>View Trip Report</th>
                </tr>
            </thead>

            <tbody>
                {tripReports.map((item, index) => (
                    <tr key={index}>
                        <td><input className='checkbox' type="checkbox" onClick={e => handleCheckboxClick(e, item.TripID.S)} checked={isChecked(item.TripID.S)} /></td>
                        <td>{item.TripID.S}</td>
                        <td>{item.DriverEmail.S}</td>
                        <td>{convertTime(item.StartTime.S)}</td>
                        <td>{convertTime(item.EndTime.S)}</td>
                        <td>{item.RiskLevel.N}</td>
                        <td><div className='click-report'onClick={() => setTripReportToView(item)}>
                            <IconContext.Provider value={{ color: 'green', size: '50px' }}>
                                <HiOutlineDocumentReport />
                            </IconContext.Provider>
                        </div></td>

                    </tr>
                ))}
            </tbody>
        </table>

        <div className="pagination">
            <button className='previous-button' onClick={handlePrevPage} disabled={pageNumber === 1}>Prev</button>
            <button className='next-button' onClick={handleNextPage} disabled={pageNumber === totalPages}>Next</button>
        </div>

        <button className='button-br' onClick={() => setViewBR(true)}>Generate Behavioural Report</button>
    </>)
}

const mapStateToProps = createStructuredSelector({
    user: selectUser
});

export default connect(mapStateToProps)(TripsManagment);