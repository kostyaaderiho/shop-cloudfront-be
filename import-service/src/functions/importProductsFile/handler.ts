import AWS from 'aws-sdk';

import { middyfy } from '../../libs';
import {
    PRODUCT_CSV_FILES_BUCKET_UPLOADED_FOLDER,
    PRODUCT_CSV_FILES_BUCKET_REGION,
    PRODUCT_CSV_FILES_BUCKET,
    CORS_HEADERS
} from '../../constants';

export const importProductsFile = async (event) => {
    const { name } = event.queryStringParameters || {};

    const CATALOG_PATH = `${PRODUCT_CSV_FILES_BUCKET_UPLOADED_FOLDER}/${decodeURIComponent(
        name
    )}`;
    const S3 = new AWS.S3({ region: PRODUCT_CSV_FILES_BUCKET_REGION });
    const BUCKET = PRODUCT_CSV_FILES_BUCKET;
    const BUCKET_PARAMS = {
        ContentType: 'text/csv',
        Key: CATALOG_PATH,
        Bucket: BUCKET,
        Expires: 60
    };

    try {
        const url = S3.getSignedUrl('putObject', BUCKET_PARAMS);

        return {
            body: JSON.stringify(url),
            headers: CORS_HEADERS,
            statusCode: 200
        };
    } catch (e) {
        return {
            body: JSON.stringify(e),
            headers: CORS_HEADERS,
            statusCode: 500
        };
    }
};

export const main = middyfy(importProductsFile);
