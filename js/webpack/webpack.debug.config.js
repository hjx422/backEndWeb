var path = require('path')
var webpack = require('webpack')
var baseConfig = require('./base.config.js')
const baseDirName = path.resolve(__dirname, '../')

var config = {
    ...baseConfig,
    devtool: 'source-map',
    plugins: [
        new webpack.DefinePlugin({
            'process.env': { NODE_ENV: JSON.stringify('debug') }
        }),
        new ExtractTextPlugin('app.[contenthash].css', {
            allChunks: true
        }),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery"
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'libs',
            filename: 'libs',
            async: true
        }),
        new webpack.optimize.CommonsChunkPlugin({
            names: ['reactlibs', 'vendors'],
            filename: '[name].bundle.js',
            minChunks: Infinity
        }),
        new CopyWebpackPlugin([
            {from: path.join(baseDirName, 'static'), to: path.join(baseDirName, '../webapp/static')},
            {from: path.join(baseDirName, 'res'), to: path.join(baseDirName, '../webapp/res')},
            {from: path.join(baseDirName, 'WEB-INF'), to: path.join(baseDirName, '../webapp/WEB-INF')}
        ]),
        new HtmlWebpackPlugin({
            title: 'DJ名片',
            template: path.resolve(__dirname, 'index-template.html'),
            inject: 'body',
            filename: 'index.html'
        }), //根目录
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            output: {
                comments: false
            }
        }),
        new webpack.optimize.AggressiveMergingPlugin({ moveToParents: true })
    ],
    resolve: {
        alias: {
            basecomponent: path.resolve(baseDirName, 'src/components/base'),
            styles: path.resolve(baseDirName, 'styles'),
            i18n: path.resolve(baseDirName, 'src/i18n'),
            img: path.resolve(baseDirName, 'static/img'),
            static: path.resolve(baseDirName, 'static'),
            base: path.resolve(baseDirName, 'src/components/base'),
            utils: path.resolve(baseDirName, 'src/utils'),
            css: path.resolve(baseDirName, 'styles/common/css'),
            sinon: 'sinon/pkg/sinon.js',
            templateEditor: path.resolve(baseDirName, 'src/modules/templateEditor'),
            minderDemo: path.resolve(baseDirName, 'src/modules/minderDemo')
        },
        modulesDirectories: [
            'node_modules', 'common', 'img'
        ]
    },
    module: {
        ...baseConfig.module,
        noParse: [ /\/sinon\.js/ ],
    }
}

config.module.loaders = config.module.loaders.concat([{
    test: /\.js$/,
    loaders: ['babel'],
    include: path.resolve(baseDirName, 'src')
}])

module.exports = config
