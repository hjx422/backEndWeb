var path = require('path')
var webpack = require('webpack')
var baseConfig = require('./base.config.js')
const baseDirName = path.resolve(__dirname, '../')

var config = baseConfig
config.module.loaders = config.module.loaders.concat([{
    test: /\.js$/,
    loaders: ['babel'],
    include: path.join(baseDirName, 'src')
}])

module.exports =  config
