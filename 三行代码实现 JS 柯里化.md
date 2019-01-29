# 三行代码实现 JS 柯里化
最近有看到一些柯里化的文章，怎么说呢，感觉很奇怪。一篇是阿里云的译文，文章末尾给出了这样一个 "curry"：
```js
function curry(fn, ...args) {
    return (..._arg) => {
        return fn(...args, ..._arg);
    }
}
```
作者前面明明例举了柯里化和部分应用的区别，结果最后说我们实现下柯里化吧，然后写了个部分应用……太假了，我忍不住评论了一下：
<img src="https://user-gold-cdn.xitu.io/2018/11/25/167478ad0505e2df?imageView2/0/w/1280/h/960/format/webp/ignore-error/1" />

然后今天看到我们组欢哥的文章，说实话看了一下开头这段代码我就不太有耐心看下面具体的分析了：

```js
// 定义占位符
var _ = '_';

function magician3 (targetfn, ...preset) {
  var numOfArgs = targetfn.length;
  var nextPos = 0; // 下一个有效输入位置的索引，可以是'_'，也可以是preset的结尾

  // 查看是否有足够的有效参数
  if (preset.filter(arg=> arg !== _).length === numOfArgs) {
    return targetfn.apply(null, preset);
  } else {
    // 返回'helper'函数
    return function (...added) {
      // 循环并将added参数添加到preset参数
      while(added.length > 0) {
        var a = added.shift();
        // 获取下一个占位符的位置，可以是'_'也可以是preset的末尾
        while (preset[nextPos] !== _ && nextPos < preset.length) {
          nextPos++
        }
        // 更新preset
        preset[nextPos] = a;
        nextPos++;
      }
      // 绑定更新后的preset
      return magician3.call(null, targetfn, ...preset);
    }
  }
}
```
这是在干嘛……然后欢哥他们发现了这段代码有 bug，分析了一通，解决了 bug，美好的青春啊朋友们，出去喝酒蹦迪大保健不好么，非得这么挥霍生命么……

在我们自己实现之前，对柯里化没什么概念的同学可以看下 wiki（要看英文 wiki，中文 wiki 对柯里化的解释写得又乱又不准确，容易和部分应用混淆），简单来说柯里化就是把一个多参函数转换成接受单参的一系列函数。它跟部分应用的概念不太一样，部分应用是把一个多参函数“切”一刀，而柯里化是把函数“切”好多刀，直到中间每个函数都是单参的，最后得到的结果就是所谓的柯里化函数（curried function）。在 JS 里要手写个 curried function 其实就是手写个高阶函数，没什么特别的。那要实现一个通用的 curry，该怎么做呢，我不是针对谁，我是说上面那两个实现都在卖萌……
```js
const curry = (fn) => {
    if (fn.length <= 1) return fn;

    const generator = (args, rest) => (!rest ? fn(...args) : arg => generator([...args, arg], rest - 1));

    return generator([], fn.length);
};
```
这不就三行代码搞定了么（不算函数声明），测一下：
```js
const sum = (a, b, c) => a + b + c;
const curriedSum = curry(sum); 
const res = curriedSum(1)(2)(3) 
console.log(res); // 6

const log = (a, b, c) => {
    console.log(a, b, c);
};
const curriedLog = curry(log);
curriedLog('a')('b')('c'); // a b c
```
好像没啥问题吧……emmmmm……欢迎打脸。

由此可见，在折腾什么 curry 什么 partial application 之前，还是多琢磨琢磨递归这种基本概念，顺便附送一个 FP Style 的快排吧，突然感觉我也挺挥霍青春的……
```js
const quickSort = (list) => {
    if (!list || !list.length) return [];
    if (list.length === 1) return list;

    const [middle, ...rest] = list;
    const reducer = (acc, x) => (
        x <= middle ? 
        { ...acc, left: [...acc.left, x] } : 
        { ...acc, right: [...acc.right, x] }
    );
    const { left, right } = rest.reduce(reducer, { left: [], right: [] });
    return [...quickSort(left), middle, ...quickSort(right)];
};

const list = [2, 3, 1, 8, 8, 1, 2, 18, 6, 2333];
const sorted = quickSort(list); // [ 1, 1, 2, 2, 3, 6, 8, 8, 18, 2333 ]

```
PS：评论里有位大佬给了一个一行的实现：
```js
const curry = (fn, arr = []) => (...args) => (
  arg => arg.length === fn.length
    ? fn(...arg)
    : curry(fn, arg)
)([...arr, ...args])
```
我也只能开动小脑筋把我的实现改成了一行……
```js
// 跟三行的思路是一样的，就是强行写到了一行……
const curry = fn =>
    (arg, args = [arg], rest = fn.length - 1) =>
    (rest < 1 ? fn(...args) : newArg => curry(fn)(newArg, [...args, newArg], rest - 1));
```
对比上面两个实现，我们会发现我的实现……败了，因为我既然有 args，这个 rest 就是多余的，所以改成这样：
```js
// 感觉还是多拆几行比较好……
const curry = fn =>
    (arg, args = [arg]) =>
    (!fn.length || args.length === fn.length ? fn(...args) : newArg => curry(fn)(newArg, [...args, newArg]));
```
关注下面的标签，发现更多相似文章
