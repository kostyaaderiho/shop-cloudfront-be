import { Client } from 'pg';
import {
    APIGatewayProxyCallback,
    APIGatewayProxyResult,
    APIGatewayProxyEvent,
    Context
} from 'aws-lambda';

export type LambdaHandler<TBody extends { [name: string]: any } = {}> = (
    event: APIGatewayProxyEvent & {
        body: TBody;
    },
    context: Context,
    callback: APIGatewayProxyCallback,
    dbClient: Client
) => Promise<APIGatewayProxyResult>;
