import { handlerPath } from '@libs/handler-resolver';

export default {
    handler: `${handlerPath(__dirname)}/handler.main`,
    events: [
        {
            http: {
                method: 'get',
                path: 'import',
                request: {
                    parameters: {
                        querystrings: {
                            name: true
                        }
                    }
                },
                authorizer: {
                    arn: 'arn:aws:lambda:eu-west-1:976530182962:function:authorization-service-dev-basicAuthorizer',
                    type: 'token'
                },
                cors: {
                    origin: '*',
                    headers: [
                        'X-Amz-Security-Token',
                        'X-Amz-Security-Token',
                        'X-Amz-User-Agent',
                        'Authorization',
                        'Content-Type',
                        'X-Amz-Date',
                        'X-Api-Key'
                    ],
                    allowCredentials: true
                }
            }
        }
    ]
};
