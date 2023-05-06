import React from "react";

import UpdateBike from "../components/updateBike/updateBike.component";

const SandboxPage = () => {
    return (
        <UpdateBike bike={{
            "BikeID": "1234",
            "DriverEmail": "td2@talabat.com",
            "Sensors": [
                {
                    "faulty": false,
                    "location": "middle",
                    "name": "accel/gyro"
                },
                {
                    "faulty": false,
                    "location": "right",
                    "name": "ultrasonic"
                },
                {
                    "faulty": false,
                    "location": "left",
                    "name": "ultrasonic"
                },
                {
                    "faulty": false,
                    "location": "front",
                    "name": "impact"
                },
                {
                    "faulty": false,
                    "location": "back",
                    "name": "impact"
                }
            ]
        }} />
    )

}

export default SandboxPage;