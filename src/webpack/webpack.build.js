/**
 * Created by Administrator on 2018/2/25.
 */
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = [{
    name: 'web',
    devtool: 'cheap-source-map',
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: path.resolve(__dirname, 'src'),
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': { NODE_ENV: JSON.stringify('production') }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            output: {
                comments: false
            }
        }),
        new HtmlWebpackPlugin({
            title: 'backstage web',
            template: path.resolve(__dirname, 'src/templates/index-template.html'),
            inject: 'body',
            filename:'../index.html'
        }), //¸ùÄ¿Â¼
        new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.bundle.js')
    ]
}]