import { handlerPath } from '../../utils';

export default {
    handler: `${handlerPath(__dirname)}/handler.main`,
    events: [
        {
            http: {
                method: 'post',
                path: 'products',
                responses: {
                    200: {
                        description: 'The response with the created Product.',
                        bodyType: 'Product'
                    },
                    400: {
                        description: 'Invalid body',
                        bodyType: 'ResponseMessage'
                    }
                },
                bodyType: 'ProductBody'
            }
        }
    ]
};
