import { Client } from 'pg';
import {
    APIGatewayProxyCallback,
    APIGatewayProxyEvent,
    Context
} from 'aws-lambda';

import { CORS_HEADERS, DB_CONFIG, HttpCode } from '../constants';
import { LambdaHandler } from '../types';
import { logger } from '.';

export const makeRequest =
    (handler: LambdaHandler) =>
    async (
        event: APIGatewayProxyEvent,
        context: Context,
        callback: APIGatewayProxyCallback
    ) => {
        logger.info('EVENT: \n' + JSON.stringify(event, null, 2));

        const client = new Client(DB_CONFIG);

        try {
            await client.connect();

            const result = await handler(event, context, callback, client);

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