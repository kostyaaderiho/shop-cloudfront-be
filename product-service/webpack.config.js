const path = require('path');
const slsw = require('serverless-webpack');
const { IgnorePlugin } = require('webpack');

module.exports = {
    mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
    entry: slsw.lib.entries,
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    target: 'node',
    module: {
        rules: [
            {
                test: /\.(tsx?)$/,
                loader: 'ts-loader',
                exclude: [
                    [
                        path.resolve(__dirname, 'node_modules'),
                        path.resolve(__dirname, '.serverless'),
                        path.resolve(__dirname, '.webpack'),
                        path.resolve(__dirname, 'swagger')
                    ]
                ]
            }
        ]
    },
    plugins: [
        new IgnorePlugin({
            resourceRegExp: /^pg-native$/
        })
    ]
};
