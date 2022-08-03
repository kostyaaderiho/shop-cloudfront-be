import AWS from 'aws-sdk';

import { PRODUCT_CSV_FILES_BUCKET_REGION } from '../constants';

export const CopyFile = ({
    region = PRODUCT_CSV_FILES_BUCKET_REGION,
    params,
    from,
    to
}: {
    region?: string;
    params: {
        Bucket: string;
        Key: string;
    };
    from: string;
    to: string;
}) => {
    const S3 = new AWS.S3({
        region
    });

    return S3.copyObject({
        CopySource: params.Bucket + '/' + params.Key,
        Key: params.Key.replace(from, to),
        Bucket: params.Bucket
    }).promise();
};

export const DeleteFile = ({
    region = PRODUCT_CSV_FILES_BUCKET_REGION,
    params
}: {
    region?: string;
    params: {
        Bucket: string;
        Key: string;
    };
}) => {
    const S3 = new AWS.S3({
        region
    });

    return S3.deleteObject({
        Bucket: params.Bucket,
        Key: params.Key
    }).promise();
};
