import AWS from 'aws-sdk';

import { parseCSVFile, CopyFile, DeleteFile } from '../../utils';
import { middyfy } from '../../libs';
import {
    PRODUCT_CSV_FILES_BUCKET_UPLOADED_FOLDER,
    PRODUCT_CSV_FILES_BUCKET_PARSED_FOLDER,
    PRODUCT_CSV_FILES_BUCKET_REGION,
    CORS_HEADERS
} from '../../constants';

export const importFileParser = async (event: {
    Records: { s3: { bucket: { name: string }; object: { key: string } } }[];
}) => {
    const SQS = new AWS.SQS({ region: PRODUCT_CSV_FILES_BUCKET_REGION });
    const SQS_PARAMS = {
        QueueName: process.env.QueueName
    };

    for (const record of event.Records) {
        const PARAMS = {
            Bucket: record.s3.bucket.name,
            Key: decodeURIComponent(record.s3.object.key)
        };
        const QUEUE_URL: string = await new Promise((resolve) => {
            SQS.getQueueUrl(SQS_PARAMS, (err, data) => {
                if (err) {
                    console.log('err', err);
                } else {
                    resolve(data.QueueUrl);
                }
            });
        });

        const records = await parseCSVFile(PARAMS);

        records.forEach((fileRecord) => {
            SQS.sendMessage(
                {
                    QueueUrl: QUEUE_URL,
                    MessageBody: JSON.stringify(fileRecord)
                },
                (err, data) => {
                    if (err) {
                        console.log('err', err);
                    } else {
                        console.log('Send message for: ', [data]);
                    }
                }
            );
        });

        const copiedFile = await CopyFile({
            from: PRODUCT_CSV_FILES_BUCKET_UPLOADED_FOLDER,
            to: PRODUCT_CSV_FILES_BUCKET_PARSED_FOLDER,
            params: PARAMS
        });

        if (copiedFile) {
            await DeleteFile({ params: PARAMS });
        }
    }

    return {
        statusCode: 202,
        headers: CORS_HEADERS
    };
};

export const main = middyfy(importFileParser);
