import { parseCSVFile, CopyFile, DeleteFile } from '../../utils';
import { middyfy } from '../../libs';
import {
    PRODUCT_CSV_FILES_BUCKET_UPLOADED_FOLDER,
    PRODUCT_CSV_FILES_BUCKET_PARSED_FOLDER,
    CORS_HEADERS
} from '../../constants';

export const importFileParser = async (event: {
    Records: { s3: { bucket: { name: string }; object: { key: string } } }[];
}) => {
    for (const record of event.Records) {
        const PARAMS = {
            Bucket: record.s3.bucket.name,
            Key: decodeURIComponent(record.s3.object.key)
        };

        const records = await parseCSVFile(PARAMS);

        console.log('records', records);

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
