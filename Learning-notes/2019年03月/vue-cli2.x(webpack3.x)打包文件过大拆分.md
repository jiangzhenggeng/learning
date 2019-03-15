# vue-cli2.x(webpack3.x)打包文件过大拆分

## 直接上核心代码
```js
let checksArray = {
  'vue-related': ['vue', 'axios', 'vue-router','moment'],
  'element-ui': ['element-ui'],
  'jquery': ['jquery','scrollbar','vue-video-player'],
  'highcharts': ['highcharts']
}

let plugsArray = []
Object.keys(checksArray).forEach((key1, index1) => {
  let modules = []
  Object.keys(checksArray).forEach((key2, index2) => {
    if (index1 <= index2) {
      modules = modules.concat(Array.isArray(checksArray[key2])?checksArray[key2]:[checksArray[key2]])
    }
  })

  let minChunks = (function (modules) {
    return function (module) {
      let result = false
      modules.forEach((name)=>{
        result = result || module.resource.toLowerCase().indexOf(name) !== -1
      })
      return (
        module.resource &&
        /\.js$/.test(module.resource) &&
        module.resource.indexOf(
          path.join(__dirname, '../node_modules'),
        ) === 0 && result
      )
    }
  }(modules))

  let plugs = new webpack.optimize.CommonsChunkPlugin({
    name: key1,
    minChunks,
  })
  plugsArray.push(plugs)
})

```

## 注意事项以细节（webpack.optimize.CommonsChunkPlugin能拆分包的关键）
以下代码只能才分出 element-ui一个包，并且所有node_modules里的东西都会打进这个包
```js
    ...
    new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks(module) {
            // any required modules inside node_modules are extracted to vendor
            return (
                module.resource &&
                /\.js$/.test(module.resource) &&
                module.resource.indexOf(
                    path.join(__dirname, '../node_modules')
                ) === 0
            )
        }
    }),
    new webpack.optimize.CommonsChunkPlugin({
        name: 'element-ui',
        minChunks(module) {
            // any required modules inside node_modules are extracted to vendor
            return (
                module.resource &&
                /\.js$/.test(module.resource) &&
                module.resource.indexOf(
                    path.join(__dirname, '../node_modules')
                ) === 0 && module.resource.indexOf(path.join(__dirname, '../element-ui'))
            )
        }
    }),
    new webpack.optimize.CommonsChunkPlugin({
        name: 'jquery',
        minChunks(module) {
            // any required modules inside node_modules are extracted to vendor
            return (
                module.resource &&
                /\.js$/.test(module.resource) &&
                module.resource.indexOf(
                    path.join(__dirname, '../node_modules')
                ) === 0 && module.resource.indexOf(path.join(__dirname, '../jquery'))
            )
        }
    }),
    ...
        
```

以下代码只能才分出 jquery一个包，并且所有node_modules里的东西都会打进这个包
```js
    ...
    new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks(module) {
            // any required modules inside node_modules are extracted to vendor
            return (
                module.resource &&
                /\.js$/.test(module.resource) &&
                module.resource.indexOf(
                    path.join(__dirname, '../node_modules')
                ) === 0
            )
        }
    }),
    new webpack.optimize.CommonsChunkPlugin({
        name: 'element-ui',
        minChunks(module) {
            // any required modules inside node_modules are extracted to vendor
            return (
                module.resource &&
                /\.js$/.test(module.resource) &&
                module.resource.indexOf(
                    path.join(__dirname, '../node_modules')
                ) === 0 && module.resource.indexOf(path.join(__dirname, '../element-ui'))
            )
        }
    }),
    new webpack.optimize.CommonsChunkPlugin({
        name: 'jquery',
        minChunks(module) {
            // any required modules inside node_modules are extracted to vendor
            return (
                module.resource &&
                /\.js$/.test(module.resource) &&
                module.resource.indexOf(
                    path.join(__dirname, '../node_modules')
                ) === 0 && module.resource.indexOf(path.join(__dirname, '../jquery'))
            )
        }
    }),
    ...
        
```

感觉是不是很怪啊，这要得深入 webpack.optimize.CommonsChunkPlugin 插件了
插件的顺序和 minChunks 函数的返回值都有一定关系，存在互相chunk的关系，比较复杂

https://segmentfault.com/a/1190000012828879























