import { ERROR_MESSAGES } from '../../constants';
import { logger, middyfy } from '../../utils';

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
                statusCode: 200
            };
        } else {
            return {
                body: JSON.stringify({
                    message: ERROR_MESSAGES.productNotFound
                }),
                statusCode: 404
            };
        }
    } catch (err) {
        logger.error(err);
    }
};

export const main = middyfy(getProductsById);
