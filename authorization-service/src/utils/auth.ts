export class Auth {
    static decodeToken(token: string) {
        return Buffer.from(token, 'base64').toString('ascii');
    }

    static isAuthorized(token: string) {
        return (
            token === `${process.env.USER_NAME}:${process.env.USER_PASSWORD}`
        );
    }
}
