import { APIGatewayProxyEvent } from 'aws-lambda';
import AWS from 'aws-sdk';

import { productService } from '../../../services';
import { catalogBatchProcess } from '../handler';
import { PRODUCTS } from '../../../mocks';

describe('catalogBatchProcess', () => {
    test('200 status', () => {
        const EVENT = {
            Records: PRODUCTS.map((p) => ({ body: JSON.stringify(p) }))
        } as unknown as APIGatewayProxyEvent;

        const publish = jest.fn(() => ({
            promise: () => Promise.resolve()
        }));

        AWS.SNS = jest.fn().mockImplementation(() => ({
            publish
        })) as unknown as typeof AWS.SNS;

        productService.create = jest
            .fn()
            .mockImplementation(() => Promise.resolve(PRODUCTS[0]));

        catalogBatchProcess(EVENT);

        expect(productService.create).toHaveBeenCalledTimes(1);
        expect(productService.create).toHaveBeenCalledWith(PRODUCTS[0]);
    });
});
