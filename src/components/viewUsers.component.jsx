import React from "react";
import { getAllUsersBasedOnBand } from "../aws_services/dynamo_db";

const ViewUsers = () => (
    <div>
        Hi Hello
        {()=>getAllUsersBasedOnBand({band:"DRIVER"})}
    </div>
)

export default ViewUsers;