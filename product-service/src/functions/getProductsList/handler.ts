import { HttpCode } from '../../constants';
import { middyfy } from '../../utils';
import { LambdaHandler } from '../../types';

export const GETAllSQL = 'SELECT * FROM products;';

export const getProductsList: LambdaHandler = async (
    _event,
    _context,
    _callback,
    client
) => {
    const result = await client.query(GETAllSQL);

    return {
        body: JSON.stringify(result.rows),
        statusCode: HttpCode.OK
    };
};

export const main = middyfy(getProductsList);
