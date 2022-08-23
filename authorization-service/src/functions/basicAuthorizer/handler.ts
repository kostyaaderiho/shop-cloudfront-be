import { APIGatewayTokenAuthorizerEvent } from 'aws-lambda';
import { generateAuthPolicy } from '@utils/auth';
import { middyfy } from '@libs/lambda';
import { Auth } from '@services/auth';

const basicAuthorizer = async (event: APIGatewayTokenAuthorizerEvent) => {
    const token = event.authorizationToken;

    if (!token) {
        return {
            message: 'Unauthorized',
            statusCode: 401
        };
    }

    try {
        const decodedToken = Auth.decodeToken(token.split(' ')[1]);
        const effect = Auth.validateToken(
            decodedToken,
            process.env.USER_NAME,
            process.env.USER_PASSWORD
        )
            ? 'Allow'
            : 'Deny';

        return generateAuthPolicy(decodedToken, event.methodArn, effect);
    } catch (err) {
        return {
            message: err.message,
            statusCode: 401
        };
    }
};

export const main = middyfy(basicAuthorizer);
