import React, { useState, useEffect } from "react";

import Loading from "../../components/loading/loading.component";

import { generateDriverBehavioralReport } from "../../aws_services/dynamo_db";

const BehaviourReportPage = ({ location }) => {

    const { tripIDs } = location.state;

    const [report, setReport] = useState(null)
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getReport = async () => {
            try {
                const result = await generateDriverBehavioralReport(tripIDs);
                console.log(result)
                setReport(result);
                setLoading(false);
            } catch (error) {
                console.log(error);
            }
        };

        getReport();
    }, [tripIDs]);

    if (loading) {
        return <Loading />;
    }

    return (
        <div>Hi</div>
    )
}

export default BehaviourReportPage;