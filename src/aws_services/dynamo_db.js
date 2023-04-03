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

export const getItemsByPageNumber = async (emailList) => {

    // const PAGE_SIZE = 2;


    // let params = {
    //     TableName: "users",
    //     Limit: PAGE_SIZE,
    //     RequestItems: {
    //         "users": {
    //             Keys: user.RESPONSIBILITY_LIST.L.map(email => ({ EMAIL: { S: email } })),
    //         }
    //     }
    // }

    // const { Count } = await ddbClient.send(new ScanCommand(params));
    // const totalPages = Math.ceil(Count / PAGE_SIZE);

    // if (pageNumber > 1 && lastEvaluatedKey) {
    //     // If there is a LastEvaluatedKey and we're not on the first page, use it to continue pagination until we get to the requested page
    //     params.ExclusiveStartKey = lastEvaluatedKey;
    //     const { LastEvaluatedKey } = await ddbClient.send(new ScanCommand(params));
    //     return getItemsByPageNumber(user, pageNumber - 1, LastEvaluatedKey);
    // } else if (pageNumber === 1 && lastEvaluatedKey) {
    //     // If we're on the first page and there is a LastEvaluatedKey, discard it since we're starting fresh on page 1
    //     delete params.ExclusiveStartKey;
    // }

    // const itemsToSkip = (pageNumber - 1) * PAGE_SIZE;
    // params.Limit = PAGE_SIZE + itemsToSkip;
    // const command = new ScanCommand(params);
    // const { Items, LastEvaluatedKey } = await ddbClient.send(command);

    // // Do something with the retrieved items (e.g. log them)
    // console.log(Items.slice(itemsToSkip, itemsToSkip + PAGE_SIZE));

    // if (LastEvaluatedKey && pageNumber < totalPages) {
    //     // If there is a LastEvaluatedKey and we haven't reached the last page, recursively call the function to retrieve more items for the next page
    //     return getItemsByPageNumber(user, pageNumber + 1, LastEvaluatedKey);
    // }

    const params = {
        RequestItems: {
            "users": {
                Keys: emailList.map((email) => ({ "EMAIL": email })),
            }
        }
    };

    const { Responses } = await ddbClient.send(new BatchGetItemCommand(params));
    const items = Responses["users"];

    // Do something with the retrieved items (e.g. log them)
    console.log(items);

    return items;
}