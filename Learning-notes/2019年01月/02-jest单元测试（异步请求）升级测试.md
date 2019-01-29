# jest异步获取数据

## 表单
request支持application/x-www-form-urlencoded和multipart/form-data实现表单上传。
x-www-form-urlencoded很简单：
```js
request.post('http://service.com/upload', {form:{key:'value'}})
```
或者：
```js
request.post('http://service.com/upload').form({key:'value'})
```
使用multipart/form-data不用操心设置header之类的琐事，request会帮你解决。
```js
var r = request.post('http://service.com/upload')
var form = r.form()
form.append('my_field', 'my_value')
form.append('my_buffer', new Buffer([1, 2, 3]))
form.append('my_file', fs.createReadStream(path.join(__dirname, 'doodle.png'))
form.append('remote_file', request('http://google.com/doodle.png'))
```
## HTTP认证
```js
request.get('http://some.server.com/').auth('username', 'password', false);
```
```js
request.get('http://some.server.com/', {
  'auth': {
    'user': 'username',
    'pass': 'password',
    'sendImmediately': false
  }
});
```



sendImmediately，默认为真，发送一个基本的认证header。设为false之后，收到401会重试（服务器的401响应必须包含WWW-Authenticate指定认证方法）。

sendImmediately为真时支持Digest认证。

OAuth登录
```js
// Twitter OAuth
var qs = require('querystring')
  , oauth =
    { callback: 'http://mysite.com/callback/'
    , consumer_key: CONSUMER_KEY
    , consumer_secret: CONSUMER_SECRET
    }
  , url = 'https://api.twitter.com/oauth/request_token'
  ;
request.post({url:url, oauth:oauth}, function (e, r, body) {
  // Ideally, you would take the body in the response
  // and construct a URL that a user clicks on (like a sign in button).
  // The verifier is only available in the response after a user has
  // verified with twitter that they are authorizing your app.
  var access_token = qs.parse(body)
    , oauth =
      { consumer_key: CONSUMER_KEY
      , consumer_secret: CONSUMER_SECRET
      , token: access_token.oauth_token
      , verifier: access_token.oauth_verifier
      }
    , url = 'https://api.twitter.com/oauth/access_token'
    ;
  request.post({url:url, oauth:oauth}, function (e, r, body) {
    var perm_token = qs.parse(body)
      , oauth =
        { consumer_key: CONSUMER_KEY
        , consumer_secret: CONSUMER_SECRET
        , token: perm_token.oauth_token
        , token_secret: perm_token.oauth_token_secret
        }
      , url = 'https://api.twitter.com/1/users/show.json?'
      , params =
        { screen_name: perm_token.screen_name
        , user_id: perm_token.user_id
        }
      ;
    url += qs.stringify(params)
    request.get({url:url, oauth:oauth, json:true}, function (e, r, user) {
      console.log(user)
    })
  })
})
```

定制HTTP header
User-Agent之类可以在options对象中设置。在下面的例子中，我们调用github API找出某仓库的收藏数和派生数。我们使用了定制的User-Agent和https.
```js
var request = require('request');

var options = {
    url: 'https://api.github.com/repos/mikeal/request',
    headers: {
        'User-Agent': 'request'
    }
};

function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
        var info = JSON.parse(body);
        console.log(info.stargazers_count + " Stars");
        console.log(info.forks_count + " Forks");
    }
}

request(options, callback);
```
cookies
默认情况下，cookies是禁用的。在defaults或options将jar设为true，使后续的请求都使用cookie.
```js
var request = request.defaults({jar: true})
request('http://www.google.com', function () {
  request('http://images.google.com')
})
通过创建request.jar()的新实例，可以使用定制的cookie，而不是request全局的cookie jar。

var j = request.jar()
var request = request.defaults({jar:j})
request('http://www.google.com', function () {
  request('http://images.google.com')
})
```
或者
```js
var j = request.jar()
var cookie = request.cookie('your_cookie_here')
j.setCookie(cookie, uri, function (err, cookie){})
request({url: 'http://www.google.com', jar: j}, function () {
  request('http://images.google.com')
})
```
注意，setCookie至少需要三个参数，最后一个是回调函数。

```js
describe('@@@', () => {
  it('!!!', () => {

    let url2 = `https://bim5d-zxtest.glodon.com/api/v1/projects/10458294894201596024/reportCycleRegister/detailAnalysis/contractPayment/get`
    let promise2 = get(url2,{
      startTime: '',
      endTime: '',
      condition: ''
    }).then((replayData) => {
      expect(replayData.code).toBe(0)
    })
    let promise = Promise.all([promise2])
    return promise
  })
})

```

```js
import Request from 'request'

let access_token = 'cn-e1653a15-eaf4-4e68-826a-d8799c523964'
let defaultHeaders = {
  'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
}

let exportDefault = {}

function checkRespon (data) {
  let {
    resolve,
    reject,
    error,
    response,
    body,
  } = data
  if (!error && response.statusCode == 200) {
    resolve(body)
  } else {
    reject(new Error(error))
  }
}

export function get (url, params = {}, config = {}) {
  let request = new Promise((resolve, reject) => {
    Request.get({
      url: url,
      qs: {
        t: Date.now(),
        access_token,
        ...params,
      },
      json: true,
      headers: {
        ...defaultHeaders,
        ...(config.headers || {}),
        'Authorization': 'Bearer ' + access_token,
      },
    }, (error, response, body) => {
      checkRespon({
        resolve,
        reject,
        error,
        response,
        body,
      })
    })
  })
  return request
}


export function post (url, params = {}, config = {}) {
  let request = new Promise((resolve, reject) => {
    Request.post({
      url: url,
      headers: {
        ...defaultHeaders,
        ...(config.headers || {}),
        'Authorization': 'Bearer ' + access_token,
      },
      form: {
        t: Date.now(),
        ...params,
      },
      json: true,
    }, (error, response, body) => {
      checkRespon({
        resolve,
        reject,
        error,
        response,
        body,
      })
    })
  })
  return request
}

export function payload (url, params = {}, config = {}) {
  let request = new Promise((resolve, reject) => {
    let requestData = {
      t: Date.now(),
      ...params,
    }

    Request({
      url: url,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + access_token,
        ...(config.headers || {}),
      },
      body: requestData,
      json: true,
    }, (error, response, body) => {
      checkRespon({
        resolve,
        reject,
        error,
        response,
        body,
      })
    })
  })
  return request
}

let install = false
// 对axios的实例重新封装成一个plugin ,方便 Vue.use(xxxx)
exportDefault.install = function (Vue) {
  if (install) {
    return
  }
  install = true
  let apiArray = [
    {
      key: '$get',
      value: get,
    },
    {
      key: '$post',
      value: post,
    },
    {
      key: '$payload',
      value: payload,
    },
  ]

  apiArray.forEach((item) => {
    Object.defineProperty(Vue.prototype, item.key, {value: item.value})
  })
}
export default exportDefault

```
