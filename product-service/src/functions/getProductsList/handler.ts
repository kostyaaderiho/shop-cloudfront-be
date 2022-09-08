import type { ValidatedEventAPIGatewayProxyEvent } from '../../libs/api-gateway'
import { middyfy } from '../../libs/lambda'
import { CORS_HEADERS } from '../constants'
import { PRODUCTS } from '../../mocks'
import schema from './schema'

export const getProductsList: ValidatedEventAPIGatewayProxyEvent<
    typeof schema
> = async () => ({
    headers: CORS_HEADERS,
    body: JSON.stringify(PRODUCTS),
    statusCode: 200
})

export const main = middyfy(getProductsList)
