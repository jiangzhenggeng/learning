const path = require('path')
const fs = require('fs')

let cutomChunkModuls = {
  'vue-libs': ['vue']
}
let notFindModule = []
Object.keys(cutomChunkModuls).forEach((module) => {
  cutomChunkModuls[module].forEach((moduleName) => {
    if (!fs.existsSync(path.join(__dirname, '../node_modules', moduleName))) {
      notFindModule.push(moduleName)
    }
  })
})

if (notFindModule.length) {
  console.log('没有找到' + notFindModule.length + '个模块:', notFindModule.join(' '))
  process.exit()
}

module.exports = cutomChunkModuls
