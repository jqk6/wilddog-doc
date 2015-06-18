/*
Title: API文档
Sort: 3
*/

# Wilddog

## new Wilddog(wilddogUrl)
初始化一个Wilddog客户端
输入一个包含应用ID 和路径的url,初始化一个 Wildog 客户端

#### params

* wilddogUrl `string`

  关注节点url,Wilddog 中任何数据都能够通过一个url来进行访问


#### return
* Wilddog 对象引用

```js
ref = new Wilddog("http://weather-control.wilddogio.com/city/Beijing");
//Good, 我们已经创建了一个野狗客户端。
```

----

## authWithCustomToken(token,oncomplete)
使用一个合法的token进行登录

#### params

* token `string`

  已有的合法token,token 可以是一个Wilddog 超级密钥，或由密钥生成的token。

* oncomplete `function(err,auth)` 

如果操作成功`err` 为null,如果不成功 `err` 是一个包含 `code` 的对象 。否则`err`为`null`， `auth`为包含用户认证信息的对象
  
```js
var ref=new Wilddog("https:<YOUR_APP>.wilddogio.com");
ref.authWithCustomToken("AUTH_TOKEN", function(error, authData) {
  if (error) {
    console.log("Login Failed!", error);
  } else {
    console.log("Authenticated successfully with payload:", authData);
  }
});

```


----

## authAnonymously(oncomplete)

匿名认证Wilddog

#### params

* oncomplete `function(err,auth)` 
  如果操作成功`err` 为null,如果不成功 `err` 是一个包含 `code` 的对象 。否则`err`为`null`， `auth`为包含用户认证信息的对象

```js
var ref=new Wilddog("https:<YOUR_APP>.wilddogio.com");
ref.authWithAnonymously(
  function(err,data){
    if(err==null){
      console.log("auth success!")
    }else{
       console.log("auth failed,msg:",err)
    }

  }

);

```

----

## authWithPassword(credentials,oncomplete)

通过邮箱密码认证


#### params

* credentials `object`

  包含用户认证信息的数据,通常包含`email` `password` (eg.`{"email":<email>,"password":<password>}`)


* oncomplete `function(err,auth)`
 
  如果操作成功`err` 为null,如果不成功 `err` 是一个包含 `code` 的对象 。否则`err`为`null`， `auth`为包含用户认证信息的对象

```js
var ref=new Wilddog("https:<YOUR_APP>.wilddogio.com");
ref.authWithPassword({email:"Loki@asgard.com",password:"examplepassword"},
  function(err,data){
    if(err==null){
      console.log("auth success!")
    }else{
      console.log("auth failed,msg:",err)
    }

  }
});
```
----

## authWithOAuthPopup(provider,oncomplete);
通过oauth弹框流程认证
调用`authWithOAuthPopup` ,页面将弹出OAuth认证页,用户在页面进行认证操作,此过程中的任何数据都不会经过第三方 (包括WILDDOG 服务),而且全部采用https 访问,因此安全可靠.当认证结束后弹框页自动关闭,wilddog 客户端认证完毕.

#### params
* provider `string`

  oauth服务的提供平台,e.g.`"weibo"` 
 
* oncomplete `function(err,auth)`

  回调函数，认证过程结束后会被Wilddog客户端调用,会有两个参数传递,`err`和`auth`。如果认证失败,`err` 参数是一个`Error`对象，包含错误信息。如果认证成功，`err`为null，`auth` 为包含认证信息的对象。其中包含 `uid`(用户唯一ID),`provider`(表示用户提供者的字符串),`auth`(token，payload),和 expires(过期时间，unix事件戳)





```js
var ref=new Wilddog("https:<YOUR_APP>.wilddogio.com");
ref.authWithOAuthPopup("weixin",function(err,auth){
  function(err,data){
    if(err==null){
      console.log("auth success!")
    }else{
      console.log("auth failed,msg:",err)
    }

  }	
})

```

----

## authWithOAuthRedirect(provider,oncomplete)
通过OAuth跳转流程认证
调用`authWithOAuthPopup` ,页面跳转到 OAuth认证也,用户在页面进行认证操作,此过程中的任何数据都不会经过第三方 (包括WILDDOG 服务),而且全部采用https 访问,因此安全可靠.当认证结束页面跳转回最初页面,认证结束


#### params
* provider `string`  
 oauth服务的提供平台,e.g.`"weibo"` 

* oncomplete `function(err,auth)`
  如果操作成功`err` 为null,如果不成功 `err` 是一个包含 `code` 的对象 。如果认证成功，则不会被调用

```js
var ref=new Wilddog("https:<YOUR_APP>.wilddogio.com");
ref.authWithOAuthPopup("weixin",function(err,auth){
  function(err,data){
    if(err==null){
      //will never be here,as the page redirect
    }else{
      console.log("auth failed,msg:",err)
    }

  }	
})

```

----

## authWithOAuthToken(provider,accessToken,oncomplete)
通过accessToken直接认证
如果用户已经拿到accessToken,可以通过此接口直接进行认证

#### param

* provider `string`  
 oauth服务的提供平台,e.g.`"weibo"`

* accessToken 	`string`
 oauth2.0 的access token	

* oncomplete `function(err,auth)`
  回调函数，认证过程结束后会被Wilddog客户端调用,会有两个参数传递,`err`和`auth`。如果认证失败,`err` 参数是一个`Error`对象，包含错误信息。如果认证成功，`err`为null，`auth` 为包含认证信息的对象。其中包含 `uid`(用户唯一ID),`provider`(表示用户提供者的字符串),`auth`(token，payload),和 expires(过期时间，unix事件戳)

```js
var ref=new Wilddog("https:<YOUR_APP>.wilddogio.com");
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

同步返回当前Auth状态

#### return

如果当前用户已经认证，返回一个对象，这个对象包含`uid`(用户唯一ID),`provider`(表示用户提供者的字符串),`auth`(token，payload),和 expires(过期时间，unix事件戳)
**authData**

|字段|类型|描述|
|----|----|----|
|uid |string|用户的唯一标示 |
|provider |string| 认证提供着标示 |
|token |string |wilddog 认证token，用来认证这个客户端 |
|expires|number |过期时间 |
|auth|object |auth对象的内容，对应Wilddog安全规则 中的Auth对象 |

```js
var ref=new Wilddog("https:<YOUR_APP>.wilddogio.com");
var authData = ref.getAuth();
if (authData) {
  console.log("Authenticated user with uid:", authData.uid);
}

```

## onAuth(onComplete,[context])
监听客户端认证状态改变

#### params

* onComplete `function(auth)`

  回调函数，onAuth被调用时触发一次，之后每次状态发生改变都触发一次。如果当前客户端已经认证，`auth` 为包含认证信息的对象。其中包含 `uid`(用户唯一ID),`provider`(表示用户提供者的字符串),`auth`(token，payload),和 expires(过期时间，unix事件戳)，否则，`auth`为`null`

* context `object`

 如果指定，你的回调函数中的this将指向这个参数


```js
var ref=new Wilddog("https:<YOUR_APP>.wilddogio.com");

ref.onAuth(function(authData) {
  if (authData) {
    console.log("Authenticated with uid:", authData.uid);
  } else {
    console.log("Client unauthenticated.")
  }
});

```

## offAuth(onComplete,[context])

取消监听客户端认证状态，是`onAuth`的逆操作

#### params

* onComplete `function(auth)`

  `onAuth`传入的对象

* context `Object`

  `onAuth`时传入的对象

```js
var onAuthCallback = function(authData) {
  if (authData) {
    console.log("Authenticated with uid:", authData.uid);
  } else {
    console.log("Client unauthenticated.")
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

取消认证

```js
var ref=new Wilddog("https://YOUR_APP.wilddogio.com");
// Sometime later...
// Unauthenticate the client
ref.unauth();

```

----

## child(key)

返回当前节点的子节点的引用

#### params

* key 

  子节点名,可以是相对当前节点的路径.

#### return

子节点的引用



```js
var ref = new Wilddog("https://weather-control.wilddogio.com/city");
//ref refer to node weather-control.wilddogio.com/city
child_ref = ref.child('Beijing');
//now child_ref refer to "weather-control.wilddogio.com/city/Beijing"
```

----



## parent()

返回父节点的引用

#### return

 父节点的引用

```js
var parent_ref = ref.parent();
//return the refer to the father node of current
```

----

## root()

获得wilddog根结点的引用

#### return

wilddog根节点的引用

```js
var ref = new Wilddog("https://weather-control.wilddogio.com/city");
//ref refer to node weather-control.wilddogio.com/city
root_ref = ref.root('Beijing');
//now child_ref refer to "weather-control.wilddogio.com"
```


-----



## key()

获取当前路径的最后一部分

#### return
* 当前路径的最后一部分


```js

var ref = new Wilddog("https://weather-control.wilddog.com/city/Beijing");
//return the key to current node
var key = ref.key();
//key is 'Bejing'

```
----



## toString()
获取当前节点的url

#### return
当前节点的url

```js

var ref = new Wilddog("https://weather-control.wilddog.com/city/Beijing");
//return the key to current node
var url = ref.toString();
//url should be https://weather-control.wilddog.com/city/Beijing

```
----


## set(value,[oncomplete])
设置一个节点的值.并且同步到云端
如果`value != null` ,当前数据会被value覆盖.如果中间路径不存在,Wilddog 会自动将中间路径补全.如果`value == null`,删除当前节点,效果等同于 remove


#### params

* value `object|string|number|boolean|null`

  value 可以是对象,字符串,数字,null.当value 不为null,设置当前节点的值为value

* onComplete `function(err)` 

  如果操作成功 `err==null` 否则,err为包含code的`object`

```js
var ref = new Wilddog("https://weather-control.wilddogio.com/city/Beijing");
//the initial value is {"temp":23,"humidity":30,"wind":2}

ref.set({"temp":10,"pm2.5":500});
//the expected value of https://weather-control.wilddogio.com/city/Beijing should be {"temp":10,"pm2.5":500}
```

----

## update(value,[onComplete])

将输入对象的子节点合并到当前对象中

与`set`操作不同,`update` 不会直接覆盖原来的节点,而是将`value` 中的所有子节点插入到原来的节点中,如果原来的节点中已经有同名子节点,则覆盖原有的子节点
e.g. update之前 `{"l1":"on","l3":"off"}` ,`value={"l1":"off","l2":"on"}` update 后期望的数据是 `{"l1":"off","l2":"on","l3":"off"}`


#### params
* value `object`

  包含子节点对象的集合

* onComplete `function(err)` 

  如果操作成功 `err==null` 否则,err为包含code的`object`

```js
var ref = new Wilddog("https://weather-control.wilddogio.com/city/Beijing");
//the initial value is {"temp":23,"humidity":30,"wind":2}

ref.update({"temp":10,"pm2.5":500});
//the expected value of https://weather-control.wilddogio.com/city/Beijing should be {"temp":10,"pm2.5":500,"humidity":30,"wind":2}

```

----



## remove([onComplete])

删除一个节点,效果等同于 `set(null,[onComplete])`,
如果父级节点只有当前节点一个子节点, 会递归删除父级节点


#### params

* onComplete `function(err)` 

  如果操作成功 `err==null` 否则,err为包含code的`object`


```js
//the initial value of https://weather-control.wilddogio.com is 
//{"city":{"Beijing":{"temp":23,"humidity":30,"wind":2}}}
var ref = new Wilddog("https://weather-control.wilddogio.com/city/Beijing");
ref.remove()

// value of https://weather-control.wilddogio.com is {}

```
----


## push(value,[oncomplete])

在当前节点下新增一个节点,节点的`key` 自动生成,节点的数据是传入的参数 value

#### params

* value `object|string|number|boolean|null`

  用户希望在当前节点下新增的数据.

* onComplete `function(err)` 

  如果操作成功 `err==null` 否则,err为包含code的`object`

#### return

* 新插入子节点的引用


```js
var ref = new Wilddog("https://weather-control.wilddogio.com/users")
var childref = ref.push({"name":"Thor","planet":"Asgard"});
var newKey = childref.key();
//newKey shoud look like a base64-like series eg -JmRhjbYk73IFRZ7
var url = newKey.url()
//url shoud be https://weather-control.wilddogio.com/users/-JmRhjbYk73IFRZ7
```
--------


## setWithPriority(value,priority,[oncomplete])
把数据写到当前位置，类似set,不同之处是需要指定一个优先级。默认排序按照优先级排序。

#### params

* value `Object|String|Number|Boolean|Null`

  value 可以是对象,字符串,数字,null.当value 不为null,设置当前节点的值为value

* priority `String|Number`

  优先级数据

* onComplete `function(err)` 

  如果操作成功 `err==null` 否则,err为包含code的`object`



```js

var ref = new Wilddog("https://YOUR-APP.wilddogio.com/users/jack");

var user = {
  name: {
    first: 'jack',
    last: 'Lee'
  }
}
ref.setWithPriority(user,100)

```


----

## setPriority(priority,[onComplete])

设置当前数据的优先级数值，这个数值可以是`Number`,也可以是	`String` 。用来改当前节点在同一父节点下所有子节点的排序顺序。这个排序会影响Snapshot.forEach()的顺序，同样也会影响`child_added`和`child_moved`事件中`prevChildName`参数。

子节点按照如下规则排序

* 没有priority的排最先

* 有数字 priority的次之，按照数值排序

* 有字符串 priority的排最后，按照字母表的顺序排列

* 当两个子节点有相同的 priority，它们按照名字进行排列，数字排在最先，字符串排最后




#### params

* priority `String|Number`

  优先级数据


* onComplete `function(err)` 

  如果操作成功 `err==null` 否则,err为包含code的`object`

```js
var ref = new Wilddog("https://YOUR-APP.wilddogio.com/users/jack");
ref.setPriority(1000);

```

## transaction(updateFunction,[onComplete])

原子操作当前节点的数据。原子操作不同于set(),set操作是暴力的覆盖更新数据，不管数据在改变之前的值，而`transaction`操作是将当前值准备的更新为新值。确保不会跟其他客户端修改冲突。

调用这个接口，你需要传入一个 update函数，这个函数用来将旧数据更新为新数据。如果这个更新成功写入服务器之前，其他客户端也修改了相同位置上的数据。你的原子操作就会失败，客户端会自动再重试一次，直到成功或达到最大重试次数而失败。

如果你提供了onComplete回调函数，原子操作结束后会调用。

transaction操作在 需要原子操作的时候非常有用，比如 +1 操作。



#### params

* updateFunction `function(data)`

  开发者提供的函数，这个函数定义开发者希望当前的数据如何改变成新的数据。`data` 是当前节点现在数据。函数应该返回新的数据，如果函数不返回任何数据，客户端将不会做任何操作，任何数据都不会被修改。

* onComplete `function(err,commited,snapshot)`

  回调函数，transaction结束后会被调用。调用时会传入几个参数 `(err,commited,snapshot)`，如果操作失败，`err` 为一个包含错误信息的对象，否则`err`为`null`。`commited`是一个boolean值，表明原子操作是否已经成功提交，如果`updateFunction`没有返回任何数据，`commited`为`false`，因为没有任何数据被提交。`snapshot`指向最终的数据。

```js

// Increment Fred's rank by 1.
var ref = new Firebase('https://YOUR-APP.wilddogio.com/users/jack/rank');
ref.transaction(function(currentRank) {
   // If /users/fred/rank has never been set, currentRank will be null.
  return currentRank+1;
});

```

```js
var wilmaRef = new Wilddog('https://YOUR-APP.wilddogio.com/users/wilma');
wilmaRef.transaction(function(currentData) {
  if (currentData === null) {
    return { name: { first: 'Wilma', last: 'Flintstone' } };
  } else {
    console.log('User wilma already exists.');
    return; // Abort the transaction.
  }
}, function(error, committed, snapshot) {
  if (error) {
    console.log('Transaction failed abnormally!', error);
  } else if (!committed) {
    console.log('We aborted the transaction (because wilma already exists).');
  } else {
    console.log('User wilma added!');
  }
  console.log("Wilma's data: ", snapshot.val());
});

```
----

## createUser(credentials,onComplete)

通过邮箱注册用户

通过`createUser` 注册的终端用户会托管在`WILDDOG` 平台, 被注册的用户可以采用 `authWithPassword` 认证.

#### params
* credentials `object`

  包含用户认证信息的数据,通常包含`email` `password` 
(eg.`{"email":<email>,"password":<password>}`)

* onComplete `function(err,data)`

  如果操作成功`err` 为null,如果不成功 `err` 是一个包含 `code` 的对象 ,如果`err==null` data为包含用`id` ,`provider` 的 `object`


```js
ref.createUser({email:"Loki@asgard.com",password:"examplepassword"},
  function(err,data){
  if(err!=null){
    //not success
  }
  else{
    //create user success
  }
});
```

----


## changePassword(credentials,callback)

修改用户密码

`WILDDOG` 平台托管的用户可以通过`changePassword` 修改密码

#### params

* credentials `object`

  需要包含 `email` 邮箱 `oldPassword`旧密码 `newPassword` 新密码
	
* callback `function(err,data)`

  如果操作成功`err` 为null,如果不成功 `err` 是一个包含 `code` 的对象 ,如果`err==null` data为包含用`id` ,`provider` 的 `object`


----

## changeEmail(credentials,callback)

修改登录邮箱

`WILDDOG` 平台托管的用户可以通过`changeEmail` 修改登录邮箱

#### params

* credentials `object`

  需要包含 `oldEmail` 新邮箱 `newEmail`旧邮箱 `password` 密码
	
* callback `function(err)`

  回调函数,操作成功后会被调用,如果操作成功 `err==null` ,如果操作失败,`err` 是一个包含	`code` 的对象

----

## removeUser(credentials,callback)

删除帐号

`WILDDOG` 平台托管的用户可以通过`removeUser` 删除帐号

#### params
* credentials `object`
	需要包含  `email`邮箱 `password` 密码
	
* callback `fucntion(err)`
	回调函数,操作成功后会被调用,如果操作成功 `err==null` ,如果操作失败,`err` 是一个包含	`code` 的对象


-----

## resetPassword(credentials,callback)

重置密码

接口调用成功后并不会立刻重置密码,而是发一封邮件到此邮箱,用户通过该邮件的引导可完成重置密码操作
`WILDDOG` 平台托管的用户可以通过`resetPassword` 重置密码

#### param

* credentials `object`

  需要包含  `email`邮箱 
	
* callback `function(err)`

  回调函数,操作成功后会被调用,如果操作成功 `err==null` ,如果操作失败,`err` 是一个包含`code` 的对象


-----

## Wilddog.goOnline()

手动改变连接状态，开启自动重连

```js

var ref = new Wilddog("https://YOUR-APP.wilddogio.com/users");
Wilddog.goOffline(); // All local Wilddog instances are disconnected
Wilddog.goOnline(); // All local Wildodg instances automatically reconnect

```

-----

## Wilddog.goOffline()

手动断开连接，关闭自动重连

```js

var ref = new Wilddog("https://YOUR-APP.wilddogio.com/users");
Wilddog.goOffline(); // All local Wilddog instances are disconnected

```

-----



# Query

## on(type,callback,[cancelCallback]，[context])
监听某个事件,注册回调函数.
#### params

* type

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

 `callback` 中 `this` 指向的对象



```js
ref.on('child_added',function(snapshot){
  console.log(snapshot.val());
});
```
--------

## off([type],[callback],[context])

取消监听事件，取消 `on()` 注册的回调函数。




#### params

* type `String`

  `value`,`child_added`,`child_changed`,`child_removed`,`child_moved`  之一

* callback `function(snapshot)` 

  `on()` 中被传入的函数

* context `Object`

  `on()` 中被传入的context

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

## once(type,callback,[cancelCallbak],[context])

同on 类似,不同之处在于 once只被执行一次

#### params

* type

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

 `callback` 中 `this` 指向的对象


```js
ref.once('child_added',function(snapshot){
  console.log(snapshot.val());
});
```

----


## orderByChild(key)

产生一个新`Query`对象，按照指定的子节点的值进行排序

#### params

* key `String`

指定用来排序子节点的key

#### return

新生成的`Query` 对象

```js
var ref=new Wilddog("https://YOUR-APP.wilddogio.com/student");
ref.orderByChild("height").on("child_added",function(snapshot){
  console.log(snapshot.key() + "is" + snapshot.val().height +"meters tall");
});

```

----

## orderByKey()

产生一个新`Query`对象，按照key进行排序。

#### return

新生成的`Query` 对象


```js
var ref=new Wilddog("https://YOUR-APP.wilddogio.com/student");
ref.orderByKey().on("child_added",function(snapshot){
  console.log(snapshot.key());
});

```

----

## orderByValue()

产生一个新`Query`对象，按照子节点的值进行排序

#### return

新生成的`Query` 对象

```js

var scoresRef = new Wilddog("https://YOUR_APP.wilddogio.com/scores");
scoresRef.orderByValue().limitToLast(3).on("value", function(snapshot) {
  snapshot.forEach(function(data) {
    console.log("The " + data.key() + " score is " + data.val());
  });
}

```

----

## orderByPriority()

产生一个新`Query`对象，按照优先级排序


#### return

新生成的`Query` 对象

var ref=new Wilddog("https://YOUR-APP.wilddogio.com/student");
ref.orderByPriority().on("child_added", function(snapshot) {
  console.log(snapshot.key());
});

----

## startAt(value,[key])

创建一个 `Query` 对象，指定一个起点。

#### params

* value `String|Number|Null|Boolean` 

查询的起始值，类型取决于这个查询用到的 `orderBy*()`函数。如果与`orderByKey()` 组合的话，`value` 一定时一个`String`

* key `String`

起始子节点的key，只有在 `orderByPriority()`时有效


#### return

新生成的`Query` 对象

```js

var ref=new Wilddog("https://YOUR-APP.wilddogio.com/student");
ref.orderByKey().startAt('jack').on("child_added",function(snapshot){
  console.log(snapshot.key());
});


```

----

## endAt(value,[key])


创建一个 `Query` 对象，指定一个结束点。

#### params

* value `String|Number|Null|Boolean` 

查询的结束值，类型取决于这个查询用到的 `orderBy*()`函数。如果与`orderByKey()` 组合的话，`value` 一定时一个`String`

* key `String`

起始子节点的key，只有在 `orderByPriority()`时有效


#### return

新生成的`Query` 对象


```js

var ref=new Wilddog("https://YOUR-APP.wilddogio.com/student");
ref.orderByKey().endAt('jack').on("child_added",function(snapshot){
  console.log(snapshot.key());
});


```

----

## equalTo(value,[key])

创建一个 `Query` 对象,指定一个值，子节点必须与之匹配。

#### params

* value `String|Number|Null|Boolean` 

需要匹配的数值，类型取决于这个查询用到的 `orderBy*()`函数。如果与`orderByKey()` 组合的话，`value` 一定时一个`String`

* key `String`


#### return

新生成的`Query` 对象



```js

var ref=new Wilddog("https://YOUR-APP.wilddogio.com/student");
ref.orderByKey().equalTo('jack').on("child_added",function(snapshot){
  console.log(snapshot.key());
});


```

----

## limitToFirst(limit)

创建一个新`Query`对象，包含从从头（或startAt）开始特定数量的子节点

#### params

* limit `Number`

这次查询能够包含的子节点的最大数量

#### return

新生成的`Query` 对象

```js

var ref=new Wilddog("https://YOUR-APP.wilddogio.com/student");
ref.orderByChild("height").limitToFirst(10).on("child_added",function(snapshot){
  console.log(snapshot.key());
});


```


----

## limitToLast(limit)

创建一个新`Query`对象，包含从尾（或EndAt）开始特定数量的子节点

#### params

* limit `Number`

这次查询能够包含的子节点的最大数量


#### return

新生成的`Query` 对象

----

```js

var ref=new Wilddog("https://YOUR-APP.wilddogio.com/student");
ref.orderByChild("height").limitToLast(10).on("child_added",function(snapshot){
  console.log(snapshot.key());
});


```

## ref()

获取这个查询的 `Wilddog` 引用

#### return

`Wilddog` 引用
```js

var ref=new Wilddog("https://YOUR-APP.wilddogio.com/student");
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

返回当前快照的数据

#### return 

* `object|string|null|number|boolean`
  当前快照对应的数据

```js
ref = new Wilddog("https://weather-control.wilddogio.com/city/Beijing");
ref.on('child_changed',function(snapshot){
	console.log(snapshot.val());
	//should output {"PM2.5":432}
})

```

``` js
ref.update({"PM2.5":432})
```
----------



## child(key)

#### params
* key `string`
	

#### return 

```js
ref = new Wilddog("https://weather-control.wilddogio.com/city/Beijing");
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

## forEach(callback)
遍历快照中每一个子节点,执行回调函数
#### params
* callback `function(key,data)`
  回调函数 `key` 当前子节点的key,`data` 当前子节点的value

``` js
ref = new Wilddog("https://weather-control.wilddogio.com/city/Beijing");
ref.on("value",function(snapshot){
		snapshot.forEach(function(key,data){
			console.log("the",k,"of Bejing is:",data);
     });
});

```
``` js
ref.update({"PM2.5":432})
```

----------------------------------------------------------------------------------------

## hasChild(key)
检查是否存在某个子节点

#### params
* key 输入参数,关注子节点的key


#### return 
* `boolean` 
	`true` 子节点存在
	`false` 子节点不存在

```js
ref = new Wilddog("https://weather-control.wilddogio.com/city/Beijing");
ref.on('child_changed',function(snapshot){
	if(snapshot.type()=='null'){
		//has been deleted
	}
	else if(snapshot.type()=='object'){
		if(snap.hasChild('PM2.5')){
			var pm25=snapshot.child('PM2.5');
			console.log("The pm2.5 of Bejing is",pm25.val())
		}
		
	}
})
```

``` js
ref.update({"PM2.5":432})
```


------------------------------------------------------------------------------------------

## key()
返回当前节点的key

#### return 
* `string` 当前节点的key值

```js
ref = new Wilddog("https://weather-control.wilddogio.com/city/Beijing");
ref.on('child_changed',function(snapshot){
	if(snapshot.type()=='null'){
		//has been deleted
	}
	else if(snapshot.type()=='object'){
		if(snap.hasChild('PM2.5')){
			var pm25=snapshot.child('PM2.5');
			var key=snapshot.key()
			console.log("The ",pm25.key() ," of Bejing is",pm25.val())
		}
		
	}
})
```

--------------------------------------------------------------------------------------------

## numChildren()
返回子节点的个数

#### return 
* `string` 子节点的个数

---------------------------------------------------------------------------------------------

## ref()
返回当前Wilddog 实例的引用
#### return 
* 当前Wilddog 实例的引用

```js
ref = new Wilddog("https://weather-control.wilddogio.com/city/Beijing");
ref.on('child_changed',function(snapshot){
	if(snapshot.type()=='null'){
		//has been deleted
	}
	else if(snapshot.type()=='object'){
		if(snap.hasChild('PM2.5')){
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

