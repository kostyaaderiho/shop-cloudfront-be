import type { AWS } from '@serverless/typescript';

import {
    getProductsList,
    getProductsById,
    createProduct
} from './src/functions';

const serverlessConfiguration: AWS = {
    service: 'product-service',
    frameworkVersion: '3',
    plugins: [
        'serverless-auto-swagger',
        'serverless-offline',
        'serverless-webpack'
    ],
    provider: {
        name: 'aws',
        runtime: 'nodejs14.x',
        stage: 'dev',
        region: 'eu-west-1',
        apiGateway: {
            minimumCompressionSize: 1024,
            shouldStartNameWithService: true
        },
        environment: {
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
            NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
            PG_HOST:
                'rds-cloudx-database.co8groe4sq5b.eu-west-1.rds.amazonaws.com',
            PG_PORT: '5432',
            PG_DATABASE: 'cloudx',
            PG_USERNAME: 'postgres',
            PG_PASSWORD: '$aderiho280993'
        }
    },
    functions: {
        getProductsList,
        getProductsById,
        createProduct
    },
    package: { individually: true },
    custom: {
        autoswagger: {
            typefiles: ['./src/types/messages.ts', './src/types/product.ts']
        },
        webpack: {
            webpackConfig: 'webpack.config.js',
            includeModules: true,
            packager: 'npm',
            excludeFiles: 'src/**/*.test.ts'
        }
    }
};

module.exports = serverlessConfiguration;
