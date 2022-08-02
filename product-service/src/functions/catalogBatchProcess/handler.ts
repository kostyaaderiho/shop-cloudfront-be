import { Pool } from 'pg';
import AWS from 'aws-sdk';

import { DB_CONFIG, HttpCode } from '../../constants';
import { middyfy } from '../../utils';
import { LambdaHandler } from '../../types';

export const catalogBatchProcess: LambdaHandler<{}> = async (
    event,
    _context,
    _callback
) => {
    const SNS = new AWS.SNS({ region: 'eu-west-1' });

    // @ts-ignore
    const products = event.Records.map(({ body }) => JSON.parse(body));

    for (const product of products) {
        const { title, description, price, count } = product;
        const pool = new Pool(DB_CONFIG);
        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            const result = await client.query(
                `INSERT INTO products (title, description, price) VALUES ($1, $2, $3) RETURNING *`,
                [title, description, +price]
            );

            console.log('result', result);

            const { id } = result.rows[0];
            await client.query(
                `INSERT INTO stocks (product_id, counter) VALUES ($1, $2)`,
                [id, +count]
            );

            await client.query('COMMIT');

            const params = {
                Subject: 'You are invited processed',
                Message: JSON.stringify(result.rows[0]),
                TopicArn: process.env.SNS_ARN
            };

            await SNS.publish(params).promise();

            return {
                body: JSON.stringify(result.rows[0]),
                statusCode: HttpCode.OK
            };
        } catch (err) {
            console.log('err', err);
            await client.query('ROLLBACK');
        } finally {
            client.release();
        }
    }

    return {
        statusCode: 200,
        body: 'OK'
    };
};

export const main = middyfy(catalogBatchProcess);
