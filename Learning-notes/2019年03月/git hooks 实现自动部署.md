#背景
本地每次提交代码后，不想再在远程server 上git pull和重新运行一次项目。后者可以用到pm2的watch属性来自动重启项目，但是当git仓库有push的时候远程自动pull代码，就需要做点小工作了。
在我看了一堆讲不清楚的教程后了解到，一开始我觉得好神奇啊，凭什么我从本地提交代码到B服务器，A服务器就可以自动拉代码？而且脚本是写在B服务器上的。OK实际上是我sb了，更本不是这样的好吗，是在代码仓库和执行代码在同一台服务器上，当你推送代码到代码仓库时，执行一个脚本，就可以操作执行代码自动拉取仓库代码，并执行一些脚本操作重启服务啥的。

##方法一
简单原理就是，代码仓库和执行的项目代码在同一服务器

在服务器上创建一个裸仓库(git服务器上的远端仓库)

首先要在服务器上建立一个裸仓库，我存放裸仓库的文件夹是/data/gitbook，进入到该文件夹，然后使用git init –bare gitbook.git创建裸仓库。
在服务器上创建一个普通Git仓库

在服务器上建立一个普通Git仓库用于存放网站的源代码。(web服务器上的另一个本地仓库)
git clone /data/gitbook/springSummary.git

##配置Git Hook

进入到/data/gitbook.git/hooks文件夹，使用vi post-receive创建一个脚本，当你在本地仓库执行git push后就会触发post-receive。
post-receive的内容如下：

```bash
#!/bin/sh
//判断是不是远端仓库
IS_BARE=$(git rev-parse --is-bare-repository)
if [ -z "$IS_BARE" ]; then
echo >&2 "fatal: post-receive: IS_NOT_BARE"
exit 1
fi
unset GIT_DIR
DeployPath="你clone这个项目的目录"
echo "==============================================="
cd $DeployPath
echo "deploying the test web"
#git stash
#git pull origin master
git fetch --all
git reset --hard origin/master
// 执行些 shelll code you want
time=`date`
echo "web server pull at webserver at time: $time."
echo "================================================"

```
保存后赋予可执行权限
```bash
chmod +x /data/gitbook/hooks/post-receive
```

这样在开发者提交代码的时候，就会自动部署。

##方法二
git仓库(A)和执行代码仓库(B)不在同一个服务器时，我们需要发送通知来部署服务，接收通知使用的是express服务器(B)，发送通知的是webhook(A)，当push到git server(A)时发送通知到B。

在gogs项目后台添加一个webhook

node.js服务器
我用的是express，你想用啥用啥。无非就是接受webhook发出的请求。然后执行一段脚本
```js
var express = require('express');
var router = express.Router();
var child_process = require("child_process");
/* GET home page. */
// 网站首页接受 POST 请求
router.post('/', function (req, res) {
  var std = "Now deploying!"
    child_process.execFile("/data/pull.sh",[],{  // 脚本位置
      env : {
        PATH : process.env.PATH,
        HOME : process.env.HOME
      }
    },function(err,stderr,stdout){
      console.log(err,stderr,stdout);
    });
  res.send(std);
});
module.exports = router;
```
使用pm2 或者 forver来运行这个通知服务器

```bash
npm install -g forever
forever start bin/www
```
shell脚本

```bash
cd 项目路径
git pull
pm2 restart your-project
now it's worked
```
