import AWS from 'aws-sdk';

export const publishEvent = (params, region = 'eu-west-1') => {
    const SNS = new AWS.SNS({ region });
    return SNS.publish(params).promise();
};
