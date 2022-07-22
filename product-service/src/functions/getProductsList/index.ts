import { handlerPath } from '../../utils';

export default {
    handler: `${handlerPath(__dirname)}/handler.main`,
    events: [
        {
            http: {
                method: 'get',
                path: 'products',
                responses: {
                    200: {
                        description: 'The response with an array of Products.',
                        bodyType: 'Products'
                    }
                }
            }
        }
    ]
};
