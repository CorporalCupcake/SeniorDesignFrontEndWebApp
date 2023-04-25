import { DynamoDBClient, PutItemCommand, QueryCommand, ScanCommand, BatchGetItemCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb"

import { creds } from "./awsKey";

// ----------------------- DYNAMO DB CONFIGURATION FILES -----------------------

// Create the Dynamo DB Client with the region and user access keys. There is also a shared config file with the keys stores in ~/.aws/config*
const ddbClient = new DynamoDBClient({
    credentials: creds,
    region: 'us-east-1'
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
        return await ddbDocClient.send(new PutItemCommand({ TableName, Item }));
    } catch (err) {
        return err
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

export const updateUserResponsibilityList = async ({ currentUser, newUserEmail }) => {

    const params = {
        TableName: "users",
        Key: {
            EMAIL: currentUser.EMAIL.S
        },
        UpdateExpression: 'set RESPONSIBILITY_LIST = list_append(RESPONSIBILITY_LIST, :rl)',
        ExpressionAttributeValues: {
            ':rl': [newUserEmail]
        }
    }

    try {
        return await ddbDocClient.send(new UpdateCommand(params));
    } catch (err) {
        console.log("Error", err);
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