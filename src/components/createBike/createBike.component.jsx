import React, { useState } from 'react';
import './createBike.styles.css'
import { createBike } from '../../aws_services/dynamo_db';

const initialSensor = { name: '', location: '', faulty: false };


const CreateBike = () => {
    const [bikeid, setBikeid] = useState('');
    const [sensors, setSensors] = useState([]);

    const [newSensor, setNewSensor] = useState(initialSensor);

    const handleAddSensor = () => {
        setSensors([...sensors, newSensor]);
        setNewSensor(initialSensor);
    };

    const handleRemoveSensor = (indexToRemove) => {
        setSensors(sensors.filter((sensor, index) => index !== indexToRemove));
    };

    const handleSubmit = () => {
        const bike = { bikeid, sensors };
        console.log(bike)
        createBike(bike);
        alert("Bike created.")
        setBikeid('');
        setSensors([]);
    };

    return (
        <div className='create-bike'>
            <label htmlFor="bikeid">Bike ID:</label>
            <input type="text" id="bikeid" value={bikeid} onChange={(e) => setBikeid(e.target.value)} />

            <h3>Sensors:</h3>
            {sensors.map((sensor, i) => (
                <div key={i}>
                    <div className='sensor-row'>
                        <p>{sensor.name} - {sensor.location} - {sensor.faulty ? 'Faulty' : 'OK'}</p>
                        <button className='remove-sensor-btn' onClick={() => handleRemoveSensor(i)}>Remove Sensor</button>
                    </div>

                </div>
            ))}
            <div>
                <label htmlFor="sensorName">Sensor Name:</label>
                <select id="sensorName" value={newSensor.name} onChange={(e) => setNewSensor({ ...newSensor, name: e.target.value })}>
                    <option value=""></option>
                    <option value="accel/gyro">Accelerometer/Gyroscope</option>
                    <option value="ultrasonic">Ultrasonic</option>
                    <option value="impact">Impact</option>
                </select>

                <label htmlFor="sensorLocation">Sensor Location:</label>
                <select id="sensorLocation" value={newSensor.location} onChange={(e) => setNewSensor({ ...newSensor, location: e.target.value })}>
                    <option value=""></option>
                    <option value="middle">Middle</option>
                    <option value="right">Right</option>
                    <option value="left">Left</option>
                    <option value="front">Front</option>
                    <option value="back">Back</option>
                </select>

                <button onClick={handleAddSensor}>Add Sensor</button>
            </div>

            <button onClick={handleSubmit}>Submit</button>
        </div>
    );
};

export default CreateBike;
