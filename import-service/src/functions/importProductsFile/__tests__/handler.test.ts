import AWS from 'aws-sdk';

import {
    PRODUCT_CSV_FILES_BUCKET_UPLOADED_FOLDER,
    PRODUCT_CSV_FILES_BUCKET,
    CORS_HEADERS
} from '../../../constants';
import { importProductsFile } from '../handler';

describe('importProductsFile', () => {
    test('200 response', async () => {
        const MOCK_SIGNED_URL = 'signed-url';
        const EVENT = {
            queryStringParameters: { name: 'my-test-file.csv' }
        };

        const getSignedUrl = jest.fn(() => MOCK_SIGNED_URL);

        AWS.S3 = jest.fn().mockImplementationOnce(() => ({
            getSignedUrl
        })) as unknown as typeof AWS.S3;

        const response = await importProductsFile(EVENT);

        expect(response).toEqual({
            body: JSON.stringify(MOCK_SIGNED_URL),
            headers: CORS_HEADERS,
            statusCode: 200
        });

        expect(getSignedUrl).toHaveBeenCalledWith('putObject', {
            Key: `${PRODUCT_CSV_FILES_BUCKET_UPLOADED_FOLDER}/${EVENT.queryStringParameters.name}`,
            Bucket: PRODUCT_CSV_FILES_BUCKET,
            ContentType: 'text/csv',
            Expires: 60
        });
    });
});
