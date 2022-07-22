import { Pool } from 'pg';

import { EVENT_REQUEST_SCHEMA } from './constants';
import { logger, middyfy } from '../../utils';
import { DB_CONFIG } from '../../constants';

const createProduct = async (event) => {
    const pool = new Pool(DB_CONFIG);
    const client = await pool.connect();

    const body = event.body || {};
    const { title, description, price } = body;

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
            statusCode: 200
        };
    } catch (err) {
        await client.query('ROLLBACK');
        logger.error(err);
    } finally {
        client.release();
    }
};

export const main = middyfy(createProduct, EVENT_REQUEST_SCHEMA);
