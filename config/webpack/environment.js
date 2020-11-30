const { environment, config } = require('@rails/webpacker')
const { resolve } = require('path')
const vue = require('./loaders/vue')

const VueLoaderPlugin = require('vue-loader/lib/plugin')
environment.plugins.append(
    'VueLoaderPlugin',
    new VueLoaderPlugin()
)

environment.loaders.append('vue', vue)

module.exports = environment
