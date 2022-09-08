import { getProductsList as getProductsList_ } from '../handler';
import { getOptionalParamsFunc } from '../../../testUtils';
import { productService } from '../../../services';
import { PRODUCTS } from '.././../../mocks';

const getProductsList = getOptionalParamsFunc(getProductsList_);

describe('getProductsList', () => {
    test('200 response status', async () => {
        productService.getAll = jest
            .fn()
            .mockImplementationOnce(() => PRODUCTS);

        const response = await getProductsList();

        expect(productService.getAll).toHaveBeenCalledTimes(1);
        expect(response).toEqual({
            body: JSON.stringify(PRODUCTS),
            statusCode: 200
        });
    });
});
