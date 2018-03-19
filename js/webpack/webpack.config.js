/**
 * Created by hjx on 10/26/2015.
 */
var path = require('path')
var webpack = require('webpack')
var fs = require('fs')
var autoprefixer = require('autoprefixer')
var precss = require('precss')
var baseConfig = require('./base.config.js')

const baseDirName = path.resolve(__dirname, '../')

var replaceThis ='<div id="root"></div>'
var withThis ='<div id="root"></div>' +
    '<script src="/dist/vendors.bundle.js"></script>'+
    '<script src="/dist/libs.bundle.js"></script>'+
    '<script src="/dist/app.bundle.js"></script>'

var cnt = fs.readFileSync(path.resolve(__dirname, 'index-template.html'))
fs.writeFileSync('index.html', cnt.toString().replace(replaceThis, withThis).replace(/\<title.*title\>/, '<title>DJ名片</title>'))

module.exports = {
    ...baseConfig,
    devtool: 'cheap-module-eval-source-map',
    entry: {
        app: [
            'webpack-dev-server/client?http://localhost:3030',
            'webpack/hot/only-dev-server',
            './src/index'
        ],
        vendors: [ 'react', 'react-dom', 'react-redux', 'redux', 'jquery', 'q', 'react-router',  'crypto-js', 'object-assign' ],
        libs: [
            './static/lib/ueditor/third-party/jquery-1.10.2.min.js',
            './static/lib/ueditor/ueditor.config.js',
            './static/lib/ueditor/ueditor.all.js',
            './static/lib/ueditor/lang/zh-cn/zh-cn.js',
            './static/lib/ueditor/lang/en/en.js',
            './static/lib/ZeroClipboard.min.js',
            './static/lib/detect-element-resize.js']
    },
    output: {
        path: path.resolve(baseDirName, 'dist'),
        filename: '[name].bundle.js',
        publicPath: '/dist/'
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery"
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            names: ['libs', 'vendors'],
            filename: '[name].bundle.js',
            minChunks: Infinity})
    ],
    module: {
        loaders: baseConfig.module.loaders.concat([
            {
                test: /\.js$/,
                loaders: [ 'react-hot', 'babel-loader', 'eslint-loader' ],
                include: path.resolve(baseDirName, 'src')
            },

        ])
    },
}
