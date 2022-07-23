import { HttpCode } from '../../constants';
import { middyfy } from '../../utils';

export const getProductsList = async (_event, client) => {
    const result = await client.query(`SELECT * FROM products;`);

    return {
        body: JSON.stringify(result.rows),
        statusCode: HttpCode.OK
    };
};

export const main = middyfy(getProductsList);
