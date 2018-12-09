'use strict'

// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

const CDN_HOST = '//train-static.didiglobal.com/'

const env = process.env.NODE_ENV

// 本地调试线上接口／正式环境打包时，使用线上loginSDK
// 本地调试线下接口／测试环境打包时，使用线下loginSDK
const loginSDK = (env === 'online' || env === 'production') ?
  '//static.udache.com/common/trinity-login/1.5.5/login.min.js' : '//passport.qatest.didichuxing.com/static/trinity-login/1.5.5/login.test.js';

module.exports = {
  dev: {
    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/webapp/',
    proxyTable: {
      '/api/v1': {
        target: process.env.NODE_ENV === 'online' ? 'http://train.didiglobal.com' : 'http://10.96.86.56:8080',
        changeOrigin: true,
        onProxyReq: function(proxyReq, req, res) {
          console.log(process.env.NODE_ENV === 'online' ? 'http://train.didiglobal.com' : 'http://10.96.86.56:8080')
          console.log('proxyreq:bike==>', req.path)
        }
      },
    },
    // Various Dev Server settings
    host: 'localhost', // can be overwritten by process.env.HOST
    port: 8080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-
    loginSDK: loginSDK,
    Meta: '',
    vconsole: '//static.galileo.xiaojukeji.com/static/tms/other/vconsole.min.js',
    eruda: "//cdn.bootcss.com/eruda/1.4.2/eruda.min.js",
    /**
     * Source Maps
     */
    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'inline-source-map', // debugger位置出错，所以将其改为inline-source-map
    // devtool: 'cheap-module-eval-source-map',
    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: false,

    cssSourceMap: true
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../train/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../train'),
    assetsSubDirectory: 'static',
    // assetsPublicPath: '/webapp/',
    assetsPublicPath: process.env.NODE_ENV === 'production' ? CDN_HOST : '/webapp/',
    // loginSDK: '//static.udache.com/common/trinity-login/1.5.5/login.min.js',
    // loginSDK: '//passport.qatest.didichuxing.com/static/trinity-login/1.5.5/login.test.js',
    loginSDK: loginSDK,
    Meta: '<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">', // 混合内容
    vconsole: '//static.galileo.xiaojukeji.com/static/tms/other/vconsole.min.js',
    eruda: process.env.NODE_ENV === 'production' ? "" : "//cdn.bootcss.com/eruda/1.4.2/eruda.min.js",
    /**
     * Source Maps
     */
    productionSourceMap: process.env.NODE_ENV !== 'production',
    // https://webpack.js.org/configuration/devtool/#production
    devtool: process.env.NODE_ENV === 'production' ? '#hidden-source-map' : 'source-map',
    // devtool: 'source-map',
    drop_console: process.env.NODE_ENV === 'production',
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
