import { useState, useEffect } from "react";
import { getTripsByDriverEmail } from "../../aws_services/dynamo_db";
import "./tripViewTable.styles.css";

function TripViewTable({ driverEmail }) {

    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [trips, setTrips] = useState([]);

    useEffect(() => {
        async function fetchTrips() {
            const { results, totalPages } = await getTripsByDriverEmail(driverEmail, pageNumber, pageSize);
            setTrips(results);
            setTotalPages(totalPages);
        }

        fetchTrips();
    }, [driverEmail, pageNumber, pageSize]);

    function handleNextPage() {
        if (pageNumber < totalPages) {
            setPageNumber(pageNumber + 1);
        }
    }

    function handlePrevPage() {
        if (pageNumber > 1) {
            setPageNumber(pageNumber - 1);
        }
    }

    return (
        <div className="trip-table">
            <table>
                <thead>
                    <tr>
                        <th>Trip ID</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                        <th>Risk Level</th>
                        <th>Risky Instances</th>
                    </tr>
                </thead>
                <tbody>
                    {trips.map((trip) => (
                        <tr key={trip.TripID.S}>
                            <td>{trip.TripID.S}</td>
                            <td>{trip.StartTimeStamp.S}</td>
                            <td>{trip.EndTimeStamp.S}</td>
                            <td>{trip.RiskLevel.N}</td>
                            <td>{trip.RiskyInstances.L.length}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="pagination">
                <button onClick={handlePrevPage} disabled={pageNumber === 1} className='previous_button'>
                    Prev
                </button>
                <button onClick={handleNextPage} disabled={pageNumber === totalPages} className='next_button'>
                    Next
                </button>
            </div>
        </div>
    );
}

export default TripViewTable;
