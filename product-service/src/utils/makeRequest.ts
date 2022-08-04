import {
    APIGatewayProxyCallback,
    APIGatewayProxyEvent,
    Context
} from 'aws-lambda';

import { CORS_HEADERS, HttpCode } from '../constants';
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

        try {
            const result = await handler(event, context, callback);

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
        }
    };
