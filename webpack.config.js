const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, './'),
        filename: 'bundle.js',
        publicPath: './'
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true,
                        presets: [
                            ['@babel/preset-env', { targets: "defaults" }],
                            ['@babel/preset-react', { runtime: 'automatic' }]
                        ]
                    }
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader', 'postcss-loader']
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json']
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'src/index.html')
        })
    ],
    devServer: {
        historyApiFallback: true,
        static: {
            directory: path.join(__dirname, 'public')
        },
        port: 3000,
        hot: true,
        open: true
    }
}; 