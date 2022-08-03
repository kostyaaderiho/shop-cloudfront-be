import AWS from 'aws-sdk';

import { HttpCode, INVITE_MESSAGE } from '../../constants';
import { productService } from '../../services';
import { LambdaHandler } from '../../types';
import { middyfy } from '../../utils';

export const catalogBatchProcess: LambdaHandler = async (event) => {
    const SNS = new AWS.SNS({ region: 'eu-west-1' });

    const products = event.Records.map(({ body }) => JSON.parse(body));

    for (const p of products) {
        const product = await productService.create(p);

        await SNS.publish({
            MessageAttributes: {
                price: {
                    DataType: 'Number',
                    StringValue: `${product.price}`
                }
            },
            Message: JSON.stringify(product),
            TopicArn: process.env.SNS_ARN,
            Subject: INVITE_MESSAGE
        }).promise();

        return {
            body: JSON.stringify(product),
            statusCode: HttpCode.OK
        };
    }

    return {
        statusCode: HttpCode.OK,
        body: null
    };
};

export const main = middyfy(catalogBatchProcess);
