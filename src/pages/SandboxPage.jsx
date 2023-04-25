import React, { useState, useEffect } from "react";

import { getMessagesUsingRecieverEmail } from "../aws_services/dynamo_db";


const SandboxPage =() => {

    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(2);
    const [totalPages, setTotalPages] = useState(1);
    const [messages, setMessages] = useState(null);

    useEffect(() => {
        const fetchMessages = async () => {
            const data = await getMessagesUsingRecieverEmail('td3@talabat.com', false, false, 1, 2)
            console.log(data)
        }

        fetchMessages();
    }, [])

    return (
        <></>
    )

}

export default SandboxPage;