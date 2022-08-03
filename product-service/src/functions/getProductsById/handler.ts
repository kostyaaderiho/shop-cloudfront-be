import { HttpCode } from '../../constants';
import { middyfy, HttpError } from '../../utils';
import { LambdaHandler, Product } from '../../types';
import { productService } from '../../services';

export const getProductsById: LambdaHandler = async (event) => {
    const { productId } = event.pathParameters || {};

    try {
        let product: Product;

        if (productId) {
            product = await productService.getById(productId);
        }

        if (product) {
            return {
                body: JSON.stringify(product),
                statusCode: HttpCode.OK
            };
        }
    } catch (err) {
        throw new HttpError(
            HttpCode.NOT_FOUND,
            `The product with id = ${productId} was not found.`
        );
    }
};

export const main = middyfy(getProductsById);
