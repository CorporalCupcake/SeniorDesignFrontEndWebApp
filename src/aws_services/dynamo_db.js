import { DynamoDBClient, PutItemCommand, QueryCommand, ScanCommand, BatchGetItemCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb"

// ----------------------- DYNAMO DB CONFIGURATION FILES -----------------------

// Create the Dynamo DB Client with the region and user access keys. There is also a shared config file with the keys stores in ~/.aws/config*
const ddbClient = new DynamoDBClient({
    credentials: {
        accessKeyId: 'AKIAWTJZLRJS6FXG2ZMH',
        secretAccessKey: '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',
    },
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


    /*
    -- Returned Fields --
    $metadata: {httpStatusCode: 200, requestId: "ROIJ918DSHCM4F6C9JHS2JRH3BVV4KQNSO5AEMVJF66Q9ASUAAJG", extendedRequestId: undefined, cfId: undefined, attempts: 1, …}
    ConsumedCapacity: undefined
    Count: 1
    Items: [Object] (1)
    LastEvaluatedKey: undefined
    ScannedCount: 1
    */

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


    /*
    -- Returned Fields --
    $metadata: {httpStatusCode: 200, requestId: "ROIJ918DSHCM4F6C9JHS2JRH3BVV4KQNSO5AEMVJF66Q9ASUAAJG", extendedRequestId: undefined, cfId: undefined, attempts: 1, …}
    ConsumedCapacity: undefined
    Count: 1
    Items: [Object] (1)
    LastEvaluatedKey: undefined
    ScannedCount: 1
    */

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

export const getItemsByPageNumber = async (user, pageNumber, pageSize) => {

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
    const items = Responses["users"];
    
    // Format of items
    // page_number: 1
    // users: Promise {status: "resolved", result: Array}

    return Responses.users;
}