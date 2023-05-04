import React, { useState } from "react";
import { Form, Button, Col, Row } from "react-bootstrap";

const CreateBike = ({ onSubmit }) => {
    const [bikeData, setBikeData] = useState({
        bikeId: "",
        driverEmail: "",
        prototypeSensors: [],
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setBikeData({ ...bikeData, [name]: value });
    };

    const handleSensorChange = (event, index) => {
        const { name, value } = event.target;
        const sensors = [...bikeData.prototypeSensors];
        sensors[index][name] = value;
        setBikeData({ ...bikeData, prototypeSensors: sensors });
    };

    const handleAddSensor = () => {
        if (bikeData.prototypeSensors.length < 10) {
            const sensors = [...bikeData.prototypeSensors];
            sensors.push({ name: "", location: "" });
            setBikeData({ ...bikeData, prototypeSensors: sensors });
        }
    };

    const handleRemoveSensor = (index) => {
        const sensors = [...bikeData.prototypeSensors];
        sensors.splice(index, 1);
        setBikeData({ ...bikeData, prototypeSensors: sensors });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        onSubmit(bikeData);
        setBikeData({
            bikeId: "",
            driverEmail: "",
            prototypeSensors: [],
        });
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group controlId="bikeId">
                <Form.Label>Bike ID</Form.Label>
                <Form.Control
                    type="text"
                    name="bikeId"
                    value={bikeData.bikeId}
                    onChange={handleInputChange}
                    required
                />
            </Form.Group>

            <Form.Group controlId="driverEmail">
                <Form.Label>Driver Email</Form.Label>
                <Form.Control
                    type="email"
                    name="driverEmail"
                    value={bikeData.driverEmail}
                    onChange={handleInputChange}
                    required
                />
            </Form.Group>

            <Form.Group>
                <Form.Label>Prototype Sensors</Form.Label>
                {bikeData.prototypeSensors.map((sensor, index) => (
                    <Row key={index}>
                        <Col>
                            <Form.Control
                                as="select"
                                name="name"
                                value={sensor.name}
                                onChange={(event) => handleSensorChange(event, index)}
                                required
                            >
                                <option value="">Select sensor name</option>
                                <option value="accel/gyro">Accel/Gyro</option>
                                <option value="ultrasonic">Ultrasonic</option>
                                <option value="impact">Impact</option>
                            </Form.Control>
                        </Col>
                        <Col>
                            <Form.Control
                                as="select"
                                name="location"
                                value={sensor.location}
                                onChange={(event) => handleSensorChange(event, index)}
                                required
                            >
                                <option value="">Select sensor location</option>
                                <option value="front">Front</option>
                                <option value="back">Back</option>
                                <option value="middle">Middle</option>
                                <option value="left">Left</option>
                                <option value="right">Right</option>
                            </Form.Control>
                        </Col>
                        <Col>
                            <Button
                                variant="danger"
                                type="button"
                                onClick={() => handleRemoveSensor(index)}

                            >
                                Remove
                            </Button>
                        </Col>
                    </Row>
                ))}
            </Form.Group>
        </Form>
    )

};

export default CreateBike;