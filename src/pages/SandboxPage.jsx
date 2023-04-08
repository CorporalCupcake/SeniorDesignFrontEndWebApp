import React from "react";

import { Button } from "react-bootstrap";
import { getTripsByDriverEmail } from "../aws_services/dynamo_db";

import TripViewTable from "../components/tripViewTable/tripViewTable.component";

const SandboxPage = () => (
    <TripViewTable driverEmail="td1@talabat.com"/>
)

export default SandboxPage;