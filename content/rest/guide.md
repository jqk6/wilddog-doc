/*
Title: 开发向导
Sort: 1
Tmpl : page-guide
*/



## 第一步 安装与配置

####创建一个账号
首先，你需要注册一个Wilddog帐号，一个App会被创建，每一个App都有一个独立的域名 `<appid>.wilddogio.com`，你会使用这个url 进行存储和同步数据。
在你的Wilddog 控制台里，你可以实时对数据进行创建、管理、删除等操作，同时你可以创建规则表达式、管理授权系统、查看统计数据。

----

## 第二步 理解数据

####JSON树

所有的数据都保存为JSON对象，没有表和记录的概念。当你把数据添加到这棵json 树中，这些数据就变成这棵树的子树。例如，我们在`users/mchen/`下添加一个子节点`widgets`，我们的数据结构如下：

```json

{

  "users": {

    "mchen": {

      "friends": { "brinchen": true },

      "name": "Mary Chen",

      // 我们新增加的子节点会出现在已有的JSON树上

      "widgets": { "one": true, "three": true }

    },

    "brinchen": { ... },

    "hmadi": { ... }

  }
}
```
####引用Wilddog的URL
通过REST API读取和写入数据时，我们在`curl`请求中包含指向Wilddog数据仓库的URL，这个URL会指向我们存储的所有数据。在这个示例中，我们将使用`https://docs-examples.wilddogio.com/rest/data`这个地址。
Wilddog还提供了一个面板，用来展示可视化的数据，并提供用于完成简单管理任务的工具。本指南所有的数据都存储在`docs-examples`这个APP中，通过`https://docs-examples.wilddogio.com/rest/data`可以看到只读的数据面板。
同样也可以直接访问子节点的数据，例如，要访问Mary Chen的name，只需要在URL之后追加`users/mchen/name`即可。
```
curl https://docs-examples.wilddogio.com/web/data/users/mchen/name
```
同样的方式，可以直接通过在URL之后追加子节点路径的方式得到数据。

####Wilddog中的数组
Wilddog对数组不提供原生支持，如果我们想存储数组，实际上存储的是以数字作为key的对象。
```
// 我们发送的数据

['hello', 'world']

// wilddog存储的数据

{0: 'hello', 1: 'world'}

//然而，为了帮助用户存储数组，当数据通过val()或者REST API读取时，如果数据看起来像数组，Wilddog就会把数据转换为数组。特别地，如果数据的key值都是整数，并且超过一半是在0到最大值之间并且没有空值，那么Wilddog会将其转换为数组。这一部分要引起注意：

// 我们发送的数据

['a', 'b', 'c', 'd', 'e']

// wilddog保存的数据

{0: 'a', 1: 'b', 2: 'c', 3: 'd', 4: 'e'}

// 由于key是数字型，且是有序的

// 如果我们查询数据，会得到以下形式

['a', 'b', 'c', 'd', 'e']

// 但是，如果我们删除a、b、d

// 他们不再是有序的

// 我们不会再得到数组形式

{2: 'c', 4: 'e'}

```
当前没有办法改变或者阻止这种行为，理解这一点可以知道存储类似数组数据时什么能做什么不能做。
为什么不提供对数组的全支持呢？这是因为数组的索引不是永久的，不是id唯一的，并发编辑时是容易出问题的。
例如，假设两个用户通过远程服务器同时更新一个数组，用户A想要改变key为2的数值，用户B想要移动并改变它，那结果会出现错误。
下面是其中的一种情况：
```
// 初始数据

['a', 'b', 'c', 'd', 'e']

// 用户A将key为2的记录移动到位置5

// 用户B要删除key为2的记录

// 用户C将key为2的记录更新为foo

// 最理想的是以下的情况

['a', 'b', 'd', 'e']

// 实际发生的是以下的情况

['a', 'c', 'foo', 'b']

```
那什么时候可以使用数组呢？如果满足以下条件，可以在Wilddog中存储数组：
* 每次保证只有一个客户端写数据
* 要删除元素的时候，我们重新保存整个数组，而不是调用`.remove()`方法
* 特别注意根据数组索引更新内容的情况

####限制和约束
快速预览在进行数据存储、数据读取操作时的一些限制

 描述   |    限制    |    注意事项
---- 		| ---- 		| ----
树的深度	|	32	|
key长度		|	768 bytes	|	UTF-8编码,不能包含 . $ [ ] / 和ASCII控制字符
一个叶子节点的数据大小	|	10mb		|	UTF-8编码
通过SDK写入的数据大小限制	|		16mb	|		UTF-8编码
通过 REST 写入数据大小限制		|	256mb	| 				
一次能读取的节点	|    1亿	|


----

## 第三步 保存数据

####保存数据的方式

|  |  | 
| --- | --- | 
| PUT	|	写入或更新路径下的数据，如 `messages/users/user1/<data>`		| 
| PATCH	|	更新指定路径下的部分key值，但是不影响其他的数据		| 
| POST	|	在Wilddog数据库中增加一个节点，每次发送一个POST请求都会生成一个独一无二的ID，如`messages/users/<unique-id>/<data>`		| 
| DELETE	|	从指定的数据库引用中删除数据		| 

####使用PUT来写入数据
REST API基本的写入数据的操作是`PUT`。为了演示数据存储，我们将建立一个博客应用，应用的所有数据都存储在Wilddog应用对应的URl中 `https://docs-examples.wilddogio.com/rest/saving-data/wdblog`
下面来存储一些用户的数据到数据库中，我们存储每个用户独一无二的用户名，还存储全名和出生日期。由于用户名是独一无二的，所以适合使用`PUT`而不是`POST`方法，因为我们已经有作为key值的字段，不需要新建。

使用`PUT`方法，我们可以写入`string`, `number`, `boolean`,`array`或者任意的JSON对象到我们的数据库，这种情况下我们将传递一个对象：
```
curl -X PUT -d '{
  "alanisawesome": {
    "name": "Alan Turing",
    "birthday": "June 23, 1912"
  }
}' 'https://docs-examples.wilddogio.com/rest/saving-data/wdblog/users.json'
```
当一个JSON对象被存储到数据库中，对象的属性被自动映射到指定位置。如果我们导航到新添加的节点上，我们会看到值“Alan Turing”，我们也可以直接保存数据到子位置上：
```
curl -X PUT -d '"Alan Turing"' \
  'https://docs-examples.wilddogio.com/rest/saving-data/wdblog/users/alanisawesome/name.json'
curl -X PUT -d '"June 23, 1912"' \
  'https://docs-examples.wilddogio.com/rest/saving-data/wdblog/users/alanisawesome/birthday.json'
```

以上两个例子——针对同一个对象同时写入不同的子位置——将最终保存成一条数据。
```json
{

  "users": {

    "alanisawesome": {

      "date_of_birth": "June 23, 1912",

      "full_name": "Alan Turing"

    }

  }

}

```
一个成功的请求将返回200 OK状态码，并且响应中会包含存储到数据库中的数据。第一个例子仅仅触发一个事件，查看数据，而第二个例子将触发两个事件。注意，如果数据已经存在在用户的路径中，第一种方法是覆盖它，第二种方法只是修改每个子节点需要修改的值，保持其他子节点的值不变。在我们的JavaScript SDK中，`PUT`方法等效于`set()`方法。

####使用PATCH来更新数据
使用`PATCH`请求，我们可以更新具体的子节点而不覆盖已经存在的数据。使用`PATCH`请求添加Turing的nickname：
```
curl -X PATCH -d '{
  "nickname": "ACE"
}' \
  'https://docs-examples.wilddogio.com/rest/saving-data/users/alanisawesome.json'
```
上面的请求将`nickname`添加到`alanisawesome`对象而不删除`name`和`birthday`节点。注意，如果我们这里使用`PUT`请求，`name`和`birthday`将会被删除，因为他们没有出现在请求中。数据库中的数据如下：
```json

{

  "users": {

    "alanisawesome": {

      "date_of_birth": "June 23, 1912",

      "full_name": "Alan Turing",

      "nickname": "ACE"

    }

  }

}

```
一个成功的请求将返回200 OK状态码，并且响应中会包含更新到数据库中的数据。

####保存数据列表
为了给添加到数据库中的元素生成一个独一无二的、基于时间戳的key，我们可以使用`POST`请求。对于我们的`users`路径，定义我们自己的key是很有必要的，因为每个用户都有有一个独一无二的用户名。但是当用户和博客请求发送到应用时，我们可以使用`POST`请求自动生成key。
```
curl -X POST -d '{
  "author": "alanisawesome",
  "title": "The Turing Machine"
}' 'https://docs-examples.wilddogio.com/rest/saving-data/wdblog/posts.json'
```
我们的`posts`路径现在是下面的结构：
```json

{

  "posts": {

    "-JSOpn9ZC54A4P4RoqVa": {

      "author": "alanisawesome",

      "title": "The Turing Machine"

    }

  }

}

```
注意，`key-JSOpn9ZC54A4P4RoqVa`是自动生成的，因为我们使用的是`POST`请求。一个成功的请求将返回200 OK状态码，并且响应中会包含新数据的key name。
```
{"name":"-JSOpn9ZC54A4P4RoqVa"}
```

####删除数据
要删除Wilddog中的数据，我们可以发送`DELETE`请求到要删除数据对应的URL路径上。下面的命令将删除`users`路径上的`alanisawesome`：
```
curl -X DELETE \
  'https://docs-examples.wilddogio.com/rest/saving-data/users/alanisawesome.json'
```
一个成功的请求将返回200 OK状态码，和一个空的JSON

####URI参数
当向数据库写入数据时，REST API可以接受以下的参数：

`auth`

`auth`请求参数允许访问受Wilddog规则表达式保护的数据，并且支持所有的请求方式。对于Wilddog应用的安全密钥或者认证令牌的争论，我们将在用户认证章节介绍。下面的例子中我们发送一个包含`auth`参数的`POST`请求，认证凭证是Wilddog应用密钥或者认证令牌。
```
curl -X POST -d '{"Authenticated POST request"}' \
  'https://docs-examples.wilddogio.com/rest/saving-data/auth-example.json?auth=CREDENTIAL'
```

`print`

`print`参数可以让我们制定从Wilddog返回的响应的内容格式。把`print=pretty`添加我们的请求中将会返回易读的格式。`GET`、`PUT`、`POST`和`PATCH`请求都支持`print=pretty`参数。

####写入服务器数值
服务器数值可以通过带有单独`.sv`key的占位符来写入到指定位置。key的值就是我们期望的服务器数值类型。例如，当一个用户被创建的时候需要设置一个时间戳，我们应该如下操作：
```
curl -X PUT -d '{".sv": "timestamp"}' \
  'https://docs-examples.wilddogio.com/rest/saving-data/alanisawesome/createdAt.json'
```
时间戳是服务器数值唯一支持的，是从Unix纪元以来的毫秒数。

####提高写入性能
如果我们要向数据库写入大量的数据，我们可以使用`print=silent`参数来提高写入性能和减少带宽占用。在正常的写操作中，服务器使用已经写入到数据库中的JSON数据来响应。当指定了`print=slient`参数，服务器会在数据传输完后立即关闭连接来减少带宽占用。

如果我们需要发送大量的请求到数据库，我们可以在HTTPS请求头中添加`Keep-Alive`请求来重新连接。

####错误条件
REST API将在以下情况返回错误码

 |    |     | 
 | ----    |    ---- | 
 | 404 Not Found		|	通过HTTP请求而不是HTTPS请求 | 
 | 400 Bad Request		|	不能解析PUT或POST数据；丢失PUT或POST数据；PUT或POST数据过长；REST API调用路径中包含非法的子节点名字 | 
 | 417 Expectation Failed	|	REST API调用没有指定Wilddog名字 | 
 | 403 Forbidden		|	请求违反规则表达式 | 


####保护数据
Wilddog有一套安全规则表达式来让我们定义数据的不同节点的读写权限。详细介绍请参见保护你的应用。

---
## 第四步 检索数据

####使用`GET`命令读取数据
我们可以添加`GET`请求到URL的结束点来读取数据，让我们继续博客的示例，读取全部的博客数据。
```
curl 'https://docs-examples.wilddogio.com/rest/saving-data/wdblog/posts.json?print=pretty'
```
一个成功的请求将返回200 OK状态码，并且响应中会包含我们检索的数据。

####添加URI参数
当我们从数据库中读取数据的时候，REST API可以接受多个参数。下面是最常用的参数。想了解全部的参数，请参见REST API文档。

`auth`

`auth`请求参数允许访问受Wilddog规则表达式保护的数据，并且支持所有的请求方式。对于Wilddog应用的安全密钥或者认证令牌的争论，我们将在用户认证章节介绍。下面的例子中我们发送一个包含`auth`参数的`POST`请求，认证凭证是Wilddog应用密钥或者认证令牌。
```
curl -X POST -d '{"Authenticated POST request"}' \
  'https://docs-examples.wilddogio.com/rest/saving-data/auth-example.json?auth=CREDENTIAL'
```

`print`

指定`print=pretty`返回易读格式的数据。
```
curl 'https://samplechat.wilddogio-demo.com/users/jack/name.json?print=pretty'
```
指定`print=silent`返回204 No Content状态码
```
curl 'https://samplechat.wilddogio-demo.com/users/jack/name.json?print=silent'
```



####REST API流
Wilddog REST端点支持`EventSource / Server-Sent Events`协议，使得浏览数据变化变得容易起来。

想要开始浏览数据，我们需要做以下准备：
 1. 将客户端的接收头设置为`text/event-stream`
 2. 注意http跳转，特别是307状态码
 3. 如果数据禁止访问，需要添加`auth`参数

在响应中，服务器会在请求的URL改变的地方将命名的事件作为数据状态传送回来。消息的结构符合`EventSource`协议：
```
event: event name
data: JSON encoded data payload
```

服务器会返回以下的事件：

|     		|		     |
|   ----    |    ----   |
|   put		|	JSON编码的数据是有两个key的对象：路径和数据；路径指向请求URL的相对路径；客户端应该使用消息中包含的数据代替缓存中的数据   |
|   patch	|	JSON编码的数据是有两个key的对象：路径和数据；路径指向请求URL的相对路径；客户端应该使用消息中包含的key代替缓存中的key   |
| keep-alive	|	此事件没有数据，不对应操作   |
| cancel	|	此时间没有数据；如果Wilddog规则表达式中不允许读取数据，则该事件会被发送   |
|  auth_revoked	|	该事件的数据是字符串，表示认证过期；认证参数失效后，该事件将被发送   |

下面是服务器能够发送的事件示例：
```js

// 设置整个缓存为 {"a": 1, "b": 2}

event: put

data: {"path": "/", "data": {"a": 1, "b": 2}}

//将新数据放到key为c的缓存中，这样整个缓存是下面的结构

// {"a": 1, "b": 2, "c": {"foo": true, "bar": false}}

event: put

data: {"path": "/c", "data": {"foo": true, "bar": false}}

// 数据中的每个key，更新（或添加）响应的key到缓存的路径/c下

// 最终的缓存为: {"a": 1, "b": 2, "c": {"foo": 3, "bar": false, "baz": 4}}

event: patch

data: {"path": "/c", "data": {"foo": 3, "baz": 4}}

```

---
## 第五步 构建数据
构建结构合理的NoSQL存储需要有相当的远见卓识，最重要的是，我们需要理解数据以后是怎样被读取的，如何使这个过程尽可能的简单。

####避免嵌套
由于我们的数据支持嵌套32层，所以会很自然的认为这是默认结构。但是，当我们从数据库中取得一个节点的时候，我们需要检索该节点所有的子节点。在实践中，最好是保证数据的扁平，就像SQL中的表结构一样。思考一下下面的不良结构：
``` json
{

  // 一个不合理的数据结构, 因为遍历rooms得到的名字列表需要下载数百兆字节的数据

  "rooms": {

    "one": {

      "name": "room alpha",

      "type": "private",

      "messages": {

        "m1": { "sender": "mchen", "message": "foo" },

        "m2": { ... },

        // 非常长的消息列表

      }

    }

  }

}

```

这种嵌套的结构设计，使得数据遍历变得非常困难。哪怕是像列出房间的名字这种简单的操作，也需要将包含所有成员和分组的房间树下载到客户端。

####数据扁平化
如果数据被分割成各自不同的路径，就可以高效的下载需要的部分。考虑下面的扁平化结构：
```json
{

  // roooms只包含每个room的元数据，存储在每个唯一标识的room id节点之下

  "rooms": {

    "one": {

      "name": "room alpha",

      "type": "private"

    },

    "two": { ... },

    "three": { ... }

  },

  // room成员易于访问，我们页是按照room id来存储

  "members": {

    // 我们将讨论下面的指数

    "one": {

      "mchen": true,

      "hmadi": true

    },

    "two": { ... },

    "three": { ... }

  },

  // 消息被分开存储，这样我们可以更快的遍历，同时通过room ID我们也可以方便的分页、查询和组织

  "messages": {

    "one": {

      "m1": { "sender": "mchen", "message": "foo" },

      "m2": { ... },

      "m3": { ... }

    },

    "two": { ... },

    "three": { ... }

  }

}

```
现在可以仅仅需要下载每个房间几个字节的数据就可以遍历所有的房间，快速的获取元数据用来在用户界面显示。消息可以分别获取，立即展示，保持用户交互界面的反应速度。

####创建规模数据
在创建应用的过程中，很多时候我们优先选择只下载列表的一个子集，当列表包含数千条记录或者更多时，这种做法更为常见。当数据之间的关系是静态的，单向的时候，我们可以将子节点直接嵌套在其父节点之下：
``` json
{
  "users": {
    "john": {
       "todoList": {
          "rec1": "Walk the dog",
          "rec2": "Buy milk",
          "rec3": "Win a gold medal in the Olympics"
       }
    }
  }
}
```
通常数据之间的关系都是静态的，或者数据有必要是非规范化的。这可以通过查询子集列表来解决，正如我们在前面检索数据章节谈论的那样。

但这样仍然存在不足。例如，用户和分组之间是双向的关系，用户属于一个分组，分组中包含用户的列表。由于两者之间不能互相嵌套，首先想到的数据结构如下：
``` json
// 双向关系

{

  "users": {

    "mchen": { "name": "Mary Chen" },

    "brinchen": { "name": "Byambyn Rinchen" },

    "hmadi": { "name": "Hamadi Madi" }

  },

  "groups": {

    "alpha": {

       "name": "Alpha Tango",

       "members": {

          "m1": "mchen",

          "m2": "brinchen",

          "m3": "hamadi"

       }

    },

    "bravo": { ... },

    "charlie": { ... }

  }

}

```
良好的开始。但是当我们需要指导用户属于那些分组时，事情变得复杂起来。我们可以监控所有的分组，一旦发生变化就遍历一遍，但是这种方式是效率低下的。更糟的情况是，Mary没有查看所有分组的权限。当我们尝试获取所有的分组列表时，会返回一个禁止操作的错误。
一个良好的方式是只查询Mary所属的分组。这时候Mary所属分组的索引旧变得非常有用了：
``` json
// 索引追踪

{
  "users": {

    "mchen": {

      "name": "Mary Chen",

      // 简介中索引Mary的分组信息

      "groups": {

         // 这里的数据不重要，只是key存在

         "alpha": true,

         "charlie": true

      }

    },

    ...

  },

  "groups": { ... }

}

```
我们只能在Mary的记录和分组的记录中重复存储关系数据来解决这个问题吗？现在分组下面有mchen索引，Mary的配置中有alpha，如果要从分组中删除Mary，需要更新两个位置的数据吗？
是的。这是保存双向关系必要的冗余，这可以帮助我们快速高效的获取Mary对应的成员关系，即使是用户和分组的数据量达到百万，即使规则表达式中限制某些记录的读取。
点击这里尝试一个互动的例子，展示使用索引来引用数据清单。
为什么我们要将数据转化为以id作为主键，以`true`作为值呢？因为这样可以使我们仅通过读取`/users/mchen/groups/$group_id`看是否为`null`来检查主键。

---
## 第六步 理解规则表达式
Wilddog提供全套的工具来支持您管理自己应用的安全性。这些工具使得用户认证、加强用户权限、规范用户输入变得简单。

####概述
安全是一个重大的话题，通常来讲，安全是一个应用开发过程中困难的部分。Wilddog使得你管理自己应用的安全性变得简单。我们关注某些部分的全部安全性，比如管理用户的密码。我们无法处理的复杂事情，我们会将其简化。例如，我们提供一种声明式的语言来管理应用的安全性。

本部分将介绍如何在Wilddog上构建安全应用。Wilddog应用运行更多的客户端代码，所以，我们提供的保护安全的方式可能比您之前用过的要复杂一些。

####认证
用户id是一个非常重要的概念。不同的用户拥有不同的数据，试试也有不同的容量。例如，在聊天程序中，每条消息都与消息创建者有关，用户可以删除自己发送的消息，但是不能删除其他用户发送的消息。管理应用安全性的第一步就是唯一标示用户，这个过程称之为认证。
Wilddog提供工具使得认证更加简单：
 - 集成微博、微信、微信公众账号和QQ认证
 - 邮件&密码登陆和账户管理
 - 单次匿名登录
 - 自定义登陆令牌，集成您自己的认证服务或SSO

向导的下一部分，用户认证，将介绍如何实现身份认证

授权：
唯一标示用户只是安全性的一部分。一旦知道了用户身份，就需要控制用户访问数据库的权限。
Wilddog提供声明式的语言指定规则，这些规则运行在服务器上，控制您应用的安全性。您可以通过选择控制台的规则表达式来编辑他们。
这些规则表达式可以让你方便的控制数据的访问。应用到一个节点上的规则对其所有的子节点都起作用。
``` json
{

  "rules": 
    "foo": {

      ".read": true,

      ".write": false

    }

  }

}

```
这个例子允许所有的用户读取`/foo/`节点和其子节点的内容，但是不允许更改它们。

规则表达式包含许多的内建变量和函数，你可以使用这些变量和函数构建自己的规则表达式。这些变量和函数可以使规则表达式拥有充分的权利和良好的灵活性，可以参考其他路径，服务器端时间戳以及更多其他的参考。
最重要的内建变量是`auth`，用户认证通过后被赋值。其中包含相关数据和`auth.uid`，`auth.uid`是全局唯一的、字母数字标识符，工作于整个过程。`auth`变量是许多规则的基础。
``` json
{

  "rules": {

    "users": {

      "$user_id": {

        ".write": "$user_id === auth.uid"

      }

    }

  }

}

```
这条规则要求写入到`/foo/`节点的数据必须是小于100个字符的字符串。

验证规则可以访问所有的内建变量和函数，例如`.read`和`.write`规则。可以使用这些规则来创建新的验证规则，用来了解数据库中的其他数据，如用户标识，服务器时间等信息。
``` json
{

  "rules": {

    "user": {

      ".validate": "auth != null && newData.val() === auth.uid"

    }

  }

}

```
这条规则授权`user_id`匹配动态路径中的`$user_id`的用户访问`/users/<auth.uid>/`节点数据。


####数据验证
所有的应用都没有固定的数据库模式。这使得开发过程中进行的修改变得容易，但是一旦应用发布，就需要保持数据的一致性。规则表达式中包含`.validate`规则，用来指定声明式的验证规则，如`.read`和`.write`规则。唯一的不同就是验证规则没有级联。
``` json
{

  "rules": {

    "foo": {

      ".validate": "newData.isString() && newData.val().length < 100"

    }

  }

}

```
这条规则要求写入到`/foo/`节点的数据必须是小于100个字符的字符串。

验证规则可以访问所有的内建变量和函数，例如`.read`和`.write`规则。可以使用这些规则来创建新的验证规则，用来了解数据库中的其他数据，如用户标识，服务器时间等信息。
```json
{

  "rules": {

    "user": {

      ".validate": "auth != null && newData.val() === auth.uid"

    }

  }

}

```
这条规则要求只有当前登陆的用户可以写入`/user/`。

如果请求违反规则，则会返回错误。

验证规则并不是要取代应用中的验证代码，所以您最好还是要验证用户的输入，当用户离线时给予提示。

####了解更多
现在您已经对构建应用安全性有了粗略的了解。

规则表达式是一种有效且灵活控制应用访问权限的方式，该指南只涵盖了其中的一小部分，安全指南中会包含更详细的介绍，包含所有的内建函数、变量和特征，也包含示例讲解如何将它们应用于程序中。

您可以根据该指南不为应用编写综合规则，但是在您启动您的程序之前必须保证已经编写好规则。在您的应用正式使用之前指定一个安全性保护计划也是一个不错的选择，这样您只需要稍微重构一下您的数据就可以兼容这些规则。

---

