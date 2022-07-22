import { Client } from 'pg';
import middy from '@middy/core';
import jsonBodyParser from '@middy/http-json-body-parser';
import validator from '@middy/validator';
import httpErrorHandler from '@middy/http-error-handler';

import { CORS_HEADERS } from '../constants';
import { DB_CONFIG } from '../constants';
import { logger } from '../utils';

export const makeRequest = (handler) => async (event) => {
    logger.info('EVENT: \n' + JSON.stringify(event, null, 2));

    const client = new Client(DB_CONFIG);

    try {
        await client.connect();
    } catch (err) {
        logger.error(err);
    }

    try {
        const result = await handler(event, client);

        return {
            ...result,
            headers: {
                ...result.headers,
                ...CORS_HEADERS
            }
        };
    } catch (err) {
        logger.error(err);
    } finally {
        client.end();
    }
};

export const middyfy = (handler, eventSchema = {}) =>
    middy(makeRequest(handler))
        .use(jsonBodyParser())
        .use(validator({ eventSchema }))
        .use(httpErrorHandler());
