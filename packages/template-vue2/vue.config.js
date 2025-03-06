'use strict'
const path = require('path')
const pkg = require('./package.json')
const version = require('./version')
const versionNo = version.getVersion()
// const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');

function resolve(dir) {
  return path.join(__dirname, dir)
}

const name = pkg.name || 'vue-element-admin' // page title

// You can change the port by the following method:
// port = 9529 npm run dev OR npm run dev --port = 9529
const port = process.env.port || process.env.npm_config_port || 9529 // dev port

// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
  /**
   * You will need to set publicPath if you plan to deploy your site under a sub path,
   * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
   * then publicPath should be set to "/bar/".
   * In most cases please use '/' !!!
   * Detail: https://cli.vuejs.org/config/#publicpath
   */
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'development' ? 'error' : false,
  productionSourceMap: false,
  devServer: {
    port: port,
    open: false,
    host: '0.0.0.0',
    // public: '192.168.1.8:9529',
    overlay: {
      warnings: false,
      errors: true
    },
    disableHostCheck: true
    //  proxy: {
    // '/api': {
    // //   target: 'http://121.89.215.83:5000',
    // // target: 'http://39.100.57.32:5000',
    //   target: 'http://192.168.110.39:5000',
    //   changeOrigin: true,
    //   pathRewrite: {
    //     '^/api': '/api'
    //   }
    // }
    // },
    // after(app) {
    //   require('@babel/register')
    //   const bodyParser = require('body-parser')

    //   // parse app.body
    //   // http://expressjs.com/en/4x/api.html#req.body
    //   app.use(bodyParser.json())
    //   app.use(
    //     bodyParser.urlencoded({
    //       extended: true
    //     })
    //   )

    //   const { default: mocks } = require('./mock')
    //   for (const mock of mocks) {
    //     app[mock.type](mock.url, mock.response)
    //   }
    // }
  },
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: name,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
    // plugins: [
    //   new SpriteLoaderPlugin()
    // ]
  },
  chainWebpack(config) {
    config.plugin('define').tap(args => {
      args[0]['process.env.VUE_APP_VERSION'] = `"${versionNo}"`
      return args
    })

    // config.plugin('invoicecfm').use('html-webpack-plugin',[{
    //   template: './template/invoicecfm.html',
    //   filename: 'invoicecfm.html',
    // }])

    config.plugins.delete('preload') // TODO: need test
    config.plugins.delete('prefetch') // TODO: need test

    // set svg-sprite-loader
    // config.module
    //   .rule('svg')
    //   .exclude.add(resolve('src/icons'))
    //   .end()
    // config.module
    //   .rule('icons')
    //   .test(/\.svg$/)
    //   .include.add(resolve('src/icons'))
    //   .end()
    //   .use('svg-sprite-loader')
    //   .loader('svg-sprite-loader')
    //   .options({
    //     extract: true,
    //     symbolId: 'icon-[name]'
    //   })
    //   .end()

    // set preserveWhitespace
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true
        return options
      })
      .end()

    config.when(process.env.NODE_ENV === 'development', config =>
      config.devtool('source-map')
    )

    config.when(process.env.NODE_ENV !== 'development', config => {
      // config.plugin('webpack-bundle-analyzer').use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)

      config
        .plugin('ScriptExtHtmlWebpackPlugin')
        .after('html')
        .use('script-ext-html-webpack-plugin', [
          {
            // `runtime` must same as runtimeChunk name. default is `runtime`
            inline: /runtime\..*\.js$/
          }
        ])
        .end()
      config.optimization.splitChunks({
        chunks: 'all',
        maxAsyncRequests: Infinity,
        maxInitialRequests: Infinity,
        cacheGroups: {
          libs: {
            name: 'libs',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            reuseExistingChunk: true,
          },
          moment: { // split moment libs
            name: 'moment',
            test: /[\\/]node_modules[\\/]_?moment(.*)/,
            priority: 20
          },
          aliOss: { // split ali-oss libs
            name: 'ali-oss',
            test: /[\\/]node_modules[\\/]_?ali-oss(.*)/,
            priority: 30
          },
          echarts: { // split echarts libs
            name: 'echarts',
            test: /[\\/]node_modules[\\/]_?echarts(.*)/,
            priority: 40
          },
          elementUI: {
            name: 'element-ui', // split elementUI into a single package
            priority: 50, // the weight needs to be larger than libs and app or it will be packaged into libs or app
            test: /[\\/]node_modules[\\/]_?element-ui(.*)/
          },
          agGrid: { // split ag-grid libs
            name: 'ag-grid',
            test: /[\\/]node_modules[\\/]_?ag-grid(.*)/,
            priority: 60
          },
          commons: {
            name: 'commons',
            test: resolve('src/components'), // can customize your rules
            minChunks: 3, //  minimum common number
            priority: 5,
            reuseExistingChunk: true
          }
        }
      })
      config.optimization.runtimeChunk('single')
    })
  },
  runtimeCompiler: true
}
