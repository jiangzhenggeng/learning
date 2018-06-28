```html

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Title</title>
</head>
<body>
<style>
  * {
    margin: 0;
    padding: 0;
  }

  .box {
    border: 5px solid red;
  }

  .item1 {
    background: green;
    width: 100px;
    height: 100px;
  }

  .item2 {
    background: yellowgreen;
    height: 100px;
    width: 100px;
  }

</style>

<div class="box">
  <div class="item item1">sc1</div>
  <div class="item item2">sc2</div>
  <div class="item item2">
    <span>sc3</span>
  </div>
</div>


<style>
  p {
    color: #f55;
    background: #fcc;
    width: 200px;
    line-height: 100px;
    text-align: center;
    margin: 100px;
  }
</style>
<div>
  <p>Haha</p>
  <div class="wrap">
    <p>Hehe</p>
  </div>
</div>

</body>
</html>

```

```javascript
function Base (selector) {
    this.selectEls = []
    this.selectCurrentEl = null
    if (selector instanceof Base) {
      this.selectEls.push(selector)
      this.selectCurrentEl = selector
      return selector
    }
    this.selectCurrentEl = document.querySelectorAll(selector)
    this.selectEls.push(this.selectCurrentEl)
  }

  Base.prototype.contains = function (parent, node) {
    if (document.documentElement.contains) {
      return parent !== node && parent.contains(node)
    }
    while (node && (node = node.parentNode)) {
      if (node === parent) return true
    }
    return false
  }

  Base.prototype.on = function (type, selector, fn) {

    let base = this

    function bindFn (e) {
      (typeof selector === 'string' ? e.currentTarget.querySelectorAll(selector) : [this]).forEach((el) => {
        if (el === e.target || base.contains(el, e.target)) {
          (typeof selector === 'string' ? fn : selector).apply(el, [e])
        }
      })
    }

    this.selectEls.forEach((els) => {
      els.forEach((el) => {
        el.addEventListener(type, bindFn, false)
      })
    })
    return this
  }

  var $ = function (selector) {
    return new Base(selector)
  }

  $('body').on('click', '.item.item2', function (e) {
    console.log(e)
    console.log(this)
  })
```