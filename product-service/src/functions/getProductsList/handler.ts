import { productService } from '../../services';
import { LambdaHandler } from '../../types';
import { HttpCode } from '../../constants';
import { middyfy } from '../../utils';

export const getProductsList: LambdaHandler = async () => {
    const products = await productService.getAll();

    return {
        body: JSON.stringify(products),
        statusCode: HttpCode.OK
    };
};

export const main = middyfy(getProductsList);
