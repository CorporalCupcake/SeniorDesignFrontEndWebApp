import React, { useState, useEffect } from "react";

import Loading from "../loading/loading.component";

import { generateDriverBehavioralReport } from "../../aws_services/dynamo_db";
import { insertBehaviouralReport, getBehaviouralReportById } from "../../aws_services/dynamo_db";

import "./behaviourReport.css";

const BehaviourReport = ({ tripIDs, comment }) => {
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getReport = async () => {
            if (tripIDs !== null) {
                try {
                    const temp = await getBehaviouralReportById(tripIDs.join());
                    if (temp === false) {
                        const result = await generateDriverBehavioralReport(tripIDs, comment);
                        insertBehaviouralReport({
                            tripIDs: tripIDs,
                            report: result,
                            comment: comment
                        })
                        console.log('inserted')
                        setReport(result);
                        setLoading(false);
                    } else {
                        console.log('report exists')
                        setReport(temp.report)
                        setLoading(false);
                    }
                } catch (error) {
                    console.log(error);
                }
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
                    <span>Most Frequent Clasification:</span>
                    <span>{report.mostFrequentManeuver.maneuver}</span>
                </div>
                <div className="report-item">
                    <span>{`% Of Risky Instances that were ${report.mostFrequentManeuver.maneuver}:`}</span>
                    <span>{report.percentageOfRiskyInstances.toFixed(2)}%</span>
                </div>
                <div className="report-item">
                    <span>Count of MFC:</span>
                    <span>{report.mostFrequentManeuver.count}</span>
                </div>
                <div className="report-item">
                    <span>Comment:</span>
                    <span>{report.comment}</span>
                </div>
            </div>
        </div>
    );
};

export default BehaviourReport;
