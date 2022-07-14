import { getProductsList as getProductsList_ } from '../handler'
import { PRODUCTS } from '.././../../mocks'
import { CORS_HEADERS } from '../../constants'
import { getOptionalParamsFunc } from '../../../testUtils/lambda'

const getProductsList = getOptionalParamsFunc(getProductsList_)

describe('getProductsList', () => {
    test('200 status', async () => {
        const response = await getProductsList()

        expect(response).toEqual({
            headers: CORS_HEADERS,
            body: JSON.stringify(PRODUCTS),
            statusCode: 200
        })
    })
})
