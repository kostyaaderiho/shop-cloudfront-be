export const EVENT_REQUEST_SCHEMA = {
    type: 'object',
    properties: {
        body: {
            type: 'object',
            properties: {
                title: {
                    type: 'string'
                },
                description: {
                    type: 'string'
                },
                price: {
                    type: 'integer'
                }
            },
            required: ['title', 'description', 'price']
        }
    }
};
