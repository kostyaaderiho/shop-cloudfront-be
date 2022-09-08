import { handlerPath } from '../../utils';

export default {
    handler: `${handlerPath(__dirname)}/handler.main`,
    events: [
        {
            http: {
                method: 'get',
                path: 'products/{productId}',
                request: {
                    parameters: {
                        paths: {
                            productId: true
                        }
                    }
                },
                responses: {
                    200: {
                        description: 'The response with the Product.',
                        bodyType: 'Product'
                    },
                    404: {
                        description: 'Not found Product response.',
                        bodyType: 'ResponseMessage'
                    }
                }
            }
        }
    ]
};
