import { APIGatewayProxyEvent } from 'aws-lambda';

import { INVITE_MESSAGE } from '../../../constants';
import { publishEvent } from '../../../utils';
import { productService } from '../../../services';
import { catalogBatchProcess } from '../handler';
import { PRODUCTS } from '../../../mocks';

jest.mock('../../../utils');

describe('catalogBatchProcess', () => {
    test('200 status', async () => {
        const EVENT = {
            Records: PRODUCTS.slice(0, 1).map((p) => ({
                body: JSON.stringify(p)
            }))
        };
        const EXPECTED_PRODUCT = PRODUCTS[0];

        productService.create = jest
            .fn()
            .mockImplementation(() => Promise.resolve(EXPECTED_PRODUCT));

        await catalogBatchProcess(EVENT as unknown as APIGatewayProxyEvent);

        expect(productService.create).toHaveBeenCalledTimes(
            EVENT.Records.length
        );
        expect(productService.create).toHaveBeenCalledWith(EXPECTED_PRODUCT);

        expect(publishEvent).toHaveBeenCalledTimes(EVENT.Records.length);
        expect(publishEvent).toHaveBeenCalledWith({
            MessageAttributes: {
                price: {
                    DataType: 'Number',
                    StringValue: `${EXPECTED_PRODUCT.price}`
                }
            },
            Message: JSON.stringify(EXPECTED_PRODUCT),
            Subject: INVITE_MESSAGE,
            TopicArn: undefined
        });
    });
});
