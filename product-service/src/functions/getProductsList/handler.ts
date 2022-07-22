import { logger, middyfy } from '../../utils';

export const getProductsList = async (_event, client) => {
    try {
        const result = await client.query(`SELECT * FROM products;`);
        return {
            body: JSON.stringify(result.rows),
            statusCode: 200
        };
    } catch (err) {
        logger.error(err);
    }
};

export const main = middyfy(getProductsList);
