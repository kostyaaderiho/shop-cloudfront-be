import { LambdaHandler, ProductBody } from '../../types';
import { productService } from '../../services';
import { middyfy, HttpError } from '../../utils';
import { HttpCode } from '../../constants';
import { SCHEMA } from './constants';

export const createProduct: LambdaHandler<ProductBody> = async (event) => {
    const { error } = SCHEMA.validate(event.body);

    if (error) {
        throw new HttpError(
            HttpCode.BAD_REQUEST,
            error.details.map((err) => err.message).join(',')
        );
    }

    // @ts-ignore
    const result = await productService.create(event.body);

    return {
        body: JSON.stringify(result),
        statusCode: HttpCode.OK
    };
};

export const main = middyfy(createProduct);
