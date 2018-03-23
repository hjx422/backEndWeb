var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var postcssModulesValue = require('postcss-modules-values')
var autoprefixer = require('autoprefixer')
var postcssMixins = require('postcss-mixins')
var precss = require('precss')

const baseDirName = path.resolve(__dirname, '../')

module.exports = {
    devtool: 'source-map',
    entry: {
        app: [
            './src/index'
        ],
        reactlibs: ['react', 'react-dom', 'react-redux', 'redux', 'react-intl',
            'react-router', 'redux-router', 'redux-thunk', 'redux-saga', 'intl'],
        vendors: ['rx-lite', 'crypto-js', 'object-assign', 'brace',
            'pouchdb', 'pouchdb-find', 'jquery'],
        libs: [
            './static/lib/ueditor/third-party/jquery-1.10.2.min.js',
            './static/lib/ueditor/ueditor.config.js',
            './static/lib/ueditor/ueditor.all.js',
            './static/lib/ueditor/lang/en/en.js',
            './static/lib/ueditor/lang/zh-cn/zh-cn.js',
            './static/lib/ZeroClipboard.min.js',
            './static/lib/detect-element-resize.js']
    },
    output: {
        path: path.join(baseDirName, '../webapp'),
        publicPath: '/',
        filename: '[name].[chunkhash].js',
        chunkFilename: '[name].[chunkhash].chunk.js'
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {NODE_ENV: JSON.stringify('production')}
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
            title: 'backStage',
            template: path.resolve(__dirname, 'index-template.html'),
            inject: 'body',
            filename: 'index.html'
        }), //根目录
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.optimize.AggressiveMergingPlugin({moveToParents: true})
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
            css: path.resolve(baseDirName, 'styles/css'),
            templateEditor: path.resolve(baseDirName, 'src/modules/templateEditor'),
            minderDemo: path.resolve(baseDirName, 'src/modules/minderDemo')
        },
        modulesDirectories: [
            'node_modules', 'common', 'img'
        ],
        root: path.resolve(baseDirName, 'src')
    },
    module: {
        loaders: [
            {
                test: /\.css$/,
                exclude: [
                    path.resolve(baseDirName, 'node_modules')
                ],
                include: [
                    path.resolve(baseDirName, 'styles'),
                    path.resolve(baseDirName, 'src')
                ],
                loader: 'style-loader!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader'
            },
            {
                test: /\.json$/,
                include: [
                    path.resolve(baseDirName, 'src'),
                    path.resolve(baseDirName, 'node_modules')
                ],
                loaders: ['json-loader']
            },
            {
                test: /\.(png|jpg|jpeg|gif|ico|cur)$/,
                loaders: ['url-loader']
            },
            {test: /\.svg(\?t=[0-9]+)?$/, loader: 'url?limit=65000&mimetype=image/svg+xml'},
            {test: /\.woff(\?t=[0-9]+)?$/, loader: 'url?limit=65000&mimetype=application/font-woff'},
            {test: /\.woff2(\?t=[0-9]+)?$/, loader: 'url?limit=65000&mimetype=application/font-woff2'},
            {test: /\.[ot]tf(\?t=[0-9]+)?$/, loader: 'url?limit=65000&mimetype=application/octet-stream'},
            {test: /\.eot(\?t=[0-9]+)?$/, loader: 'url?limit=65000&mimetype=application/vnd.ms-fontobject'}
        ]
    },
    postcss: function () {
        return [
            precss,
            postcssModulesValue,
            postcssMixins,
            autoprefixer({browsers: ['> 5%', 'ie 9']})
        ]
    }
    , externals: {CONFIG: 'CONFIG'}
}
