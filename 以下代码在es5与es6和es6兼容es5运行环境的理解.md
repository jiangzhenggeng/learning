**以下代码在es5与es6和es6兼容es5运行环境的理解.md**
```javascript
function f () {
  console.log('sdvsd')
}
(function () {
  if(false){
     function f() {
      console.log('scscscdvsv')
    }
  }
	console.log(typeof f)
	console.log(f)
	f()
}())
```
**1、纯es6环境里或者 "use strict" 模式**
如果在纯es6环境里或者 "use strict" 模式
由于if块有作用域  if(false) 里面的不会影响外面的即时是  if(true)
**2、纯es5环境里**
由于if块有作用域  if(false) 不执行所以if的函数没有被初始化
由于函数定义的变量定义有提升原则，所以 if 里的函数被提升定义为 undfined
所以 f 为undefined
如果 if(true) 里面的函数被初始化，所以 f 是第二个函数
