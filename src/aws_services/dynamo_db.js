import { GetItemCommand, DynamoDBClient, PutItemCommand, QueryCommand, ScanCommand, BatchGetItemCommand, UpdateItemCommand, DeleteItemCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb"
import { creds } from "./awsKey";
import axios from "axios";

const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB({
    credentials: creds,
    region: 'us-east-1',
    removeUndefinedValues: true,
});

// ----------------------- DYNAMO DB CONFIGURATION FILES -----------------------

// Create the Dynamo DB Client with the region and user access keys. There is also a shared config file with the keys stores in ~/.aws/config*
const ddbClient = new DynamoDBClient({
    credentials: creds,
    region: 'us-east-1',
    removeUndefinedValues: true,
});

const marshallOptions = {
    // Whether to automatically convert empty strings, blobs, and sets to `null`.
    convertEmptyValues: true, // false, by default.
    // Whether to remove undefined values while marshalling.
    removeUndefinedValues: false, // false, by default.
    // Whether to convert typeof object to map attribute.
    convertClassInstanceToMap: false, // false, by default.
};

const unmarshallOptions = {
    // Whether to return numbers as a string instead of converting them to native JavaScript numbers.
    wrapNumbers: false, // false, by default.
};

// Create the DynamoDB document client.
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient, {
    marshallOptions,
    unmarshallOptions
});


// ----------------------- FUNCTIONS -----------------------


export const putItemInTable = async ({ TableName, Item }) => {
    try {
        const response = await ddbDocClient.send(new PutItemCommand({ TableName, Item }));
        return response;
    } catch (err) {
        console.error('Error putting item:', err);
        return err;
    }
};

export const getUserByEmailAndPassword = async ({ email, password }) => {
    const params = {
        KeyConditionExpression: 'EMAIL = :email', // This is finding by the partition key
        FilterExpression: "PASSWORD = :password", // This is an additional filter expression
        ExpressionAttributeValues: {
            ':email': { S: email },
            ':password': { S: password }
        },
        // ProjectionExpression: "EMAIL, PASSWORD, BAND, FULL_NAME", // OPTIONAL | Fields to return
        TableName: "users",
    };

    const data = await ddbClient.send(new QueryCommand(params));
    return data;
}

export const getUserByEmail = async ({ email }) => {
    const params = {
        KeyConditionExpression: 'EMAIL = :email', // This is finding by the partition key
        ExpressionAttributeValues: {
            ':email': { S: email }
        },
        // ProjectionExpression: "EMAIL, PASSWORD, BAND, FULL_NAME", // OPTIONAL | Fields to return
        TableName: "users",
    };

    const data = await ddbClient.send(new QueryCommand(params));
    return data;
}

export const updateUserResponsibilityList = async ({ currentUserEmail, newUserEmail }) => {

    const params = {
        TableName: "users",
        Key: {
            EMAIL: currentUserEmail
        },
        UpdateExpression: 'set RESPONSIBILITY_LIST = list_append(RESPONSIBILITY_LIST, :rl)',
        ExpressionAttributeValues: {
            ':rl': [newUserEmail]
        }
    }

    try {
        return await ddbDocClient.send(new UpdateCommand(params));
    } catch (err) {
        console.error("Error", err);
    }

}

export const getUsersFromResponsibilityPaginated = async (user, pageNumber, pageSize) => {

    const emailList = user.RESPONSIBILITY_LIST.L;

    const itemsToSkip = (pageNumber - 1) * pageSize;
    const itemsToGet = emailList.slice(itemsToSkip, itemsToSkip + pageSize);
    const params = {
        RequestItems: {
            "users": {
                Keys: itemsToGet.map((email) => ({ "EMAIL": email })),
            }
        }
    };

    const { Responses } = await ddbClient.send(new BatchGetItemCommand(params));

    return Responses.users;
}

export const getTripDetailsByTripID = async (tripID) => {
    const params = {
        KeyConditionExpression: 'TripID = :tid', // This is finding by the partition key
        ExpressionAttributeValues: {
            ':tid': { S: tripID }
        },
        TableName: "Trips",
    };

    const data = await ddbClient.send(new QueryCommand(params));
    return data.Items[0];
}


export const getTripReportsByDriverEmail = async (driverEmail, pageNumber, pageSize) => {
    const params = {
        TableName: "TripReport",
        FilterExpression: "DriverEmail = :driverEmail",
        ExpressionAttributeValues: { ":driverEmail": { S: driverEmail } },
    };

    try {
        const data = await ddbClient.send(new ScanCommand(params));

        const totalItems = data.Count;
        const itemsPerPage = pageSize;
        const totalPages = Math.ceil(totalItems / itemsPerPage);

        const startIndex = (pageNumber - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        const paginatedResults = data.Items.slice(startIndex, endIndex);

        return {
            totalItems,
            totalPages,
            itemsPerPage,
            pageNumber,
            results: paginatedResults,
        };
    } catch (err) {
        throw (err);
    }
}

export const getMessagesUsingRecieverEmail = async (receiverEmail, onlyStarred, onlyFlagged, pageNumber, pageSize) => {
    let filterExpression = 'recieverEmail = :receiverEmail';
    const expressionAttributeValues = {
        ':receiverEmail': { S: receiverEmail }
    };

    if (onlyStarred) {
        filterExpression += ' AND starredByReciever = :starredByReciever';
        expressionAttributeValues[':starredByReciever'] = { BOOL: true };
    }

    if (onlyFlagged) {
        filterExpression += ' AND flaggedImportantBySender = :flaggedImportantBySender';
        expressionAttributeValues[':flaggedImportantBySender'] = { BOOL: true };
    }

    const params = {
        TableName: 'Messages',
        FilterExpression: filterExpression,
        ExpressionAttributeValues: expressionAttributeValues,
        Limit: pageSize,
        // ExclusiveStartKey: pageNumber > 1 ? { messageID: { S: `${receiverEmail};2023-04-23;14:27:53` } } : null
    };

    try {
        const data = await ddbClient.send(new ScanCommand(params));

        const totalItems = data.Count;
        const itemsPerPage = pageSize;
        const totalPages = Math.ceil(totalItems / itemsPerPage);

        const startIndex = (pageNumber - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        const paginatedResults = data.Items.slice(startIndex, endIndex);

        return {
            totalItems,
            totalPages,
            itemsPerPage,
            pageNumber,
            results: paginatedResults,
        };
    } catch (err) {
        throw (err);
    }

}

export const generateDriverBehavioralReport = async (tripIDs, comment) => {
    const params = {
        RequestItems: {
            TripReport: {
                Keys: tripIDs.map((tripID) => ({ TripID: { S: tripID } })),
                ProjectionExpression: 'InstanceReports, RiskLevel',
            },
        },
    };

    try {
        const results = await ddbClient.send(new BatchGetItemCommand(params));
        const instances = results.Responses.TripReport.map((trip) => trip.InstanceReports.L).flat();
        console.log(instances)
        const riskLevels = results.Responses.TripReport.map((trip) => parseInt(trip.RiskLevel.N));

        const avgRiskLevel = riskLevels.reduce((sum, level) => sum + level, 0) / riskLevels.length;

        const maneuvers = instances.reduce((maneuvers, instance) => {
            const classification = instance.M.classification.S.trim();
            if (classification.length > 0) {
                const parts = classification.split('|').filter((part) => part.trim().length > 0);
                parts.forEach((part) => {
                    if (part in maneuvers) {
                        maneuvers[part]++;
                    } else {
                        maneuvers[part] = 1;
                    }
                });
            }
            return maneuvers;
        }, {});

        const mostFrequentManeuver = Object.entries(maneuvers).reduce(
            (mostFrequent, [maneuver, count]) => {
                if (count > mostFrequent.count) {
                    return { maneuver, count };
                } else {
                    return mostFrequent;
                }
            },
            { maneuver: '', count: 0 }
        );

        const riskyInstancesCount = instances.filter((instance) => {
            const classification = instance.M.classification.S.trim();
            return classification.includes(mostFrequentManeuver.maneuver);
        }).length;

        console.log(instances)

        const percentageOfRiskyInstances = (riskyInstancesCount / instances.length) * 100;

        return {
            avgRiskLevel,
            mostFrequentManeuver,
            percentageOfRiskyInstances,
            comment,
        };
    } catch (err) {
        console.error(err);
    }
};


export async function getBikes(pageNumber, pageSize, listOfEmails, getNulls) {

    if (getNulls) {
        listOfEmails.push('unassigned');
    }


    const scanParams = {
        TableName: 'Bike',
        IndexName: 'DriverEmailGSI',
        FilterExpression: listOfEmails.map((_, i) => `DriverEmail = :email${i}`).join(' OR '),
        ExpressionAttributeValues: listOfEmails.reduce((acc, email, i) => {
            acc[`:email${i}`] = { S: email };
            return acc;
        }, {}),
    };

    try {
        const data = await ddbClient.send(new ScanCommand(scanParams));
        data.Items = data.Items.map(item => AWS.DynamoDB.Converter.unmarshall(item));

        const totalItems = data.Count;
        const itemsPerPage = pageSize;
        const totalPages = Math.ceil(totalItems / itemsPerPage);

        const startIndex = (pageNumber - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        const paginatedResults = data.Items.slice(startIndex, endIndex);

        return {
            totalItems,
            totalPages,
            itemsPerPage,
            pageNumber,
            results: paginatedResults,
        };
    } catch (err) {
        console.error(err);
        throw new Error('Error retrieving bikes by driver emails');
    }
}



// FilterExpression: 'attribute_not_exists(DriverEmail) OR DriverEmail = :driverEmail',

export const getBehaviouralReportById = async (id) => {
    const params = {
        KeyConditionExpression: 'tripIDs = :id', // This is finding by the partition key
        ExpressionAttributeValues: {
            ':id': { S: id }
        },
        TableName: "BehaviouralReports",
    }

    try {
        const command = new QueryCommand(params);
        const response = await ddbClient.send(command);

        if (response.Count === 1) {
            return (AWS.DynamoDB.Converter.unmarshall(response.Items[0]));

        } else {
            return false;
        }
    } catch (error) {
        console.error(error);
        return false;
    }
}


export const insertBehaviouralReport = async ({ tripIDs, report, comment }) => {
    const tripIDs_S = tripIDs.join()
    const params = {
        TableName: "BehaviouralReports",
        Item: AWS.DynamoDB.Converter.marshall({ tripIDs: tripIDs_S, report, comment }),
    };

    try {
        const command = new PutItemCommand(params);
        const response = await ddbClient.send(command);
        console.log(`Successfully inserted report for trips: ${tripIDs}`);
        return response;
    } catch (err) {
        console.error(`Failed to insert report for trips: ${tripIDs}`);
        console.error(err);
        throw err;
    }
}


export const getUserEmergencyContact = async (driverEmail) => {
    const params = {
        TableName: "Bike",
        FilterExpression: "DriverEmail = :driverEmail",
        ExpressionAttributeValues: {
            ":driverEmail": { S: driverEmail },
        },
        ProjectionExpression: "EmergencyContacts",
    };

    try {
        const command = new ScanCommand(params);
        const { Items } = await ddbClient.send(command);

        if (Items.length === 0) {
            throw new Error(`No emergency contacts found for driver email: ${driverEmail}`);
        }

        const [result] = Items;

        return AWS.DynamoDB.Converter.unmarshall(result);
    } catch (err) {
        console.error(`Failed to retrieve emergency contacts for driver email: ${driverEmail}`);
        console.error(err);
        throw err;
    }
}

export async function createBike(bike) {
    const params = {
        TableName: "Bike",
        Item: {
            BikeID: { S: bike.bikeid },
            EmergencyContacts: { L: [] },
            DriverEmail: { S: 'unassigned' },
            Sensors: {
                L: bike.sensors.map(sensor => ({
                    M: {
                        name: { S: sensor.name },
                        location: { S: sensor.location },
                        faulty: { BOOL: sensor.faulty },
                    }
                }))
            },
        },
    };

    try {
        // Call the PutItemCommand with the defined parameters
        const command = new PutItemCommand(params);
        const result = await ddbClient.send(command);

        console.log("Bike object created successfully:", result);
    } catch (err) {
        console.error("Error creating bike object:", err);
    }
}

export async function updateBike(bike) {
    const params = {
        TableName: "Bike", // Replace with your table name
        Key: { BikeID: { S: bike.BikeID } },
        UpdateExpression: "SET DriverEmail = :email, Sensors = :sensors",
        ExpressionAttributeValues: {
            ":email": { S: bike.DriverEmail },
            ":sensors": { L: [] },
        },
    };

    bike.Sensors.forEach((sensor, index) => {
        params.ExpressionAttributeValues[":sensors"].L.push({
            M: {
                name: { S: sensor.name },
                location: { S: sensor.location },
                faulty: { BOOL: sensor.faulty },
            },
        });
    });

    try {
        const data = await ddbClient.send(new UpdateItemCommand(params));
        console.log("Bike updated successfully:", data);
    } catch (err) {
        console.error("Error updating bike:", err);
    }
}


export async function deleteBike(bikeID) {
    const params = {
        TableName: "Bike", // Replace with your table name
        Key: { BikeID: { S: bikeID } },
    };

    try {
        const data = await ddbClient.send(new DeleteItemCommand(params));
        console.log("Bike deleted successfully:", data);
    } catch (err) {
        console.error("Error deleting bike:", err);
    }
}

// Function to delete a user by ID from the "users" table
export async function deleteUserById(userId) {
    const params = {
        TableName: 'users',
        Key: {
            EMAIL: { S: userId }
        }
    };

    try {
        const command = new DeleteItemCommand(params);
        await ddbClient.send(command);
        console.log(`User with ID ${userId} has been deleted successfully.`);
    } catch (error) {
        console.error('Error deleting user:', error);
    }
}

export async function updateUserEmergencyContact(email, emergencyContacts) {
    // const params = {
    //     TableName: "users", // Replace with your table name
    //     Key: { EMAIL: { S: email } },
    //     UpdateExpression: "SET EmergencyContacts = :emergencyContacts",
    //     ExpressionAttributeValues: {
    //         ":emergencyContacts": { L: [] },
    //     },
    // };

    // emergencyContacts.forEach((contact, index) => {
    //     params.ExpressionAttributeValues[":emergencyContacts"].L.push({
    //         M: {
    //             name: { S: contact.name },
    //             email: { S: contact.email },
    //             phoneNumber: { S: contact.phoneNumber },
    //         },
    //     });
    // });

    // try {
    //     const data = await ddbClient.send(new UpdateItemCommand(params));
    //     console.log("User emergency contacts updated successfully:", data);
    // } catch (err) {
    //     console.error("Error updating user emergency contacts:", err);
    // }

    console.log(emergencyContacts)
    const res = await getBikes(1, 100, [email], false);
    const bike_id = await res.results[0].BikeID;
    console.log(bike_id)

    const r = await axios.put(`https://iotblackbox.azurewebsites.net/bikes/${bike_id}/emergency_contacts`, emergencyContacts);
    console.log(r)
}

export async function updateEmergencyContactsInBikeTable(email, newEmergencyContacts) {
    const convertedEmergencyContacts = newEmergencyContacts.map(contact => ({
        M: {
            email: { S: contact.email },
            name: { S: contact.name },
            phoneNumber: { S: contact.phoneNumber }
        }
    }));

    try {
        const res = await getBikes(1, 100, [email], false);
        const bike_id = res.results[0].BikeID;

        const params = {
            TableName: 'Bike',
            Key: { BikeID: { S: bike_id } },
            UpdateExpression: 'SET EmergencyContacts = :emergencyContacts',
            ExpressionAttributeValues: {
                ':emergencyContacts': { L: convertedEmergencyContacts },
            },
        };

        const command = new UpdateItemCommand(params);
        const data = await ddbClient.send(command);
        console.log('Emergency contacts updated successfully:', data);
    } catch (err) {
        console.error('Error updating emergency contacts:', err);
    }
}



export async function removeUserFromResponsibilityList(email, emailToRemove) {
    const params = {
        TableName: "users", // Replace with your table name
        Key: { EMAIL: { S: email } },
        UpdateExpression: "DELETE RESPONSIBILITY_LIST :emailToRemove",
        ExpressionAttributeValues: {
            ":emailToRemove": { L: [{ S: emailToRemove }] },
        },
        ConditionExpression: "contains(RESPONSIBILITY_LIST, :emailToRemove)",
    };

    try {
        const data = await ddbClient.send(new UpdateItemCommand(params));
        console.log("User removed from responsibility list:", data);
    } catch (err) {
        console.error("Error removing user from responsibility list:", err);
    }
}

