import { getProductsList as getProductsList_, GETAllSQL } from '../handler';
import { getOptionalParamsFunc, mockClient } from '../../../testUtils';
import { PRODUCTS } from '.././../../mocks';

const getProductsList = getOptionalParamsFunc(getProductsList_);

describe('getProductsList', () => {
    test('200 response status', async () => {
        const client = mockClient(PRODUCTS);

        const response = await getProductsList(null, null, null, client);

        expect(client.query).toHaveBeenCalledTimes(1);
        expect(client.query).toHaveBeenCalledWith(GETAllSQL);
        expect(response).toEqual({
            body: JSON.stringify(PRODUCTS),
            statusCode: 200
        });
    });
});
