import AWS from 'aws-sdk';
import csv from 'csv-parser';

import { middyfy } from '../../libs';
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
    const SQS = new AWS.SQS({ region: 'eu-west-1' });

    const SQS_PARAMS = {
        QueueName: 'catalogItemsQueue'
    };
    let PARAMS;

    for (const record of event.Records) {
        PARAMS = {
            Bucket: record.s3.bucket.name,
            Key: decodeURIComponent(record.s3.object.key)
        };
    }

    let QueueUrl: string;

    await new Promise((resolve) => {
        SQS.getQueueUrl(SQS_PARAMS, (err, data) => {
            if (err) {
                console.log('err', err);
            } else {
                resolve(data.QueueUrl);
                QueueUrl = data.QueueUrl;
            }
        });
    });

    console.log('QueueUrl', QueueUrl);

    const s3ObjectStream = S3.getObject(PARAMS).createReadStream();

    await new Promise((resolve, reject) => {
        s3ObjectStream
            .pipe(csv())
            .on('data', (record) => {
                SQS.sendMessage(
                    {
                        QueueUrl,
                        MessageBody: JSON.stringify(record)
                    },
                    (err, data) => {
                        if (err) {
                            console.log('err', err);
                        } else {
                            console.log('Send message for:', [data]);
                        }
                    }
                );
            })
            .on('error', (err) => reject(err))
            .on('end', () => console.log('Parse CSV end.'));
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
