import { handlerPath } from '@libs/handler-resolver';

import { PRODUCT_CSV_FILES_BUCKET } from '../../constants';

export default {
    handler: `${handlerPath(__dirname)}/handler.main`,
    events: [
        {
            s3: {
                bucket: PRODUCT_CSV_FILES_BUCKET,
                event: 's3:ObjectCreated:*',
                rules: [
                    {
                        prefix: 'uploaded'
                    }
                ],
                existing: true
            }
        }
    ]
};
