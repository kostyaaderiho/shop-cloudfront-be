import type { ValidatedEventAPIGatewayProxyEvent } from '../../libs/api-gateway'
import { middyfy } from '../../libs/lambda'
import { ERROR_MESSAGES } from '../../constants'
import { CORS_HEADERS } from '../constants'
import { PRODUCTS } from '../../mocks'
import schema from './schema'

export const getProductsById: ValidatedEventAPIGatewayProxyEvent<
    typeof schema
> = async (event) => {
    const { productId } = event.pathParameters || {}
    const product = PRODUCTS.find((p) => p.id === productId)

    if (product) {
        return {
            headers: CORS_HEADERS,
            body: JSON.stringify(product),
            statusCode: 200
        }
    }

    return {
        headers: CORS_HEADERS,
        body: JSON.stringify({
            message: ERROR_MESSAGES.productNotFound
        }),
        statusCode: 404
    }
}

export const main = middyfy(getProductsById)
