import middy from '@middy/core';
import jsonBodyParser from '@middy/http-json-body-parser';

import { makeRequest } from './makeRequest';
import { LambdaHandler } from '../types';

export const middyfy = (handler: LambdaHandler) =>
    middy(makeRequest(handler)).use(jsonBodyParser());
