import React, { useState } from "react";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import './updateBike.styles.css'
import { updateBike } from "../../aws_services/dynamo_db";
import { selectUser } from "../../redux/auth/auth.selector";

function UpdateBike({ location, user }) {
    let bike = location.state.item;
    const [bikeID, setBikeID] = useState(bike.BikeID);
    const [driverEmail, setDriverEmail] = useState(bike.DriverEmail);
    const [sensors, setSensors] = useState(bike.Sensors);

    const driverEmails = []; // Array of driver emails

    user.RESPONSIBILITY_LIST.L.map((email, index) => {
        driverEmails.push(email.S)
    })

    const handleSave = () => {
        const updatedBike = {
            BikeID: bikeID,
            DriverEmail: driverEmail,
            Sensors: sensors,
            EmergencyContacts: bike.EmergencyContacts,
        };
        updateBike(updatedBike);
    };

    const handleSensorChange = (index, field, value) => {
        const newSensors = [...sensors];
        newSensors[index][field] = value;
        setSensors(newSensors);
    };

    const handleAddSensor = () => {
        const newSensor = { name: "", location: "", faulty: false };
        setSensors([...sensors, newSensor]);
    };

    const handleRemoveSensor = (index) => {
        const newSensors = [...sensors];
        newSensors.splice(index, 1);
        setSensors(newSensors);
    };

    return (
        <div className="edit-bike">
            <h2>Edit Bike {bikeID}</h2>
            <div>
                <label>Bike ID:</label>
                <input disabled type="text" value={bikeID} onChange={(e) => setBikeID(e.target.value)} />
            </div>
            <div>
                <label>Driver Email:</label>
                <select value={driverEmail} onChange={(e) => setDriverEmail(e.target.value)}>
                    {driverEmails.map((email, index) => (
                        <option key={index} value={email}>
                            {email}
                        </option>
                    ))}
                </select>
            </div>

            <h3>Sensors:</h3>
            {sensors.map((sensor, index) => (
                <div key={index} className="sensor-each">
                    <h4>Sensor {index + 1}</h4>
                    <div>
                        <label>Name:</label>
                        <input
                            type="text"
                            value={sensor.name}
                            onChange={(e) => handleSensorChange(index, "name", e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Location:</label>
                        <input
                            type="text"
                            value={sensor.location}
                            onChange={(e) => handleSensorChange(index, "location", e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Faulty:</label>
                        <input
                            type="checkbox"
                            checked={sensor.faulty}
                            onChange={(e) => handleSensorChange(index, "faulty", e.target.checked)}
                        />
                    </div>
                    <button onClick={() => handleRemoveSensor(index)}>Remove Sensor</button>
                </div>
            ))}
            <button onClick={handleAddSensor}>Add Sensor</button>
            <br />

            <button onClick={handleSave}>Save Changes</button>
        </div>
    );
}

const mapStateToProps = createStructuredSelector({
    user: selectUser
});


export default connect(mapStateToProps)(UpdateBike);