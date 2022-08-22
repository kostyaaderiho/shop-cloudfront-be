export const generateAuthPolicy = (
    principalId: string,
    resource: string,
    effect: string = 'Allow'
) => ({
    principalId,
    policyDocument: {
        Version: '2012-10-17',
        Statement: [
            {
                Action: 'execute-api:Invoke',
                Effect: effect,
                Resource: resource
            }
        ]
    }
});
