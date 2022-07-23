import middy from '@middy/core';
import jsonBodyParser from '@middy/http-json-body-parser';

import { makeRequest } from './request';

export const middyfy = (handler) =>
    middy(makeRequest(handler)).use(jsonBodyParser());
