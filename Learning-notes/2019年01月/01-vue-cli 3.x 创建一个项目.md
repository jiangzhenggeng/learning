# vue.config.js 自定义配置

```js

module.exports = {
  // 基本路径
  baseUrl: '/',
  // 输出文件目录
  outputDir: 'dist',
  // eslint-loader 是否在保存的时候检查
  lintOnSave: true,
  // use the full build with in-browser compiler?
  // https://vuejs.org/v2/guide/installation.html#Runtime-Compiler-vs-Runtime-only
  compiler: false,
  // webpack配置
  // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
  chainWebpack: () => {},
  configureWebpack: () => {},
  // vue-loader 配置项
  // https://vue-loader.vuejs.org/en/options.html
  vueLoader: {},
  // 生产环境是否生成 sourceMap 文件
  productionSourceMap: true,
  // css相关配置
  css: {
    // 是否使用css分离插件 ExtractTextPlugin
    extract: true,
    // 开启 CSS source maps?
    sourceMap: false,
    // css预设器配置项
    loaderOptions: {},
    // 启用 CSS modules for all css / pre-processor files.
    modules: false
  },
  // use thread-loader for babel & TS in production build
  // enabled by default if the machine has more than 1 cores
  parallel: require('os').cpus().length > 1,
  // 是否启用dll
  // See https://github.com/vuejs/vue-cli/blob/dev/docs/cli-service.md#dll-mode
  dll: false,
  // PWA 插件相关配置
  // see https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
  pwa: {},
  // webpack-dev-server 相关配置
  devServer: {
    open: process.platform === 'darwin',
    host: '0.0.0.0',
    port: 8080,
    https: false,
    hotOnly: false,
    proxy: null, // 设置代理
    before: app => {}
  },
  // 第三方插件配置
  pluginOptions: {
    // ...
  }
}


```
# 设置代理

```js
module.exports = {
  devServer: {
    proxy: '<url>'
  }
}

# Object
module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: '<url>',
        ws: true,
        changeOrigin: true
      },
      '/foo': {
        target: '<other_url>'
      }
    }
  }
}
```

# 启用dll
启用dll后，我们的动态库文件每次打包生成的vendor的[chunkhash]值就会一样，其值可以是 true/false,也可以制定特定的代码库。

```js
module.exports = {
  dll: true
}

module.exports = {
  dll: [
    'dep-a',
    'dep-b/some/nested/file.js'
  ]
}
```

# 静态资源路径
## 相对路径

- 静态资源路径以 @ 开头代表  <projectRoot>/src
- 静态资源路径以 ~  开头，可以引入node modules内的资源



## public文件夹里的静态资源引用
```vueejs
# 在 public/index.html中引用静态资源
  <%= webpackConfig.output.publicPath %>
  <link rel="shortcut icon" href="<%= webpackConfig.output.publicPath %>favicon.ico">

# vue templates中，需要在data中定义baseUrl
  <template>
    <img :src="`${baseUrl}my-image.png`">
  </template>
  <script>
    data () {
      return {
        baseUrl: process.env.BASE_URL
      }
    }
  </script>
```

# webpack配置修改
用 webpack-chain 修改webpack相关配置，强烈建议先熟悉webpack-chain和vue-cli 源码，以便更好地理解这个选项的配置项。

对模块处理配置

```js
// vue.config.js
module.exports = {
  chainWebpack: config => {
    config.module
      .rule('js')
        .include
          .add(/some-module-to-transpile/)  // 要处理的模块
  }
}
```


# 修改webpack Loader配置

```js
// vue.config.js
module.exports = {
  chainWebpack: config => {
    config.module
      .rule('scss')
      .use('sass-loader')
      .tap(options =>
        merge(options, {
          includePaths: [path.resolve(__dirname, 'node_modules')],
        })
      )
  }
}
```


修改webpack Plugin配置

```js
// vue.config.js
module.exports = {
  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        return [/* new args to pass to html-webpack-plugin's constructor */]
      })
  }
}
```


eg: 在本次项目较小，只对uglifyjs进行了少量的修改，后期如果还有配置上优化会继续添加。

```js
chainWebpack: config => {
    if (process.env.NODE_ENV === 'production') { 
        config
            .plugin('uglify')
            .tap(([options]) =>{
                // 去除 console.log
                return [Object.assign(options, {
                    uglifyOptions: { compress: {
                        drop_console : true,
                        pure_funcs: ['console.log']
                    }}
                })]
            })
    }
}
```

复制代码全局变量的设置
在项目根目录创建以下项目：
.env                # 在所有环节中执行
.env.local          # 在所有环境中执行，git会ignored
.env.[mode]         # 只在特定环境执行( [mode] 可以是 "development", "production" or "test" )
.env.[mode].local   # 在特定环境执行, git会ignored


.env.development    # 只在生产环境执行
.env.production     # 只在开发环境执行
复制代码在文件里配置键值对：
# 键名须以VUE_APP开头
VUE_APP_SECRET=secret
复制代码在项目中访问：
console.log(process.env.VUE_APP_SECRET)
复制代码这样项目中的 process.env.VUE_APP_SECRET 就会被 secret 所替代。
vue-cli 3 就项目性能而言已经相当友好了，私有制定性也特别强，各种配置也特别贴心，可以根据项目大小和特性制定私有预设，对前期项目搭建而言效率极大提升了。




