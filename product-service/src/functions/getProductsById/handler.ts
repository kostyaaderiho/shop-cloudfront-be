import { HttpCode } from '../../constants';
import { middyfy, HttpError } from '../../utils';

export const getProductsById = async (event, client) => {
    const { productId } = event.pathParameters || {};

    try {
        let result;

        if (productId) {
            result = await client.query(
                `SELECT p.id, p.title, p.description, p.price, s.counter
                FROM products p
                INNER JOIN stocks s on p.id = s.product_id
                WHERE p.id = $1;`,
                [productId]
            );
        }

        if (result.rows[0]) {
            return {
                body: JSON.stringify(result.rows[0]),
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
