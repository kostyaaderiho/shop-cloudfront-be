import { APIGatewayProxyEvent } from 'aws-lambda';

import { getProductsById as getProductsById_ } from '../handler';
import { getOptionalParamsFunc } from '../../../testUtils';
import { productService } from '../../../services';
import { HttpCode } from '../../../constants';
import { PRODUCTS } from '.././../../mocks';

const getProductsById = getOptionalParamsFunc(getProductsById_);

jest.mock('../../../services/product');

describe('getProductsById', () => {
    test('200 status response', async () => {
        const EVENT: Partial<APIGatewayProxyEvent> = {
            pathParameters: {
                productId: PRODUCTS[0].id
            }
        };

        productService.getById = jest
            .fn()
            .mockImplementationOnce(() => PRODUCTS[0]);

        const response = await getProductsById(EVENT);

        expect(productService.getById).toHaveBeenCalledTimes(1);
        expect(response).toEqual({
            body: JSON.stringify(PRODUCTS[0]),
            statusCode: HttpCode.OK
        });
    });
});
