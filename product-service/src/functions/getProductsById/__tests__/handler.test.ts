import { APIGatewayProxyEvent } from 'aws-lambda';

import {
    getProductsById as getProductsById_,
    GETProductByIDSQL
} from '../handler';
import { getOptionalParamsFunc, mockClient } from '../../../testUtils';
import { PRODUCTS } from '.././../../mocks';

const getProductsById = getOptionalParamsFunc(getProductsById_);

describe('getProductsById', () => {
    test('200 status response', async () => {
        const EVENT: Partial<APIGatewayProxyEvent> = {
            pathParameters: {
                productId: PRODUCTS[0].id
            }
        };

        const client = mockClient([PRODUCTS[0]]);

        const response = await getProductsById(EVENT, null, null, client);

        expect(client.query).toHaveBeenCalledTimes(1);
        expect(client.query).toHaveBeenCalledWith(GETProductByIDSQL, [
            EVENT.pathParameters.productId
        ]);
        expect(response).toEqual({
            body: JSON.stringify(PRODUCTS[0]),
            statusCode: 200
        });
    });
});
