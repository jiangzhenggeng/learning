const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const cutomChunkModuls = require('./custom-module')
const METADATA = require('./custom-metadata')

let cacheGroups = {}
Object.keys(cutomChunkModuls).forEach((item) => {
  let cacheGroupsArrayReg = []
  cutomChunkModuls[item].forEach((moduleName) => {
    cacheGroupsArrayReg.push( moduleName )
  })
  cacheGroups[item] = {
      test: (module) => {
        let result = false
        cacheGroupsArrayReg.forEach((moduleName) => {
          if (result){
            return
          }
          let module_path = path.join(__dirname, '../node_modules',moduleName)
          let path_fix = module.resource ? module.resource.substr(module_path.length,1) : ''
          result = module.resource &&
            /\.js$/.test(module.resource) &&
            module.resource.indexOf(module_path) === 0 &&
            (path_fix === '/' || path_fix === '\\')
        })
        return result
      },
      priority: 100,
      name: item,
      chunks: 'initial',
      enforce: true
    }
})

const webpackConfig = merge(baseWebpackConfig, {
  mode: 'production',
  // mode: 'development',
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true,
      usePostCSS: true
    })
  },
  devtool: config.build.productionSourceMap ? config.build.devtool : false,
  output: {
    path: config.build.assetsRoot,
    filename: utils.assetsPath('js/[name]-[chunkhash].js'),
    chunkFilename: utils.assetsPath('js/[id]-[name]-[chunkhash].js')
  },
  optimization: {
    splitChunks: {
      chunks: 'initial',
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      name: true,
      cacheGroups: {
        vendors: {
          priority: -10,
          name: 'vendors',
          chunks: 'initial',
          enforce: true,
          test(module){
            let result = module.resource && /\.js$/.test(module.resource) && module.resource.indexOf(path.join(__dirname, '../node_modules')) === 0
            return result || false
          }
        },
        ...cacheGroups
      }
    },
    runtimeChunk: {
      name: 'runtime'
    }
  },
  plugins: [
    new VueLoaderPlugin(),
    new webpack.BannerPlugin({
      banner: METADATA,
      raw: true,
      entryOnly: true
    }),

    // 解决moment打包的时候把所有的语言都打包进去的问题
    new webpack.ContextReplacementPlugin(
      /moment[\/\\]locale$/,
      /zh-cn/
    ),

    new OptimizeCSSAssetsPlugin({
      // 注意不要写成 /\.css$/g
      assetNameRegExp: /\.css\.*(?!.*map)/g,
      cssProcessor: require('cssnano'),
      cssProcessorOptions: {
        sourcemap: config.build.productionSourceMap,
        discardComments: { removeAll: true },
        // 避免 cssnano 重新计算 z-index
        safe: true,
        // cssnano 集成了autoprefixer的功能
        // 会使用到autoprefixer进行无关前缀的清理
        // 关闭autoprefixer功能
        // 使用postcss的autoprefixer功能
        autoprefixer: false
      },
      canPrint: true
    }),
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    // new webpack.DefinePlugin({
    //   'process.env': env
    // }),
    // extract css into its own file
    new MiniCssExtractPlugin({
      filename: utils.assetsPath('css/[name].[contenthash].css'),
      // Setting the following option to `false` will not extract CSS from codesplit chunks.
      // Their CSS will instead be inserted dynamically with style-loader when the codesplit chunk has been loaded by webpack.
      // It's currently set to `true` because we are seeing that sourcemaps are included in the codesplit bundle as well when it's `false`,
      // increasing file size: https://github.com/vuejs-templates/webpack/issues/1110
      allChunks: true
    }),
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: config.build.index,
      template: 'index.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: false
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      }
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      // chunksSortMode: 'dependency'
    }),
    // keep module.id stable when vendor modules does not change
    new webpack.HashedModuleIdsPlugin(),
    // enable scope hoisting
    new webpack.optimize.ModuleConcatenationPlugin(),

    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.build.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})

if (config.build.productionGzip) {
  const CompressionWebpackPlugin = require('compression-webpack-plugin')

  // location ~* \.(css|js)$ {
  //   gzip_static on;
  // }
  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      filename: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}

if (config.build.bundleAnalyzerReport) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig
