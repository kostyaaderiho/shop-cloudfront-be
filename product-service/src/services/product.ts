import { Pool, Client } from 'pg';

import { DB_CONFIG } from '../constants';
import { Product } from '../types';

export const GETProductByIDSQL = `
    SELECT p.id, p.title, p.description, p.price, s.counter
    FROM products p
    INNER JOIN stocks s on p.id = s.product_id
    WHERE p.id = $1;
`;

export const GETAllSQL = `
    SELECT p.id, p.title, p.description, p.price, s.counter
    FROM products p
    INNER JOIN stocks s ON p.id = s.product_id;
`;

class ProductService<T extends Product> {
    async create(product: Product): Promise<Product> {
        const pool = new Pool(DB_CONFIG);
        const client = await pool.connect();

        try {
            const { title, description, price, count } = product;

            await client.query('BEGIN');

            const result = await client.query(
                `INSERT INTO products (title, description, price) VALUES ($1, $2, $3) RETURNING *`,
                [title, description, +price]
            );

            const { id } = result.rows[0];
            await client.query(
                `INSERT INTO stocks (product_id, counter) VALUES ($1, $2)`,
                [id, +count]
            );

            await client.query('COMMIT');

            return result.rows[0];
        } catch (err) {
            console.log('err', err);
            await client.query('ROLLBACK');
        } finally {
            client.release();
        }
    }

    async getById(id: Product['id']): Promise<T> {
        const client = new Client(DB_CONFIG);
        let product: T;

        try {
            await client.connect();

            const result = await client.query(GETProductByIDSQL, [id]);

            product = result.rows[0];
        } finally {
            client.end();
        }

        return product;
    }

    async getAll(): Promise<T[]> {
        const client = new Client(DB_CONFIG);
        let result;

        try {
            await client.connect();

            result = await client.query(GETAllSQL);
        } finally {
            client.end();
        }

        return result.rows;
    }
}

export const productService = new ProductService();
