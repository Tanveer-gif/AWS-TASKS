// exports.handler = async (event) => {
//     // TODO implement
//     const response = {
//         statusCode: 200,
//         body: JSON.stringify('Hello from Lambda!'),
//     };
//     return response;
// };

const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TARGET_TABLE || "Events";

exports.handler = async (event) => {
    try {
        const requestBody = JSON.parse(event.body);

        const newEvent = {
            id: uuidv4(),
            principalId: requestBody.principalId,
            createdAt: new Date().toISOString(),
            body: requestBody.content
        };

        await dynamodb.put({
            TableName: TABLE_NAME,
            Item: newEvent
        }).promise();

        return {
            statusCode: 201,
            body: JSON.stringify({ statusCode: 201, event: newEvent })
        };

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Error processing request", error: error.message })
        };
    }
};

