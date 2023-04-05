import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { selectUser } from "../../redux/auth/auth.selector";
import { createStructuredSelector } from "reselect";
import { getTripDetailsByTripID } from "../../aws_services/dynamo_db";
import "./tripReport.styles.css";

class TripReport extends React.Component {
    state = {
        tripData: null
    };

    async componentDidMount() {
        const { tripID } = this.props;
        const tripData = await getTripDetailsByTripID(tripID);
        this.setState({ tripData, dataIsFetched: true });
    }

    render() {
        const {tripData } = this.state;

        if (!tripData) {
            return <div>Loading...</div>;
        }

        const { TripID, BikeID, StartTimeStamp, EndTimeStamp, RiskLevel, RiskyInstances } = tripData;

        return (
            <div className="trip-report">
                <div className="trip-info">
                    <div className="label">Trip ID:</div>
                    <div className="value">{TripID.S}</div>
                </div>
                <div className="trip-info">
                    <div className="label">Bike ID:</div>
                    <div className="value">{BikeID.S}</div>
                </div>
                <div className="trip-info">
                    <div className="label">Start Time:</div>
                    <div className="value">{StartTimeStamp.S}</div>
                </div>
                <div className="trip-info">
                    <div className="label">End Time:</div>
                    <div className="value">{EndTimeStamp.S}</div>
                </div>
                <div className="trip-info">
                    <div className="label">Risk Level:</div>
                    <div className="value">{RiskLevel.N}</div>
                </div>
                {RiskyInstances && (
                    <div className="trip-info">
                        <div className="label">Risky Instances:</div>
                        <div className="value">
                            {RiskyInstances.L.map((instance) => instance.M).join(", ")}
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

const mapStateToProps = createStructuredSelector({
    user: selectUser
});

export default withRouter(connect(mapStateToProps)(TripReport));
