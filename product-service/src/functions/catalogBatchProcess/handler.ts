import { HttpCode, INVITE_MESSAGE } from '../../constants';
import { productService } from '../../services';
import { LambdaHandler } from '../../types';
import { middyfy, publishEvent } from '../../utils';

export const catalogBatchProcess: LambdaHandler = async (event) => {
    const products = event.Records.map(({ body }) => JSON.parse(body));

    for (const product of products) {
        try {
            const createdProduct = await productService.create(product);

            await publishEvent({
                MessageAttributes: {
                    price: {
                        DataType: 'Number',
                        StringValue: `${createdProduct.price}`
                    }
                },
                Message: JSON.stringify(createdProduct),
                TopicArn: process.env.SNS_ARN,
                Subject: INVITE_MESSAGE
            });
        } catch (err) {
            return {
                body: null,
                statusCode: HttpCode.SERVER_ERROR
            };
        }
    }
};

export const main = middyfy(catalogBatchProcess);
