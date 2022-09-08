import { HttpCode } from '../../constants';
import { middyfy } from '../../utils';
import { LambdaHandler } from '../../types';

export const GETAllSQL = `
    SELECT p.id, p.title, p.description, p.price, s.counter
    FROM products p
    INNER JOIN stocks s ON p.id = s.product_id;
`;

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
