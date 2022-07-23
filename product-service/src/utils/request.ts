import { Client } from 'pg';
import { APIGatewayProxyEvent } from 'aws-lambda';

import { CORS_HEADERS, DB_CONFIG, HttpCode } from '../constants';
import { logger } from '.';

export const makeRequest = (handler) => async (event: APIGatewayProxyEvent) => {
    logger.info('EVENT: \n' + JSON.stringify(event, null, 2));

    const client = new Client(DB_CONFIG);

    try {
        await client.connect();

        const result = await handler(event, client);

        return {
            ...result,
            headers: {
                ...result.headers,
                ...CORS_HEADERS
            }
        };
    } catch (err) {
        return {
            body: JSON.stringify({
                message: err.message
            }),
            headers: CORS_HEADERS,
            statusCode: err.statusCode || HttpCode.SERVER_ERROR
        };
    } finally {
        client.end();
    }
};
