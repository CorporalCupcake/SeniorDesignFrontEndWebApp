import React, { useState, useEffect } from "react";

import Loading from "../loading/loading.component";

import { generateDriverBehavioralReport } from "../../aws_services/dynamo_db";

import "./behaviourReport.css";

const BehaviourReport = ({ tripIDs }) => {
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getReport = async () => {
            try {
                const result = await generateDriverBehavioralReport(tripIDs);
                console.log(result);
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
        <div className="behavior-report-container">
            <div className="behavior-report">
                <div className="report-item">
                    <span>Average Risk Level:</span>
                    <span>{report.avgRiskLevel}</span>
                </div>
                <div className="report-item">
                    <span>Most Frequent Maneuver:</span>
                    <span>{report.mostFrequentManeuver.maneuver}</span>
                </div>
                <div className="report-item">
                    <span>Count:</span>
                    <span>{report.mostFrequentManeuver.count}</span>
                </div>
            </div>
        </div>
    );
};

export default BehaviourReport;
