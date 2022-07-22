import { getProductsById as getProductsById_ } from '../handler';
import { PRODUCTS } from '.././../../mocks';
import { ERROR_MESSAGES } from '../../../constants';
import { getOptionalParamsFunc } from '../../../testUtils/lambda';

const getProductsById = getOptionalParamsFunc(getProductsById_);

describe('getProductsById', () => {
    test('200 status', async () => {
        const response = await getProductsById({
            pathParameters: {
                productId: PRODUCTS[0].id
            }
        });

        expect(response).toEqual({
            body: JSON.stringify(PRODUCTS[0]),
            statusCode: 200
        });
    });

    test('404 status', async () => {
        const response = await getProductsById({
            pathParameters: {
                productId: '1-2-3-4-5'
            }
        });
        expect(response).toEqual({
            body: JSON.stringify({
                message: ERROR_MESSAGES.productNotFound
            }),
            statusCode: 404
        });
    });
});
