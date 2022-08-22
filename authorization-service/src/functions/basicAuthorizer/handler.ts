import { generateAuthPolicy, Auth } from '@utils/index';
import { middyfy } from '@libs/lambda';

const basicAuthorizer = async (event) => {
    const token = event.authorizationToken;

    if (!token) {
        return {
            message: 'Unauthorized',
            statusCode: 401
        };
    }

    try {
        const decodedToken = Auth.decodeToken(token.split(' ')[1]);
        const effect = Auth.isAuthorized(decodedToken) ? 'Allow' : 'Deny';

        return generateAuthPolicy(decodedToken, event.methodArn, effect);
    } catch (err) {
        return {
            message: err.message,
            statusCode: 401
        };
    }
};

export const main = middyfy(basicAuthorizer);
