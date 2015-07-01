/*
Title: 快速入门
Sort: 0
Tmpl : page-quickstart
*/



## 第一步 创建账户和应用
首先注册并登陆Wilddog账号，进入 [控制面板](https://www.wilddog.com/dashboard)。在控制面板中，可以创建应用(App)。每个App都拥有一个独一无二的以`wilddogio.com`结尾的URL。在同步和存取数据的时候，我们将使用这个URL。

创建App成功后，Wilddog将为你初始化一个兼容JSON数据格式的树型数据库，之后你就可以操作这个数据库了。

----

## 第二步 保存&检索数据
我们可以在任何Wilddog的URL之后追加`.json`来作为REST的结束点发送标准的HTTPS请求。本指南中使用`curl`命令测试所有的示例。

REST API中最基本的写入操作是`PUT`，使用`PUT`请求向Wilddog引用写入数据，方式如下：
```
curl -X PUT -d '{ "alanisawesome": { "name": "Alan Turing", "birthday": "June 23, 1912" } }' 'https://docs-examples.wilddogio.com/rest/quickstart/users.json'

```

>必须是https。Wilddog只会响应加密的数据，所以你的数据是安全的。

请求成功会返回http状态码200 OK，响应中会包含我们写入Wilddog的数据。
```json

{

  "alanisawesome": {

    "birthday": "June 23, 1912",

    "name": "Alan Turing"

  }

}

```
----

现在你已经知道了REST API的基础知识，更多细节请参见 [开发向导](https://z.wilddog.com/rest/guide)。

