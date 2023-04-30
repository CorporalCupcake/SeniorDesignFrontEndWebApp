import React, { useState, useEffect } from "react";
import { createStructuredSelector } from "reselect";
import { selectUser } from "../../redux/auth/auth.selector";
import { connect } from "react-redux";
import { getBikes } from "../../aws_services/dynamo_db";

const BikeManagmentPage = ({ user }) => {
    const [bikes, setBikes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchBikes = async () => {
            try {
                setLoading(true);
                const response = await getBikes(1, 10, user.EMAIL.S, user.BAND.S);
                setBikes(response.Items);
            } catch (err) {
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchBikes();
    }, [user]);

    const renderSensors = (sensors) => {
        return sensors.map((sensor, index) => (
            <tr key={index}>
                <td>{sensor.name.S}</td>
                <td>{sensor.location.S}</td>
                <td>{sensor.faulty.BOOL ? "Yes" : "No"}</td>
            </tr>
        ));
    };

    if (error) {
        return <div>Error fetching bikes data</div>;
    }

    return (
        <div>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Bike ID</th>
                            <th>Driver Email</th>
                            <th>Sensors</th>
                            <th>Emergency Contacts</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bikes.map((bike) => (
                            <tr key={bike.BikeID.S}>
                                <td>{bike.BikeID.S}</td>
                                <td>{bike.DriverEmail.S}</td>
                                <td>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Location</th>
                                                <th>Faulty</th>
                                            </tr>
                                        </thead>
                                        <tbody>{renderSensors(bike.Sensors.L)}</tbody>
                                    </table>
                                </td>
                                <td>
                                    <ul>
                                        {bike.EmergencyContacts.L.map((contact, index) => (
                                            <li key={index}>
                                                <div>{contact.M.name.S}</div>
                                                <div>{contact.M.email.S}</div>
                                                <div>{contact.M.phoneNumber.S}</div>
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

const mapStateToProps = createStructuredSelector({
    user: selectUser
});

export default connect(mapStateToProps)(BikeManagmentPage);
