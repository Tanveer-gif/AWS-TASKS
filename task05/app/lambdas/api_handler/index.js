const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TARGET_TABLE || "cmtr-6cb77e6d-Events-92rw"; // Use the actual table name

exports.handler = async (event) => {
    try {
        console.log("Received event:", JSON.stringify(event));

        // Ensure event.body is parsed correctly
        const requestBody = typeof event.body === "string" ? JSON.parse(event.body) : event.body;

        // Validate required fields
        if (!requestBody.principalId || !requestBody.content) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Missing required fields: principalId or content" })
            };
        }

        const newEvent = {
            id: uuidv4(),  // Generate a UUID
            principalId: requestBody.principalId,
            createdAt: new Date().toISOString(),  // Format as ISO 8601
            body: requestBody.content
        };

        // Save to DynamoDB
        await dynamodb.put({
            TableName: TABLE_NAME,
            Item: newEvent
        }).promise();

        // ✅ Ensure correct response format
        return {
            statusCode: 201,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ statusCode: 201, event: newEvent }) // Include statusCode inside body
        };

    } catch (error) {
        console.error("Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Error processing request", error: error.message })
        };
    }
};
