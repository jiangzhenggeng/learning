# js多数组的常规操作

## ES6 Arrar.from() 将两类对象转为真正的数组

定义：用于将两类对象转为真正的数组（不改变原对象，返回新的数组）。

参数：

第一个参数(必需):要转化为真正数组的对象。

第二个参数(可选): 类似数组的map方法，对每个元素进行处理，将处理后的值放入返回的数组。

第三个参数(可选): 用来绑定this。

```javascript

// 1. 对象拥有length属性
let obj = {0: 'a', 1: 'b', 2:'c', length: 3};
let arr = Array.from(obj); // ['a','b','c'];
// 2. 部署了 Iterator接口的数据结构 比如:字符串、Set、NodeList对象
let arr = Array.from('hello'); // ['h','e','l','l']
let arr = Array.from(new Set(['a','b'])); // ['a','b']

```
方法:

数组原型提供了非常多的方法，这里分为三类来讲，一类会改变原数组的值，一类是不会改变原数组，以及数组的遍历方法。

## reverse() 颠倒数组中元素的顺序
定义: reverse() 方法用于颠倒数组中元素的顺序。

参数: 无
```javascript

let a = [1,2,3];
a.reverse(); 
console.log(a); // [3,2,1]

```

## splice() 添加/删除数组元素

定义： splice() 方法向/从数组中添加/删除项目，然后返回被删除的项目

语法： array.splice(index,howmany,item1,.....,itemX)

参数:

index：必需。整数，规定添加/删除项目的位置，使用负数可从数组结尾处规定位置。
howmany：必需。要删除的项目数量。如果设置为 0，则不会删除项目。
item1, …, itemX： 可选。向数组添加的新项目。
返回值: 如果有元素被删除,返回包含被删除项目的新数组。

### eg1:删除元素

```javascript

let a = [1, 2, 3, 4, 5, 6, 7];
let item = a.splice(0, 3); // [1,2,3]
console.log(a); // [4,5,6,7]
// 从数组下标0开始，删除3个元素
let item = a.splice(-1, 3); // [7]
// 从最后一个元素开始删除3个元素，因为最后一个元素，所以只删除了7

```
### eg2: 删除并添加

```js
let a = [1, 2, 3, 4, 5, 6, 7];
let item = a.splice(0,3,'添加'); // [1,2,3]
console.log(a); // ['添加',4,5,6,7]
// 从数组下标0开始，删除3个元素，并添加元素'添加'
 let b = [1, 2, 3, 4, 5, 6, 7];
let item = b.splice(-2,3,'添加1','添加2'); // [6,7]
console.log(b); // [1,2,3,4,5,'添加1','添加2']
// 从数组最后第二个元素开始，删除3个元素，并添加两个元素'添加1'、'添加2'
```

### eg3: 不删除只添加:

```js
let a = [1, 2, 3, 4, 5, 6, 7];
let item = a.splice(0,0,'添加1','添加2'); // [] 没有删除元素，返回空数组
console.log(a); // ['添加1','添加2',1,2,3,4,5,6,7]
let b = [1, 2, 3, 4, 5, 6, 7];
let item = b.splice(-1,0,'添加1','添加2'); // [] 没有删除元素，返回空数组
console.log(b); // [1,2,3,4,5,6,'添加1','添加2',7] 在最后一个元素的前面添加两个
```

### 从上述三个栗子可以得出:

- 数组如果元素不够，会删除到最后一个元素为止
- 操作的元素，包括开始的那个元素
- 可以添加很多个元素
- 添加是在开始的元素前面添加的

## 不改变原数组的方法(8个):

### ES5：
join、toLocateString、toStrigin、slice、cancat、indexOf、lastIndexOf、
### ES7：
includes


## 遍历方法(12个):

### js中遍历数组并不会改变原始数组的方法总共有12个:

###  ES5：
forEach、every 、some、 fliter、map、reduce、reduceRight、
### ES6：
find、findIndex、keys、values、entries
