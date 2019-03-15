# vue-cli3.x(webpack4.x)打包文件过大拆分

webpack4.x文件拆分优化就没有webpack3.x那么复杂了，直接上核心代码

```js
const path = require('path')

const checksArray = {
  'vue-related': ['vue', 'axios', 'vue-router', 'moment'],
  'element-ui': ['element-ui'],
  jquery: ['jquery'],
  highcharts: ['highcharts']
}

function createModule(fix = 'js') {
  const plugsArray = {
    vendors: {
      priority: -10,
      name: 'vendors',
      chunks: 'initial',
      enforce: true,
      test(module) {
        return module.resource
          && /\.js$/.test(module.resource)
          && module.resource.indexOf(path.join(__dirname, 'node_modules')) === 0
      }
    }
  }
  Object.keys(checksArray).forEach((key1) => {
    let modules = []
    const mo = Array.isArray(checksArray[key1]) ? checksArray[key1] : [checksArray[key1]]
    modules = modules.concat(mo)

    const minChunks = (function (modules) {
      return function (module) {
        let result = false
        if (module.resource) {
          modules.forEach((name) => {
            result = result || module.resource.toLowerCase().indexOf(name) !== -1
          })
        }
        // eslint-disable-next-line
        let reg = new RegExp(`/\.${fix}$/`)
        return (
          module.resource
          && reg.test(module.resource)
          && module.resource.indexOf(
            path.join(__dirname, 'node_modules'),
          ) === 0 && result
        )
      }
    }(modules))

    plugsArray[key1] = {
      test: minChunks,
      priority: 100,
      name: key1,
      chunks: 'initial',
      enforce: true
    }
  })
  return plugsArray
}

module.exports = {
  configureWebpack: () => {
    const config = {
      optimization: {
        splitChunks: {
          chunks: 'initial',
          minSize: 30000,
          minChunks: 1,
          maxAsyncRequests: 5,
          maxInitialRequests: 3,
          name: true,
          cacheGroups: {
            ...createModule('js'),
            ...createModule('css')
          }
        },
        runtimeChunk: {
          name: entrypoint => `runtimechunk~${entrypoint.name}`
        }
      }
    }
    if (process.env.NODE_ENV === 'production') {
      // 为生产环境修改配置...
      return config
    }
    // 为开发环境修改配置...
    return config
  }
}
```
