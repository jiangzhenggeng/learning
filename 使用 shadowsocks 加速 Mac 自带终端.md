# 使用 shadowsocks 加速 Mac 自带终端

对于经常需要依赖国外资源的开发者，终端的下载速度让人抓狂，诸如常见的 wget、curl、git、brew 等命令行工具超慢，甚至无法获取资源，这就需要搭建一个科学上网利器，例如目前流行的shadowsocks，我们配置好 shadowsocks 服务器端后，安装对应系统的客户端便可，然而当你构建的时候还是会很慢，这时你发现系统自带的终端或 iTerm 2 是不走 Socks5 。

因在终端下不支持Socks5代理，只支持http代理，这就需要曲径通幽了。

在 Linux系统下相对简单，安装 proxychains-NG 等软件就可以解决了，但在Mac下有点麻烦。OS X 10.11之前的系统，都还比较顺利，但是OS X 10.11之后较新的系统默认设置下不会安装成功。苹果在新系统中加入了SIP安全机制，他会阻止第三方程序向系统目录内（/System，/bin，/sbin，/usr(除了/usr/local)）进行写操作，sudo也不行。办法是先把SIP关了，等装好软件配置好后再打开SIP。或者改用其他软件。

关闭SIP也麻烦，遂用privoxy这个经典软件，它刚好就是安装在/usr/local内，不需要关闭SIP也可以正常使用。

## privoxy安装和使用说明：

确保安装了 Homebrew

Mac OS 下不可或缺的套件管理器： Homebrew

### privoxy 安装

使用下面命令即可：
```shell
brew install privoxy
```
###privoxy 配置

因为是 Homebrew 方式安装的 privoxy，所以跟官方网站的使用方式不一样，请以此文为准。

打开配置文件 /usr/local/etc/privoxy/config
```shell
vim /usr/local/etc/privoxy/config
```
在 config 配置文件的最底部，手动加入以下代码：
```shell
listen-address 0.0.0.0:8118
forward-socks5 / localhost:1080 .
```
**或者用echo命令直接写入，执行以下命令：**
```shell
cd /usr/local/etc/privoxy/
echo 'listen-address 0.0.0.0:8118\nforward-socks5 / localhost:1080 .' >> config
```
**注意：0.0.0.0 可以让其他设备访问到，若不需要，请修改成用 127.0.0.1；8118是HTTP代理的默认端口；localhost:1080 是 SOCKS5（shadowsocks） 默认的地址，可根据需要自行修改，且注意不要忘了最后有一个空格和点号。**

### 启动 privoxy

因没有安装在系统目录内，所以启动的时候需要打全路径。
```shell
sudo /usr/local/sbin/privoxy /usr/local/etc/privoxy/config
```
查看是否启动成功
```shell
netstat -na | grep 8118
```
看到有类似如下信息就表示启动成功了

tcp4 0   0  \*.8118       \*.\*     LISTEN
**如果没有，可查阅日志信息，分析哪里出了问题。打开配置文件找到 logdir 配置项，查看log文件。**

终端里 privoxy 的使用

在命令行终端中输入如下命令后，该终端即可走代理。
```shell
export http_proxy='http://localhost:8118'
export https_proxy='http://localhost:8118'
```
**注意：是当前终端标签页走代理，其他终端标签页或新窗口则不是！**

### 取消命令：
```shell
unset http_proxy
unset https_proxy
```
如果关闭终端标签页或窗口，功能就会失效。

如果需要代理一直生效，则可以把上述两行代码添加到 ~/.bash_profile 文件最后。
```shell
vim ~/.bash_profile
```
```shell
export http_proxy='http://localhost:8118'
export https_proxy='http://localhost:8118'
```
使以上配置立即生效
```shell
source  ~/.bash_profile
```
如果使用zsh在这个.zshrc文件最后追加，然后
```shell
source  ~/.zshrc
```

### 测试
```shell
wget http://www.google.com/
```


