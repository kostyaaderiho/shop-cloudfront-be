import { HttpCode } from '../constants';

export class HttpError extends Error {
    constructor(public readonly statusCode: HttpCode, message: string) {
        super(message);
    }
}
