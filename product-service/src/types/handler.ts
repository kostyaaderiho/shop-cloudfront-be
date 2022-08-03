import {
    APIGatewayProxyCallback,
    APIGatewayProxyResult,
    APIGatewayProxyEvent,
    Context
} from 'aws-lambda';

export type LambdaHandler<TBody extends { [name: string]: any } = {}> = (
    event: APIGatewayProxyEvent & {
        body: TBody;
        Records?: any[];
    },
    context?: Context,
    callback?: APIGatewayProxyCallback
) => Promise<APIGatewayProxyResult>;
