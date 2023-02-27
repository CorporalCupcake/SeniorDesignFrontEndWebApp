import { DynamoDBClient, PutItemCommand, GetItemCommand, QueryCommand} from "@aws-sdk/client-dynamodb";

// Create the Dynamo DB Client with the region and user access keys. There is also a shared config file with the keys stores in ~/.aws/config*
const ddbClient = new DynamoDBClient({  
    credentials: {
        accessKeyId: 'AKIAWTJZLRJS6FXG2ZMH',
        secretAccessKey: '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',
    },
    region: 'us-east-1' 
});

  
export const putItem = async (TableName, Item) => {
    try {
        const data = await ddbClient.send(new PutItemCommand({TableName, Item}));
        console.log(data);
    } catch (err) {
        console.error(err);
    }
};

// export const getUserByEmail = async ({ email }) => {
//     const param = {
//         TableName: 'users',
//         Key: {
//             'EMAIL': { S: email },
//         }
//     }

//     try {
//         const data = await ddbClient.send(new GetItemCommand(param));
//         const user = data.Item
//         console.log(user);
//         return user;
//     } catch (err) {
//         console.error(err);
//     }
// };

export const getUserByEmailAndPassword = async ({ email, password }) => {
    const params = {
        KeyConditionExpression: 'EMAIL = :email', // This is finding by the partition key
        FilterExpression: "PASSWORD = :password", // This is an additional filter expression
        ExpressionAttributeValues: {
          ':email' : { S: email },
          ':password': { S: password }
        },
        ProjectionExpression: "EMAIL, PASSWORD, BAND, FULL_NAME", // OPTIONAL | Fields to return
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