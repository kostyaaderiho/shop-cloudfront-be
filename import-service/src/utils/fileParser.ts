import csv from 'csv-parser';
import AWS from 'aws-sdk';

import { PRODUCT_CSV_FILES_BUCKET_REGION } from '../constants';

export const parseCSVFile = async (
    params: {
        Bucket: string;
        Key: string;
    },
    region = PRODUCT_CSV_FILES_BUCKET_REGION
): Promise<[]> => {
    const S3 = new AWS.S3({
        region
    });

    const records = await new Promise((resolve, reject) => {
        let data = [];

        S3.getObject(params)
            .createReadStream()
            .pipe(csv())
            .on('data', (record) => data.push(record))
            .on('error', (err) => reject(err))
            .on('end', () => resolve(data));
    });

    return records;
};
