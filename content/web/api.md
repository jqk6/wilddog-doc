/*
Title: API文档
Sort: 3
*/


# Wilddog

## new Wilddog()

###### 定义

new Wilddog ( wilddogUrl )

###### 说明

初始化一个Wilddog客户端。


###### 参数

* wilddogUrl `string`
  应用url 如：`https://<appId>.wilddogio.com`

###### 返回值

* Wilddog 对象的引用

###### 示例

```js

ref = new Wilddog("http://<appId>.wilddogio.com/city/Beijing");

//Good, 我们已经创建了一个野狗客户端。

```

----

## authWithCustomToken()
 
###### 定义

authWithCustomToken ( token , oncomplete )

###### 说明

使用一个认证的token或超级密钥进行登录。


* token `string`
token 可以是一个Wilddog 超级密钥，或由密钥生成的token。

* oncomplete `function(err,auth)` 
如果操作成功`err` 为null,`auth`为包含用户登录认证信息的对象；如果不成功 `err` 是一个包含 `code` 的对象，`auth` 为 `null`。
  

###### 示例

```js

var ref = new Wilddog("https://<appId>.wilddogio.com");

ref.authWithCustomToken("AUTH_TOKEN", function(error, authData) {

  if (error) {

    console.log("Login Failed!", error);

  } else {

    console.log("Authenticated successfully with payload:", authData);

  }

});

```


----

## authAnonymously()

###### 定义

authAnonymously ( oncomplete )

###### 说明

匿名登录你的应用

###### 参数

* oncomplete `function(err,auth)` 
如果操作成功`err` 为null,`auth`为包含用户登录认证信息的对象；如果不成功 `err` 是一个包含 `code` 的对象，`auth` 为 `null`。

###### 示例

```js

var ref = new Wilddog("https://<appId>.wilddogio.com");

ref.authWithAnonymously(

  function(err,data){

    if(err == null){

      console.log("auth success!");

    } else {

       console.log("auth failed,msg:",err);

    }

  }

);

```

----

## authWithPassword()


###### 定义

authWithPassword ( credentials , oncomplete )

###### 说明

通过邮箱密码登录你的应用。使用此方法前，必须进入"终端用户认证"页面，开启"野狗默认用户数据库"。


###### 参数

* credentials `object`

  包含用户认证信息的数据,包括`email` `password` (eg.`{"email":<email>,"password":<password>}`)。


* oncomplete `function(err,auth)`
如果操作成功`err` 为null,`auth`为包含用户登录认证信息的对象；如果不成功 `err` 是一个包含 `code` 的对象，`auth` 为 `null`。


###### 示例

```js

var ref = new Wilddog("https://<appId>.wilddogio.com");

ref.authWithPassword({email:"Loki@asgard.com",password:"examplepassword"},

  function(err,data){

    if(err == null){

      console.log("auth success!");

    } else {

      console.log("auth failed,msg:",err);

    }

  }
});

```
----

## authWithOAuthPopup()

###### 定义

authWithOAuthPopup ( provider , oncomplete )

###### 说明

通过oauth弹框方式登录你的应用。
调用`authWithOAuthPopup` ,页面将弹出OAuth认证页,用户在页面进行认证操作,此过程中的任何数据都不会经过第三方 (包括Wilddog 服务),而且全部采用https 访问,因此安全可靠。当认证结束后弹框页自动关闭,用户完成登录。

###### 参数
* provider `string`
  第三方OAuth平台,包括"weibo"，"weixin"，"weixinmp"(微信公众账号)，"qq" 等。 
 
* oncomplete `function(err,data)`
  回调函数，认证过程结束后会被Wilddog客户端调用。如果认证失败,`err` 参数是一个`Error`对象，包含错误信息；如果认证成功，`err`为`null`，`data` 为包含认证信息的对象。`data`中的认证信息包括以下字段：

|字段|类型|说明 |
|---|---|---|
|uid|string|用户唯一ID|
|provider |string|  第三方OAuth平台,包括"weibo"，"weixin"，"weixinmp"(微信公众账号)，"qq" 等。|
|auth|object|包括token,payload |
|expires | Number | OAuth过期时间,使用 unix时间戳表示 |

###### 示例


```js

var ref = new Wilddog("https://<appId>.wilddogio.com");

ref.authWithOAuthPopup("weixin",function(err,auth){

  function(err,data){

    if(err == null){

      console.log("auth success!");

    } else {

      console.log("auth failed,msg:",err);

    }

  }	
})

```

----

## authWithOAuthRedirect()

###### 定义

authWithOAuthRedirect ( provider , oncomplete )

###### 说明

通过OAuth跳转方式登录你的应用。
调用`authWithOAuthRedirect` ,页面跳转到 OAuth认证也,用户在页面进行认证操作,此过程中的任何数据都不会经过第三方 (包括Wilddog 服务),而且全部采用https 访问,因此安全可靠.当认证结束页面跳转回最初页面,认证结束。

###### 参数

* provider `string`
  第三方OAuth平台,包括"weibo"，"weixin"，"weixinmp"(微信公众账号)，"qq" 等。 
 
* oncomplete `function(err,data)`
  回调函数，认证过程结束后会被Wilddog客户端调用。如果认证失败,`err` 参数是一个`Error`对象，包含错误信息；如果认证成功，`err`为`null`，`data` 为包含认证信息的对象。`data`中的认证信息包括以下字段：

|字段|类型|说明 |
|---|---|---|
|uid|string|用户唯一ID|
|provider |string|  第三方OAuth平台,包括"weibo"，"weixin"，"weixinmp"(微信公众账号)，"qq" 等。|
|auth|object|包括token,payload |
|expires | Number | OAuth过期时间,使用 unix时间戳表示 |

###### 示例

```js

var ref = new Wilddog("https://<appId>.wilddogio.com");

ref.authWithOAuthPopup("weixin",function(err,auth){

  function(err,data){

    if(err == null){

      //will never be here,as the page redirect

    } else {

      console.log("auth failed,msg:",err)

    }

  }	
})

```

----

## authWithOAuthToken()

###### 定义

authWithOAuthToken ( provider , accessToken , oncomplete )

###### 说明


通过accessToken直接登录你的应用。
如果用户已经拿到accessToken,可以通过此接口直接进行登录。

###### 参数

* provider `string` 
  第三方OAuth平台,包括"weibo"，"weixin"，"weixinmp"(微信公众账号)，"qq" 等。 

* accessToken 	`string`
 oauth2.0 的access token	

* oncomplete `function(err,data)`
  回调函数，认证过程结束后会被Wilddog客户端调用。如果认证失败,`err` 参数是一个`Error`对象，包含错误信息；如果认证成功，`err`为`null`，`data` 为包含认证信息的对象。`data`中的认证信息包括以下字段：

|字段|类型|说明 |
|---|---|---|
|uid|string|用户唯一ID|
|provider |string|  第三方OAuth平台,包括"weibo"，"weixin"，"weixinmp"(微信公众账号)，"qq" 等。|
|token |string |wilddog 认证token，用来认证这个客户端 |
|auth|object|包括token,payload |
|expires | Number | OAuth过期时间,使用 unix时间戳表示 |

###### 示例

```js

var ref = new Wilddog("https://<appId>.wilddogio.com");

ref.authWithOAuthToken("weixin", "<ACCESS-TOKEN>", function(error, authData) {

  if (error) {

    console.log("Login Failed!", error);

  } else {

    console.log("Authenticated successfully with payload:", authData);

  }

});


```

----

## getAuth()

###### 定义

getAuth()

###### 说明

同步返回当前Auth状态

###### 返回值

如果当前用户已经认证，返回一个对象，这个对象包含如下字段：

|字段|类型|说明 |
|---|---|---|
|uid|string|用户唯一ID|
|provider |string|  第三方OAuth平台,包括"weibo"，"weixin"，"weixinmp"(微信公众账号)，"qq" 等。|
|token |string |wilddog 认证token，用来认证这个客户端 |
|auth|object|包括token,payload |
|expires | Number | OAuth过期时间,使用 unix时间戳表示 |

###### 示例

```js

var ref = new Wilddog("https://<appId>.wilddogio.com");

var authData = ref.getAuth();

if (authData) {

  console.log("Authenticated user with uid:", authData.uid);

}

```

## onAuth()

###### 定义

onAuth ( onComplete , [context] ) 

###### 说明

监听客户端登录状态的变化。

###### 参数

* onComplete `function(auth)`
  回调函数，onAuth被调用时触发一次，之后每次状态发生改变都触发一次。如果当前客户端已经认证，`auth` 为包含认证信息的对象，包含如下字段：

|字段|类型|说明 |
|---|---|---|
|uid|string|用户唯一ID|
|provider |string|  第三方OAuth平台,包括"weibo"，"weixin"，"weixinmp"(微信公众账号)，"qq" 等。|
|token |string |wilddog 认证token，用来认证这个客户端 |
|auth|object|包括token,payload |
|expires | Number | OAuth过期时间,使用 unix时间戳表示 |


* context `object`
 如果指定，你的回调函数中的this将代表这个对象


###### 示例

```js

var ref = new Wilddog("https://<appId>.wilddogio.com");

ref.onAuth(function(authData) {

  if (authData) {

    console.log("Authenticated with uid:", authData.uid);

  } else {

    console.log("Client unauthenticated.");

  }
});

```

## offAuth()

###### 定义

offAuth ( onComplete , [context] )

###### 说明

取消对客户端认证状态变化的监听，是`onAuth`的逆操作。

###### 参数

* onComplete `function(auth)`
  调用`onAuth`时传入的函数。

* context `Object`
  调用`onAuth`时传入的对象

###### 示例

```js

var onAuthCallback = function(authData) {

  if (authData) {

    console.log("Authenticated with uid:", authData.uid);

  } else {

    console.log("Client unauthenticated.");

  }
};

// Attach the callback

ref.onAuth(onAuthCallback);

// Sometime later...

// Detach the callback

ref.offAuth(onAuthCallback);


```



----

## unauth()

###### 定义

unauth()

###### 说明

注销登录

###### 示例

```js

var ref = new Wilddog("https://<appId>.wilddogio.com");

// Sometime later...

// Unauthenticate the client

ref.unauth();

```

----

## child()

###### 定义

child ( path )

###### 说明


根据相对路径，来获取当前节点下子节点的引用

###### 参数

* path `String` 

path为相对路径，多层级间需要使用"/"分隔，例如“a/b”。如果path为空或null则返回当前引用。如果直接选取下一级节点，可以使用无分隔符(/)的节点名称表示，例如“a”。如果定位的path不存在，依然可以定位，后续数据操作的时候，将延迟动态创建不存在的路径节点。

###### 返回值

* `Wilddog`子节点的引用。



```js

var ref = new Wilddog("https://<appId>.wilddogio.com/city");

//ref refer to node <appId>.wilddogio.com/city

child_ref = ref.child('Beijing');

//now child_ref refer to "<appId>.wilddogio.com/city/Beijing"

```

----



## parent()

###### 定义

parent()

###### 说明

获取父节点的引用。如果当前节点就是root节点，方法执行后返回的依然是root节点的引用。

###### 返回值

* `String` Wilddog 父节点的引用

###### 示例

```js

var parent_ref = ref.parent();

//返回值 the refer to the father node of current

```

----

## root()

###### 定义

root()

###### 说明

获得`wilddog`根结点的引用

###### 返回值

* `String` wilddog根节点的引用

###### 示例

```js

var ref = new Wilddog("https://<appId>.wilddogio.com/city");

//ref refer to node <appId>.wilddogio.com/city

root_ref = ref.root('Beijing');

//now child_ref refer to "<appId>.wilddogio.com"

```


-----



## key()

###### 定义

key()

###### 说明

获得当前路径下节点的名称。

###### 返回值
* `String` 节点名称

###### 示例


```js

var ref = new Wilddog("https://<appId>.wilddogio.com/city/Beijing");

//返回值 the key to current node

var key = ref.key();

//key is 'Bejing'

```
----



## toString()

###### 定义

toString()

###### 说明
获取当前节点的应用URL。

###### 返回值

* `String` 当前节点的应用URL。

###### 示例

```js

var ref = new Wilddog("https://<appId>.wilddogio.com/city/Beijing");

//返回值 the key to current node

var url = ref.toString();

//url should be https://<appId>.wilddogio.com/city/Beijing

```
----


## set()

###### 定义

 set ( value , [oncomplete] )

###### 说明

设置一个节点的值。
如果`value != null` ,当前节点上的数据会被value覆盖，如果中间路径不存在,Wilddog 会自动将中间路径补全。如果`value == null`,效果等同于remove操作。

###### 参数

* value `object|string|number|boolean|null`
 将被写入的值。

* onComplete `function(err)` 
 如果操作成功 `err`为`null`；否则,err为包含错误码`code`的对象。

###### 示例

```js

var ref = new Wilddog("https://<appId>.wilddogio.com/city/Beijing");

//the initial value is {"temp":23,"humidity":30,"wind":2}

ref.set({"temp":10,"pm2.5":500});

//the expected value of https://<appId>.wilddogio.com/city/Beijing should be {"temp":10,"pm2.5":500}

```

----

## update()

###### 定义

update ( value , [onComplete] )

###### 说明

将输入对象的子节点合并到当前数据中。不存在的子节点将会被新增，存在子节点将会被替换。
与`set`操作不同,`update` 不会直接覆盖原来的节点,而是将`value` 中的所有子节点插入到已有的节点中,如果已有的节点中已经有同名子节点,则覆盖原有的子节点
e.g. update之前 `{"l1":"on","l3":"off"}` ,`value={"l1":"off","l2":"on"}` update 后期望的数据是 `{"l1":"off","l2":"on","l3":"off"}`。


###### 参数
* value `object`
  包含要合并子节点的对象

* onComplete `function(err)` 
 如果操作成功 `err`为`null`；否则,err为包含错误码`code`的对象。

###### 示例

```js

var ref = new Wilddog("https://<appId>.wilddogio.com/city/Beijing");

//the initial value is {"temp":23,"humidity":30,"wind":2}

ref.update({"temp":10,"pm2.5":500});

//the expected value of https://<appId>.wilddogio.com/city/Beijing should be {"temp":10,"pm2.5":500,"humidity":30,"wind":2}

```

----



## remove()

###### 定义

remove ( [onComplete] )

###### 说明

删除当前节点,效果等同于 `set(null,[onComplete])`,
如果父级节点只有当前节点一个子节点, 会递归删除父级节点。

###### 参数

* onComplete `function(err)` 
 如果操作成功 `err`为`null`；否则,err为包含错误码`code`的对象。

###### 示例

```js

//the initial value of https://<appId>.wilddogio.com is 

//{"city":{"Beijing":{"temp":23,"humidity":30,"wind":2}}}

var ref = new Wilddog("https://<appId>.wilddogio.com/city/Beijing");

ref.remove()

// value of https://<appId>.wilddogio.com is {}

```
----


## push()

###### 定义

push (value , [oncomplete] )

###### 说明

在当前节点下生成一个子节点，并返回子节点的引用。子节点的key利用服务端的当前时间生成，可作为排序使用。

###### 参数

* value `object|string|number|boolean|null`
  用户希望在当前节点下新增的数据.

* onComplete `function(err)` 
 如果操作成功 `err`为`null`；否则,err为包含错误码`code`的对象。

###### 返回值

* `String` 新插入子节点的引用

###### 示例

```js

var ref = new Wilddog("https://<appId>.wilddogio.com/users");

var childref = ref.push({"name":"Thor","planet":"Asgard"});

var newKey = childref.key();

//newKey shoud look like a base64-like series eg -JmRhjbYk73IFRZ7

var url = newKey.url()

//url shoud be https://<appId>.wilddogio.com/users/-JmRhjbYk73IFRZ7

```
--------


## setWithPriority()

###### 定义

setWithPriority ( value , priority , [oncomplete] )

###### 说明

把数据写到当前位置，类似set,不同之处是需要指定一个优先级。默认排序按照优先级排序。(参考[setPriority](#setPriority-))

###### 参数

* value `Object|String|Number|Boolean|Null`
 将被写入的值。

* priority `String|Number`
 优先级数据，节点的优先级是默认排序的依据。


* onComplete `function(err)` 
 如果操作成功 `err`为`null`；否则,err为包含错误码`code`的对象。


 
###### 示例

```js

var ref = new Wilddog("https://<appId>.wilddogio.com/users/jack");

var user = {

  name: {
    first: 'jack',
    last: 'Lee'
  }

};

ref.setWithPriority(user,100);

```


----

## setPriority()

###### 定义

setPriority ( priority , [onComplete] )

###### 说明

设置当前节点的优先级，优先级可以是`Number`,也可以是`String` 。用来改当前节点在兄弟节点中的排序位置。这个排序会影响Snapshot.forEach()的顺序，同样也会影响`child_added`和`child_moved`事件中`prevChildName`参数。

节点按照如下规则排序

* 没有priority的排最先

* 有数字 priority的次之，按照数值排序

* 有字符串 priority的排最后，按照字母表的顺序排列

* 当两个子节点有相同的 priority，它们按照名字进行排列，数字排在最先，字符串排最后




###### 参数

* priority `String|Number`
  优先级


* onComplete `function(err)` 
 如果操作成功 `err`为`null`；否则,err为包含错误码`code`的对象。

###### 示例

```js

var ref = new Wilddog("https://<appId>.wilddogio.com/users/jack");

ref.setPriority(1000);

```



## createUser()

###### 定义

createUser ( credentials , onComplete )

###### 说明

通过邮箱密码创建你的终端用户。使用此方法前，必须进入"终端用户认证"页面，开启"野狗默认用户数据库"。
通过`createUser` 注册的终端用户会托管在`Wilddog` 平台, 被注册的用户可以采用 `authWithPassword` 登录认证。

###### 参数

* credentials `object`
  包含用户认证信息的数据,包括`email` `password` (eg.`{"email":<email>,"password":<password>}`)。

* onComplete `function(err,data)`
  如果操作成功`err` 为`null`,`data`为包含用`id` ,`provider` 的对象；如果不成功 `err` 是一个包含 `code` 的对象。

###### 示例

```js

ref.createUser({email:"Loki@asgard.com",password:"examplepassword"},

  function(err,data){

  if(err!=null){

    //not success

  } else {

    //create user success

  }

});

```

----


## changePassword()

###### 定义

changePassword ( credentials , [onComplete] )

###### 说明

修改终端用户密码
Wilddog 平台托管的终端用户可以通过`changePassword`修改密码

###### 参数

* credentials `object`
  需要包含 `email` 邮箱 `oldPassword`旧密码 `newPassword` 新密码
	
* onComplete `function(err,data)`
  如果操作成功`err` 为`null`,`data`为包含`id` ,`provider` 的对象；如果不成功 `err` 是一个包含错误码`code` 的对象。


----

## changeEmail()

###### 定义

changeEmail ( credentials , onComplete )

###### 说明

修改终端用户登录邮箱。
`Wilddog` 平台托管的终端用户可以通过`changeEmail` 修改登录邮箱。

###### 参数

* credentials `object`
  需要包含 `oldEmail` 新邮箱 `newEmail`旧邮箱 `password` 密码
	
* onComplete `function(err)`
  回调函数,操作成功后会被调用,如果操作成功 `err`为`null` ,如果操作失败,`err` 是一个包含错误码`code` 的对象

----

## removeUser()

###### 定义

removeUser ( credentials , onComplete )

###### 说明

删除终端用户的帐号

Wilddog平台托管的终端用户可以通过`removeUser` 删除帐号

###### 参数
* credentials `object`
	包含  `email`，`password` 字段的对象。 
	
* onComplete `fucntion(err)`
	回调函数,操作成功后会被调用,如果操作成功 `err`为`null` ,如果操作失败,`err` 是一个包含错误码`code` 的对象


-----

## resetPassword

###### 定义

resetPassword ( credentials , onComplete )

###### 说明

重置终端用户的密码。
接口调用成功后并不会立刻重置密码,而是发一封邮件到此邮箱,终端用户通过该邮件的引导可完成重置密码操作。
Wilddog 平台托管的终端用户可以通过`resetPassword` 重置密码。

###### 参数

* credentials `object`
包含  `email`字段的对象
	
* onComplete `function(err)`
回调函数,操作成功后会被调用,如果操作成功 `err`为`null` ,如果操作失败,`err` 是一个包含错误码`code` 的对象


-----

## goOnline()

###### 定义

Wilddog.goOnline()

###### 说明

手动建立连接，开启自动重连。

###### 示例

```js

var ref = new Wilddog("https://<appId>.wilddogio.com/users");

Wilddog.goOffline(); // All local Wilddog instances are disconnected

Wilddog.goOnline(); // All local Wildodg instances automatically reconnect

```

-----

## goOffline()
###### 定义

Wilddog.goOffline()

###### 说明

手动断开连接，关闭自动重连。


###### 示例

```js

var ref = new Wilddog("https://<appId>.wilddogio.com/users");

Wilddog.goOffline(); // All local Wilddog instances are disconnected

```

-----



# Query

## on()
###### 定义

on ( type , callback , [cancelCallback] ， [context] )

###### 说明

监听某个事件,注册回调函数。

###### 参数

* type `String`

>|事件|说明|
|----|----|
|value| 当有数据请求或有任何数据发生变化时触发|
|child_added| 当有新增子节点时触发|
|child_changed|当某个子节点发生变化时触发 |
|child_removed|当有子节点被删除时触发 |
|child_moved|当有子节排序发生变化时触发 |


* callback `function(snapshot)` 
`snapshot`  为`Snapshot` 类型,当监听到某事件时callback 会被执行. 

* cancelCallback `function(err)`
如果操作失败，这个函数会被调用。传入一个 `Error` 对象，包含为何失败的信息。

* context `Object`
 如果指定，你的回调函数中的this将代表这个对象

###### 示例

```js

ref.on('child_added',function(snapshot){

  console.log(snapshot.val());

});

```
--------

## off()

###### 定义

off ( [type] , [callback] , [context] )

###### 说明

取消监听事件。取消之前用`on()`注册的回调函数。

###### 参数

* type `String`

  `value`,`child_added`,`child_changed`,`child_removed`,`child_moved`  之一

* callback `function(snapshot)` 

  `on()` 中被传入的函数

* context `Object`

  `on()` 中被传入的context


###### 示例

```js

var onValueChange = function(dataSnapshot) { /* handle... */ };

firebaseRef.on('value', onValueChange);

// Sometime later...

firebaseRef.off('value', onValueChange);

```
```js

var onValueChange = firebaseRef.on('value', function(dataSnapshot) { /* handle... */ });

// Sometime later...

firebaseRef.off('value', onValueChange);

```

------

## once()

###### 定义

once ( type , callback , [cancelCallbak] , [context] )

###### 说明

同on 类似,不同之处在于 once中的回调函数只被执行一次。

###### 参数

* type `String`

>|事件|说明|
|----|----|
|value| 当有数据请求或有任何数据发生变化时触发|
|child_added| 当有新增子节点时触发|
|child_changed|当某个子节点发生变化时触发 |
|child_removed|当有子节点被删除时触发 |
|child_moved|当有子节排序发生变化时触发 |


* callback `function(snapshot)` 
`snapshot`  为`Snapshot` 类型,当监听到某事件时callback 会被执行. 

* cancelCallback `function(err)`
如果操作失败，这个函数会被调用。传入一个 `Error` 对象，包含为何失败的信息。

* context `Object`
 如果指定，你的回调函数中的this将代表这个对象
###### 示例

```js

ref.once('child_added',function(snapshot){

  console.log(snapshot.val());

});

```

----


## orderByChild()

###### 定义

orderByChild ( key )

###### 说明

产生一个新`Query`对象，按照特定子节点的值进行排序

###### 参数

* key `String`

指定用来排序的子节点的key

###### 返回值

* 新生成的`Query` 对象的引用

###### 示例

```js

var ref = new Wilddog("https://<appId>.wilddogio.com/student");

ref.orderByChild("height").on("child_added",function(snapshot){

  console.log(snapshot.key() + "is" + snapshot.val().height +"meters tall");

});

```

----

## orderByKey()

###### 定义

orderByKey()

###### 说明

产生一个新`Query`对象，按照当前节点的key进行排序。

###### 返回值

* 新生成的`Query` 对象的引用

###### 示例


```js

var ref = new Wilddog("https://<appId>.wilddogio.com/student");

ref.orderByKey().on("child_added",function(snapshot){

  console.log(snapshot.key());

});

```

----

## orderByValue()

###### 定义

orderByValue()

###### 说明

产生一个新`Query`对象，按照当前节点的值进行排序

###### 返回值

* 新生成的`Query` 对象的引用

###### 示例

```js

var scoresRef = new Wilddog("https://<appId>.wilddogio.com/scores");

scoresRef.orderByValue().limitToLast(3).on("value", function(snapshot) {

  snapshot.forEach(function(data) {

    console.log("The " + data.key() + " score is " + data.val());

  });

}

```

----

## orderByPriority()

###### 定义

orderByPriority()

###### 说明

产生一个新`Query`对象，按照当前节点的优先级排序。


###### 返回值

* 新生成的`Query` 对象的引用。

###### 示例

```js

var ref = new Wilddog("https://<appId>.wilddogio.com/student");

ref.orderByPriority().on("child_added", function(snapshot) {

  console.log(snapshot.key());

});

```
----

## startAt()

###### 定义

startAt ( value , [key] )

###### 说明

创建一个大于等于的范围查询，可配合orderBy方式使用。

###### 参数

* value `String|Number|Null|Boolean` 

查询的起始值，类型取决于这个查询用到的 `orderBy*()`函数。如果与`orderByKey()` 组合的话，`value` 一定是一个`String`。

* key `String`

起始子节点的key，只有在 `orderByPriority()`时有效。


###### 返回值

新生成的`Query` 对象的引用。

###### 示例

```js

var ref = new Wilddog("https://<appId>.wilddogio.com/student");

ref.orderByKey().startAt('jack').on("child_added",function(snapshot){

  console.log(snapshot.key());

});


```

----

## endAt()

###### 定义

endAt ( value , [key] )

###### 说明

创建一个小于等于的范围查询，可配合orderBy方式使用。

###### 参数

* value `String|Number|Null|Boolean` 

查询的结束值，类型取决于这个查询用到的 `orderBy*()`函数。如果与`orderByKey()` 组合的话，`value` 一定时一个`String`。

* key `String`
起始子节点的key，只有在 `orderByPriority()`时有效。


###### 返回值

新生成的`Query` 对象

###### 示例


```js

var ref = new Wilddog("https://<appId>.wilddogio.com/student");

ref.orderByKey().endAt('jack').on("child_added",function(snapshot){

  console.log(snapshot.key());

});


```

----

## equalTo()

###### 定义

equalTo ( value , [key] )

###### 说明

创建一个等于的精确查询。

###### 参数

* value `String|Number|Null|Boolean` 

需要匹配的数值，类型取决于这个查询用到的 `orderBy*()`函数。如果与`orderByKey()` 组合的话，`value` 一定时一个`String`。

* key `String`

起始子节点的key，只有在 `orderByPriority()`时有效。


###### 返回值

新生成的`Query` 对象。

###### 示例

```js

var ref = new Wilddog("https://<appId>.wilddogio.com/student");

ref.orderByKey().equalTo('jack').on("child_added",function(snapshot){

  console.log(snapshot.key());

});


```

----

## limitToFirst()

###### 定义

limitToFirst ( limit )

###### 说明

创建一个新`Query`对象，获取从第一条（或startAt指定的位置）开始指定数量的子节点。

###### 参数

* limit `Number`

这次查询能够获取的子节点的最大数量。

###### 返回值

* 新生成的`Query` 对象的引用。

###### 示例

```js

var ref = new Wilddog("https://<appId>.wilddogio.com/student");

ref.orderByChild("height").limitToFirst(10).on("child_added",function(snapshot){

  console.log(snapshot.key());

});


```


----

## limitToLast()

###### 定义

limitToLast ( limit )

###### 说明

创建一个新`Query`对象，获取从最后一条（或endAt指定的位置）开始向前指定数量的子节点。

###### 参数

* limit `Number`

这次查询能够获取的子节点的最大数量。


###### 返回值

新生成的`Query` 对象的引用。



###### 示例

```js

var ref = new Wilddog("https://<appId>.wilddogio.com/student");

ref.orderByChild("height").limitToLast(10).on("child_added",function(snapshot){

  console.log(snapshot.key());

});


```

----

## ref()

###### 定义

ref()

###### 说明

获取这个查询的 `Wilddog` 引用

###### 返回值

* `Wilddog` 引用

###### 示例

```js

var ref = new Wilddog("https://<appId>.wilddogio.com/student");

var query=ref.orderByChild("height").limitToLast(10).on("child_added",function(snapshot){

  console.log(snapshot.key());

});

var locationRef=query.ref();//ref===locationRef

```

----


# Snapshot

Snapshot是当前时间,某个节点数据的副本,Snapshot不会随当前节点数据的变化而发生改变.
用户不会主动创建一个Snapshot,而是和 on或once 配合使用.

## val()

###### 定义

val()

###### 说明

返回当前快照的数据

###### 返回值 

* `object|string|null|number|boolean`
  当前快照的真实数据。

###### 示例


```js

ref = new Wilddog("https://<appId>.wilddogio.com/city/Beijing");

ref.on('child_changed',function(snapshot){

	console.log(snapshot.val());

	//should output {"PM2.5":432}

})

```

``` js

ref.update({"PM2.5":432})

```
----------



## child()



###### 定义

child ( path )

###### 说明

根据相对路径，来获取当前节点下子节点的快照。

###### 参数

* path `string`

path为相对路径，多层级间需要使用"/"分隔，例如“a/b”。
	

###### 返回值 

* 子节点的快照


###### 示例

```js

ref = new Wilddog("https://<appId>.wilddogio.com/city/Beijing");

ref.on('child_changed',function(snapshot){

	if(snapshot.type()=='null'){

		//has been deleted

	}

	else if(snapshot.type()=='object'){

		var pm25=snapshot.child('PM2.5');

		console.log("The pm2.5 of Bejing is",pm25.val())

	}

})


```
``` js

ref.update({"PM2.5":432})
```
-----

## forEach()

###### 定义

forEach ( callback )

###### 说明

遍历快照中每一个子节点,执行回调函数

###### 参数

* callback `function(key,data)`
  回调函数 `key` 当前子节点的key,`data` 当前子节点的value


###### 示例


``` js

ref = new Wilddog("https://<appId>.wilddogio.com/city/Beijing");

ref.on("value",function(snapshot){

		snapshot.forEach(function(key,data){

		console.log("the",k,"of Bejing is:",data);

     });

});

```
``` js

ref.update({"PM2.5":432})

```

----------------------------------------------------

## hasChild()

###### 定义

hasChild ( key )

###### 说明

检查是否存在某个子节点

###### 参数
* key 输入参数,关注子节点的key


###### 返回值 
* `boolean` 
	`true` 子节点存在
	`false` 子节点不存在

###### 示例

```js

ref = new Wilddog("https://<appId>.wilddogio.com/city/Beijing");

ref.on('child_changed',function(snapshot){

	if(snapshot.type()=='null'){

		//has been deleted

	}

	else if(snapshot.type()=='object'){

		if(snapshot.hasChild('PM2.5')){

			var pm25=snapshot.child('PM2.5');

			console.log("The pm2.5 of Bejing is",pm25.val());

		}
		
	}
})

```

``` js

ref.update({"PM2.5":432})

```


------------------------------------------------------------------------------------------

## key()

###### 定义

 key()

###### 说明

返回当前节点的key

###### 返回值 
* `string` 当前节点的key值

###### 示例

```js

ref = new Wilddog("https://<appId>.wilddogio.com/city/Beijing");

ref.on('child_changed',function(snapshot){

	if(snapshot.type()=='null'){

		//has been deleted

	}

	else if(snapshot.type()=='object'){

		if(snapshot.hasChild('PM2.5')){

			var pm25=snapshot.child('PM2.5');

			var key=snapshot.key();

			console.log("The ",pm25.key() ," of Bejing is",pm25.val());

		}
		
	}
})

```

--------------------------------------------------------------------------------------------

## numChildren()

###### 定义

numChildren()

###### 说明

返回当前节点中子节点的个数

###### 返回值 
* `string` 子节点的个数

---------------------------------------------------------------------------------------------

## ref()

###### 定义

ref()

###### 说明

返回当前Wilddog实例的引用
###### 返回值 
* 当前Wilddog实例的引用

###### 示例

```js

ref = new Wilddog("https://<appId>.wilddogio.com/city/Beijing");

ref.on('child_changed',function(snapshot){

	if(snapshot.type()=='null'){

		//has been deleted

	}

	else if(snapshot.type()=='object'){

		if(snapshot.hasChild('PM2.5')){

			var pm25=snapshot.child('PM2.5');

			var key=snapshot.key();

			var _ref=pm25.ref();

			if(pm25.val()>500){

				_ref.set(500);

			}
			
		}
		
	}
})

```

