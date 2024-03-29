/*
Title: 概览
Sort: 1
Tmpl : page-guide
*/

## 野狗是什么？


使用野狗前，你可以遇到以下问题：

*  后端服务开发与运维困难，工程师难招。
*  对数据实时传输有需求，但是研发成本和难度很高。

使用野狗后：

*  无需编写后端代码，无需要租用服务器，更无需运维就可以开发移动应用、游戏或智能硬件。
*  快速实现设备间的数据实时推送。并且跨多个平台。


## 野狗的工作原理

<br>

为了理解起来更加简单，我们从一个较高的层次来看：

　野狗是一个云端NoSQL数据库，我们利用SDK将数据同步到各个设备终端。

<br>

![](/images/w1.png)

<br>

 野狗的SDK涵盖了Web，Android，iOS，IoT等平台。可以直接通过这些SDK对云数据库进行增删改查的需求。

<br>

![](/images/w2.png)

<br>

对云端数据库进行的修改会被立刻推送到其他终端。

![](/images/w4.png)

上图举的是一个物联网例子。野狗应用场景非常广泛。在线教育，O2O，游戏，移动APP都可以使用。
<br>



## 野狗特别的地方是？

我们特别为移动互联网和物联网进行了优化，满足不同网络情况下的使用。
<br>


<br>

![](/images/w3.png)

<br>


## 特性列表

### 产品特性

- １，提供云端NoSQL存储，支持索引和权限配置。
- ２，增加离线使用的功能。一旦网络从中断中恢复，立刻开始数据同步。
- ３，SDK上直接可以进行查询、排序。
- ４，提供云端计算表达式。
- ５，我们完全兼容Firebase，很多开源代码可以快速移植。
- ６，提供快捷第三方登录支持。开发应用时无需编写微博、微信、QQ登录。
- ７，提供终端用户登录、注册、找回密码的标准流程。
- ８，可自定义终端用户授权方式。
- ９，云端提供离线感知功能 (Disconnect Hook) 。一旦断线，服务器会执行用户期望代码。
- 10，提供UDP传输和CoAP应用层协议，使得在物联网应用中更加省电。
- 11，针对物联网设备，数据使用CBOR高压缩率格式，更加省内存和电量。

<br>

### 技术特性

- １，支持ＷebSocket与Http Long Polling。
- ２，C/嵌入式SDK支持CBOR与CoAP。
- ３，支持Android和iOS SDK。其他API逐步提供。
- ４，支持REST API与SSE推送。
<br>

### 工程特性

- １，成熟可靠的分布式数据库调度系统DBStorm。曾被大规模，长时间生产环境使用。
- ２，100%单元用例覆盖率。
- ３，持续集成构建。

<br>
### 安全特性

- １，用户间数据完全隔离。
- ２，2048-bit强制加密，支持TLS和DTLS。
- ３，对传输数据提供完整的前向加密和正向加密。
- ４，特有的TLS与DTLS优化技术。
- ５，野狗的SSL方面的安全获得SSLabs的A+评级。
- ６，HttpOnly、HSTS、CSRF_Token防范。
- ７，提供CORS跨域安全配置，有效防止JSONP注入。
- ８，数据存储在３个以上的数据库实例上。至少１份冷备．未来会进行多机房备份。
- ９．几乎完全隔离的生产环境。

<br>

### 硬件设施特性

- １，服务器自主托管到世纪互联机房。
- ２，使用优质的BGP九线带宽，机房位于北京骨干网交换点。
- ３，全部采用戴尔最新发布的13代高性能服务器。
- ４，数据库服务器使用SAS+SSD混合硬盘。
- ５，全新Raid卡、Broadcom 5720千兆网卡


## 如何开始
* 如果你是web开发者，请参考我们的 [5分钟快速入门](https://z.wilddog.com/5m)，或者 [Javascript SDK 快速入门](https://z.wilddog.com/web/quickstart)。
* 如果是你Android开发者，请参考我们的 [Android SDK 快速入门](https://z.wilddog.com/android/quickstart)
* 如果你是iOS开发者，请参考我们的 [iOS SDK 快速入门](https://z.wilddog.com/ios/quickstart)
* 关于终端用户认证和规则表达式，请参考 [规则表达式快速入门](https://z.wilddog.com/rule/quickstart)
