import type { AWS } from '@serverless/typescript';

import {
    catalogBatchProcess,
    getProductsList,
    getProductsById,
    createProduct
} from './src/functions';

const serverlessConfiguration: AWS = {
    service: 'product-service',
    frameworkVersion: '3',
    useDotenv: true,
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
            PG_HOST: '${env:PG_HOST}',
            PG_DATABASE: '${env:PG_DATABASE}',
            PG_PORT: '5432',
            PG_USERNAME: '${env:PG_USERNAME}',
            PG_PASSWORD: '${env:PG_PASSWORD}',
            SQS_URL: {
                Ref: 'SQSQueue'
            },
            SNS_ARN: {
                Ref: 'SNSTopic'
            }
        },
        iamRoleStatements: [
            {
                Effect: 'Allow',
                Action: 'sqs:*',
                Resource: [
                    {
                        'Fn::GetAtt': ['SQSQueue', 'Arn']
                    }
                ]
            },
            {
                Effect: 'Allow',
                Action: 'sns:*',
                Resource: {
                    Ref: 'SNSTopic'
                }
            }
        ]
    },
    resources: {
        Resources: {
            SQSQueue: {
                Type: 'AWS::SQS::Queue',
                Properties: {
                    QueueName: 'catalogItemsQueue'
                }
            },
            SNSTopic: {
                Type: 'AWS::SNS::Topic',
                Properties: {
                    TopicName: 'createProductTopic'
                }
            },
            SNSSubscription: {
                Type: 'AWS::SNS::Subscription',
                Properties: {
                    Endpoint: 'kanstantsin_adzerykha@epam.com',
                    Protocol: 'email',
                    TopicArn: {
                        Ref: 'SNSTopic'
                    }
                }
            }
        }
    },
    functions: {
        catalogBatchProcess,
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
