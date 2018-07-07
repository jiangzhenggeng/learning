# vue初始化 data 数据时，会进行数据观察，如果是数组就会在数组的实例上挂载相应的方法，而不是直接扩展Array.prototype
相应的方法是通过

```javascript

const arrayProto = Array.prototype
export const arrayMethods = Object.create(arrayProto)

```

来的
