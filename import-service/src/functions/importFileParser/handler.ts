import { middyfy } from '@libs/lambda';
import AWS from 'aws-sdk';
import csv from 'csv-parser';

import {
    PRODUCT_CSV_FILES_BUCKET_UPLOADED_FOLDER,
    PRODUCT_CSV_FILES_BUCKET_PARSED_FOLDER,
    PRODUCT_CSV_FILES_BUCKET_REGION,
    CORS_HEADERS
} from '../../constants';

export const importFileParser = async (event) => {
    const S3 = new AWS.S3({
        region: PRODUCT_CSV_FILES_BUCKET_REGION
    });

    let PARAMS;

    for (const record of event.Records) {
        PARAMS = {
            Bucket: record.s3.bucket.name,
            Key: record.s3.object.key
        };
    }

    const s3ObjectStream = S3.getObject(PARAMS).createReadStream();

    await new Promise((resolve, reject) => {
        let results = [];
        s3ObjectStream
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('error', (err) => reject(err))
            .on('end', () => {
                console.log(results);
                resolve(results);
            });
    });

    await S3.copyObject({
        CopySource: PARAMS.Bucket + '/' + PARAMS.Key,
        Key: PARAMS.Key.replace(
            PRODUCT_CSV_FILES_BUCKET_UPLOADED_FOLDER,
            PRODUCT_CSV_FILES_BUCKET_PARSED_FOLDER
        ),
        Bucket: PARAMS.Bucket
    }).promise();

    await S3.deleteObject({
        Bucket: PARAMS.Bucket,
        Key: PARAMS.Key
    }).promise();

    return {
        statusCode: 202,
        headers: CORS_HEADERS
    };
};

export const main = middyfy(importFileParser);
