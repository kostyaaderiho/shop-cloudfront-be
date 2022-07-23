import { Pool } from 'pg';

import { DB_CONFIG, HttpCode } from '../../constants';
import { middyfy, HttpError } from '../../utils';
import { SCHEMA } from './constants';

export const createProduct = async (event) => {
    const { error } = SCHEMA.validate(event.body);

    if (error) {
        throw new HttpError(
            HttpCode.BAD_REQUEST,
            error.details.map((err) => err.message).join(',')
        );
    }

    const { title, description, price } = event.body;
    const pool = new Pool(DB_CONFIG);
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const result = await client.query(
            `INSERT INTO products (title, description, price) VALUES ($1, $2, $3) RETURNING *`,
            [title, description, price]
        );

        const { id } = result.rows[0];
        await client.query(
            `INSERT INTO stocks (product_id, counter) VALUES ($1, 1)`,
            [id]
        );

        await client.query('COMMIT');

        return {
            body: JSON.stringify(result.rows[0]),
            statusCode: HttpCode.OK
        };
    } catch (err) {
        await client.query('ROLLBACK');
    } finally {
        client.release();
    }
};

export const main = middyfy(createProduct);
