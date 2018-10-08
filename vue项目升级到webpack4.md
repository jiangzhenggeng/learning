[升级成功参考脚手架](./vue-to-webpack4)
 
# vue-cli升级webpack4.0升级流程
安装npm-check
```bash
npm i -g npm-check
```
检查升级模块
```bash
npm-check -u
```
*  babel-core 安装6.x
* babel-loader 安装7.x
* 其他所有模块升级到最新
* 安装mini-css-extract-plugin代替extract-text-webpack-plugin
* 安装 webpack-cli

```javascript
// webpack.dev.conf.js
module.exports = merge(baseWebpackConfig, {
  mode: 'development',
  // 省略
  plugins: [
    //new webpack.DefinePlugin({
    //    'process.env': config.dev.env
    //}),
  ]
}
// webpack.prod.conf.js
var webpackConfig = merge(baseWebpackConfig, {
  mode: 'production',
  // 省略
  //plugins: [
  //  new webpack.DefinePlugin({
  //    'process.env': env
  //  }),
  ]  
}
```


因为extract-text-webpack-plugin的最新正式版还没有对webpack4.x进行支持，即使是使用extract-text-webpack-plugin@next版本依然会出现报contenthash错误，所以还是建议使用mini-css-extract-plugin，当然这也是官方推荐的。

主要需要修改webpack.prod.conf.js中的插件配置以及loaders加载的工具函数utils.js，修改片段代码如下：

```javascript
// webpack.dev.conf.js
module.exports = merge(baseWebpackConfig, {
  // 省略
  plugins: [
    new MiniCssExtractPlugin({
      filename: utils.assetsPath('css/[name].[contenthash].css')
    }),
  ]
} 
// utils.js
if (options.extract) {
return [
  {
    loader: MiniCssExtractPlugin.loader,
    options: {
      publicPath: '../../'
    }
  }
  ].concat(loaders)
} else {
  return ['vue-style-loader'].concat(loaders)
}
```
主要是因为webpack4中删除了webpack.optimize.CommonsChunkPlugin，并且使用optimization中的splitChunk来替代

主要需要修改webpack.prod.conf.js文件，并且删除所有webpack.optimize.CommonsChunkPlugin相关代码，片段代码如下：

```javascript
var webpackConfig = merge(baseWebpackConfig, {
  mode: 'production',
  entry: {
    charts: ['echarts'],
    vendors: ['vue', 'vuex', 'vue-router', 'moment'],
    iconfonts: ['ga-iconfont']
  },
  // 省略
  optimization: {
    // minimizer: true, // [new UglifyJsPlugin({...})]
    providedExports: true,
    usedExports: true,
    //识别package.json中的sideEffects以剔除无用的模块，用来做tree-shake
    //依赖于optimization.providedExports和optimization.usedExports
    sideEffects: true,
    //取代 new webpack.optimize.ModuleConcatenationPlugin()
    concatenateModules: true,
    //取代 new webpack.NoEmitOnErrorsPlugin()，编译错误时不打印输出资源。
    noEmitOnErrors: true,
    splitChunks: {
      // maxAsyncRequests: 1,                     // 最大异步请求数， 默认1
      // maxInitialRequests: 1,                   // 最大初始化请求数，默认1
      cacheGroups: {
        // 抽离第三方插件
        commons: {
          // test: path.resolve(__dirname, '../node_modules'),
          chunks: 'all',
          minChunks: 2,
          maxInitialRequests: 5, // The default limit is too small to showcase the effect
          minSize: 0, 
          name: 'common'
        }
      }
    },
}
```
* HTML-WEBPACK-PLUGIN升级
建议升级至最新版本@4.0.0-alpha，这里需要把默认的chunksSortMode: dependency删除，主要是因为webpack4已经删除相关的CommonsChunkPluginAPI了。

* VUE-LOADER升级

```javascript
// webpack.prod.conf.js
const { VueLoaderPlugin } = require('vue-loader')
// 省略
plugins: [
    new VueLoaderPlugin(),
]
```

# 参考链接 http://www.iwangqi.com/2018-07-14-wpk/










