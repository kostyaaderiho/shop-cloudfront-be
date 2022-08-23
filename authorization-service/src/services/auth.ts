export class Auth {
    static decodeToken(token: string) {
        return Buffer.from(token, 'base64').toString('ascii');
    }

    static validateToken(token: string, name: string, password: string) {
        return token === `${name}:${password}`;
    }
}
