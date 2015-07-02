/*
Title: API文档
Sort: 4
*/


# Wilddog

## getParent()

###### 定义
Wilddog getParent()

###### 说明 
获取父节点的引用。如果当前节点就是root节点，方法执行后返回的依然是root节点的引用。

###### 返回值
`Wilddog` 父节点的引用

###### 示例
```java
Wilddog ref = new Wilddog("https://<appId>.wilddogio.com/test/a");

// 获得'/test' 路径的引用

Wilddog ref2 = ref.getParent();

// 到达root

Wilddog ref3 = ref.getParent().getParent();

```
----

## child()

###### 定义
Wilddog child(String path)

###### 说明
根据相对路径，来获取当前节点下子节点的引用。

###### 参数
* path `String`
path为相对路径，多层级间需要使用"/"分隔，例如“a/b”。如果path为空或null则返回当前引用。如果直接选取下一级节点，可以使用无分隔符(/)的节点名称表示，例如“a”。如果定位的path不存在，依然可以定位，后续数据操作的时候，将延迟动态创建不存在的路径节点。

###### 返回值
`Wilddog` 子节点引用。


###### 示例
```java
Wilddog ref = Wilddog("https://<appId>.wilddogio.com/test");

// 定位到 '/test/a'

Wilddog ref2 = ref.child("a");

// 定位到 '/test/a/b'

Wilddog ref3 = ref.child("a/b");

Wilddog ref4 = ref.child("a").child("b");

```
----

## getKey()

###### 定义
String getKey()

###### 说明
获得当前路径下节点的名称。

###### 返回值
`String` 节点名称

###### 示例
```java
Wilddog ref = new Wilddog("https://<appId>.wilddogio.com/test");

// 返回 “test”

String name = ref.getKey();

// 返回 “a”

name = ref.child("a").getKey();

```
----

## setValue()

###### 定义
void setValue(Object value)

###### 说明
给当前节点赋值。如果当前是叶子节点，那么它的值会被改变成value；如果当前是非叶子节点，那么它的子节点将会被删除，当前节点将变成叶子节点，同时被赋值为value。
该函数是线程安全的，将阻塞其他的本地数据操作。

###### 参数
* value `Object`
value的类型可以为String、Number、Boolean、null、Map或满足JavaBean规范的实体。
当value为String、Number、Boolean时，等价于当前节点的`updateChildren()`操作。
当value为null时，等价于当前节点的`removeValue()`操作。
当value为Map或JavaBean时，将value转为一颗子树替换当前value。

###### 返回值

void

###### 示例

```java
Wilddog ref = new Wilddog("https://<appId>.wilddogio.com/test");

// 等价 update(100);

ref.child("a/b").setValue(100);

// 等价 remove();

ref.child("a/b").setValue(null);

// 设置子树

Map<String, String> children = new HashMap<String, String>();

children.put("c", "cval");

ref.child("a/b").setValue(children);

// 自定义Entity

DOTAHero hero = new DOTAHero();

hero.setName("Nevermore");

hero.setHp(435);

hero.setMp(234);

ref.child("dota/heros/SF").setValue(hero);

```
----

## setValue()

###### 定义
void setValue(Object value, CompletionListener listener)

###### 说明
给当前节点赋值。如果当前是叶子节点，那么它的值会被改变成value；如果当前是非叶子节点，那么它的子节点将会被删除，当前节点将变成叶子节点，同时被赋值为value。
该函数是线程安全的，将阻塞其他的本地数据操作。

###### 参数

* value `Object`
value的类型可以为String、Number、Boolean、null、Map或满足JavaBean规范的实体。
当value为String、Number、Boolean时，等价于Path对应的Node的`updateChildren()`操作。
当value为null时，等价于Path对应的Node的`removeValue()`操作。
当value为Map或JavaBean时，将value转为一颗子树替换当前value。

* listener `CompletionListener`
listener包含一个callback函数，用户可以实现`onComplete`函数，如果某个callback函数没有响应的处理，接口实现为`{}`函数即可。`setValue(value)`等价于`setValue(value, null)`。

###### 返回值

void

###### 示例
自定义CompletionListener
```java
public class MyHandler implements CompletionListener {

	onComplete(WilddogError error, Wilddog ref){

		if(error != null){

			System.out.println(error.getCode());

		}

	}

}

```

```java
Wilddog ref = new Wilddog("https://<appId>.wilddogio.com/test");

CompletionListener listener = new MyHandler();

// 等价 update(100);

ref.child("a/b").setValue(100, listener);

// 等价 remove();

ref.child("a/b").setValue(null, handler);

// 设置子树

Map<String, String> children = new HashMap<String, String>();

children.put("c", "cval");

ref.child("a/b").setValue(children, handler);

// 自定义Entity

DOTAHero hero = new DOTAHero();

hero.setName("Nevermore");

hero.setHp(435);

hero.setMp(234);

ref.child("dota/heros/SF").setValue(hero, new CompletionListener(){

	onComplete(WilddogError error, Wilddog ref){

		if(error != null){

			System.out.println(error.getCode());

			return;

		}

		System.out.println("Good!");

	}

});

```
----

## push()

###### 定义
Wilddog push()

###### 说明
在当前节点下生成一个子节点，并返回子节点的引用。子节点的key利用服务端的当前时间生成，可作为排序使用。

###### 返回值
`Wilddog` 新生成子节点的引用对象

###### 示例

```java
Wilddog ref = new Wilddog("https://<appId>.wilddogio.com/test");

// 添加增加一个数值，将生成一个新ID，操作结果为{"-JmpzI81egafHZo5":100}， 返回的path为“/test/a/b/-JmpzI81egafHZo5”

Wilddog  newRef = ref.child("a/b").push();

newRef.setValue(100);

// 添加一个实体

DOTAHero hero = new DOTAHero();

hero.setName("Nevermore");

hero.setHp(435);

hero.setMp(234);

ref.child("heros").push().setValue(hero);

```
----

## updateChildren()

###### 定义
void updateChildren(Map value)

###### 说明
对子节点进行合并操作。不存在的子节点将会被新增，存在子节点将会被替换。
该函数是线程安全的，将阻塞其他的本地数据操作。

###### 参数
* value `Map<String, Object>`
当value为null时，等价于`removeValue()`操作。


###### 返回值

void

###### 示例

```java

Wilddog ref = Wilddog("https://<appId>.wilddogio.com/test");

// 更新子树

Map<String, String> children = new HashMap<String, String>();

children.put("c", "cval");

ref.child("a/b").updateChildren(children);

```
----

## updateChildren()

###### 定义
void updateChildren(Map children, CompletionListener listener)

###### 说明
对子节点进行更新操作。不存在的子节点将会被新增，存在子节点将会被替换。
该函数是线程安全的，将阻塞其他的本地数据操作。

###### 参数
* value `Map<String, Object>`
当value为null时，等价于`removeValue()`操作。

* listener `CompletionListener`
listener包含一个回调函数`onComplete`，如果执行完成，`onComplete`函数将会被调用。

###### 返回值
void

###### 示例
自定义CompletionListener
```java
public class MyHandler implements CompletionListener {

	onComplete(WilddogError error, Wilddog ref){

		if(error != null){

			System.out.println(error.getCode());
		}

	}

}
```
```java
Wilddog ref = new  Wilddog("https://<appId>.wilddogio.com/test");

CompletionListener handler = new MyHandler();

// 更新子树

Map<String, String> children = new HashMap<String, String>();

children.put("c", "cval");

ref.child("a/b").updateChildren(children, handler);

```
----

## removeValue()

###### 定义
void removeValue()

###### 说明
删除当前节点。 删除成功后将触发Change，ChildRemoved事件。
该函数是线程安全的，将阻塞其他的本地数据操作。

###### 返回值
void

###### 示例

```java
Wilddog ref = new  Wilddog("https://<appId>.wilddogio.com/test");

ref.child("a/b").removeValue();

```
----

## removeValue()

###### 定义
void removeValue(CompletionListener listener)

###### 说明
删除当前节点。 删除成功后将触发Change，ChildRemoved事件。
该函数是线程安全的，将阻塞其他的本地数据操作。

###### 参数
* listener `CompletionListener`
listener包含一个回调函数`onComplete`，如果执行完成，`onComplete`函数将会被调用。

###### 返回值
void

###### 示例

```java
Wilddog ref = new Wilddog("https://<appId>.wilddogio.com/test");

ResultHandler handler = new MyHandler();

ref.child("a/b").removeValue(handler);

```
----


##  authWithPassword()

###### 定义
void authWithPassword(String email, String password, AuthHandler handler)

###### 说明
使用邮箱密码登录你创建的应用。使用此方法前，必须进入"终端用户认证"页面，开启"野狗默认用户数据库"。 

###### 参数
*  email `String` 登录用的邮箱地址
* password `String` 登录用的密码
* handler `AuthResultHandler` 回调函数，包括以下方法：
> `onAuthenticated(Auth auth)` 操作成功。
> `onAuthenticationError()` 操作异常或失败。

###### Ref
token `String` 用户的token, 是用户访问应用的凭证
uid `String` 用户user id
provider `String`  值等于 "password"
expires `ing` 超时时间，使用unix time单位秒

###### 返回值
void

###### 示例

```java
Wilddog ref = new Wilddog("https://<appId>.wilddogio.com/test");

AuthResultHandler handler = new MyAuthResultHandler();

ref.authWithPassword("demo@wilddog.com", "demo1234", handler);

```
----

## authWithOAuthToken()

###### 定义
void authWithOAuthToken(String provider, Map<String, String> options, Wilddog.AuthResultHandler handler)

###### 说明
使用社交帐号的token登录。

###### 参数
*  provider`String` 登录使用的社交账户， 包括 "weibo"，"weixin", "weixinmp" (微信公众帐号)，"qq"等
* options`Map<String, String>` 使用社交帐号登录的必要参数。


###### 返回值
void

###### 示例
```java
Map<String, String> options = new HashMap<String, String>();

options.put("access_token", "<Weixin Access Token>");

options.put("openId", "<Weixin Open Id>");

Wilddog ref = new Wilddog("https://<appId>.wilddogio.com/test");

ref.authWithOAuthToken("weixin", options, new MyAuthResultHandler());

```
----


##  authWithCustomToken()

###### 定义
void authWithCustomToken(String token,  AuthHandler handler)

###### 说明
使用一个认证token或超级密钥进行登录。

###### 参数
* token`String` token 可以是一个Wilddog 超级密钥，或由密钥生成的token。


###### 返回值
void

###### 示例

```java
Wilddog ref = new Wilddog("https://<appId>.wilddogio.com/test");

// 1.使用secret登录

ref.authWithCustomToken("<The Secrets Of Your Wilddog App>", new MyAuthResultHandler());

// 2.集成自己帐号系统登录

// 假如 "uid":"1"，"secret":"<The-First-Secret>",

// 生成"token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ2IjowLCJpYXQiOjE0MzQ0NzMzMjgsImQiOnsidWlkIjoiMSIsInNvbWUiOiJhcmJpdHJhcnkiLCJkYXRhIjoiaGVyZSJ9fQ.fSmYzuOGPh7IApc7Jk_s17kk3KgS-ZB9Y9OCzczuMd0"

// JWT 参见(http://jwt.io)

ref.authWithCustomToken("<The JWT Token With Your First Secret Encoded>", new MyAuthResultHandler());


```
----

##  createUser()

###### 定义
void createUser(String email, String password, Wilddog.ResultHandler handler)

###### 说明
通过邮箱密码创建你的终端用户。使用此方法前，必须进入"终端用户认证"页面，开启"野狗默认用户数据库"。

###### 参数
* email `String` 邮箱地址
* password `String`  密码


###### 返回值
void

###### 示例

```java
public class MyResultHandler implements Wilddog.ResultHandler {

	onSuccess() {

		System.out.println("MyResultHandler [success]");

	}

	onError(WilddogError error) {

		if(error != null){

			System.out.println(error.getCode());

		}

	}

}

```
```java
Wilddog ref = new Wilddog("https://<appId>.wilddogio.com/test");
ref.createUser("<email>", "<password>", new MyResultHandler());
```
----

## changeEmail()

###### 定义
void changeEmail(String oldEmail, String password, String newEmail, Wilddog.ResultHandler handler)

###### 说明

修改终端用户的登录邮箱。使用此方法前，必须进入"终端用户认证"页面，开启"野狗默认用户数据库"。

###### 参数
* oldEmail`String` 原来的邮箱地址
* newEmail`String` 新的邮箱地址
* password `String` 密码

###### 返回值
void

###### 示例
```java
Wilddog ref = new Wilddog("https://<appId>.wilddogio.com/test");

ref.changeEmail("<old-email>", "<password>", "<new-email>" , new MyResultHandler());

```
----

## changePassword()

###### 定义
void changePassword(String email, String oldPassword, String newPassword, Wilddog.ResultHandler handler)

###### 说明
修改终端用户的登录密码。使用此方法前，必须进入"终端用户认证"页面，开启"野狗默认用户数据库"。

###### 参数
* email`String` 用户的邮箱地址
* oldPassword`String` 用户原来的密码
* newPassword`String` 用户新的密码

###### 返回值
void

###### 示例

```java
Wilddog ref = new Wilddog("https://<appId>.wilddogio.com/test");

ref.changePassword("<email>", "<password>", "<new-password>", new MyResultHandler());

```
----

## removeUser()

###### 定义
void removeUser(String email, String password, Wilddog.ResultHandler handler)

###### 说明
删除终端用户。使用此方法前，必须进入"终端用户认证"页面，开启"野狗默认用户数据库"。

###### 参数
*  email`String` 用户的邮箱地址
*  password`String` 密码

###### 返回值
void

###### 示例
```java
Wilddog ref = new Wilddog("https://<appId>.wilddogio.com/test");

ref.removeUser("<email>", "<password>", new MyResultHandler());

```
----

## resetPassword()

###### 定义
void resetPassword(String email,  Wilddog.ResultHandler handler)

###### 说明
重置终端用户的登录密码。将会发送密码重置邮件给用户，邮件里包含临时密码，临时密码24小时有效。
使用此方法前，必须进入"终端用户认证"页面，开启"野狗默认用户数据库"。

###### 参数
*  email`String` 用户邮箱地址

###### 返回值
void

###### 示例
```java
Wilddog ref = new Wilddog("https://<appId>.wilddogio.com/test");

ref.resetPassword("<email>", new MyResultHandler());

```

# DataSnapshot


## getValue()

###### 定义
Object getValue()

###### 说明
从快照中获得当前节点的数据。

###### 返回值
`Object` 如果是叶子节点，返回String、Boolean、Number类型；如果是非叶子节点，将返回`Map<String, Object>`。

----

## getChildrenCount()

###### 定义
long getChildrenCount()

###### 说明
获得子节点的总数。

###### 返回值
`long` 子节点总数 。

----

## hasChild()

###### 定义
boolean hasChild(String key)

###### 说明
判断在当前快照中，是否包含指定子节点。

###### 参数
* key `String`
子节点名称。

###### 返回值
`boolean` true为包含，false为不包含。

----

## hasChildren()

###### 定义
boolean hasChildren()

###### 说明
判断在当前快照中，是否存在子节点。

###### 返回值
`boolean` true为存在子节点，false为不存在。

----

## child()

###### 定义
Wilddog child(String node)

###### 说明
根据相对路径，来获取当前节点下子节点的快照。

###### 参数
* node `String` 
子节点名称。

###### 返回值
`Snapshot` 

----

## getChildren()

###### 定义
Iterator<DataSnapshot> getChildren()

###### 说明
获取当前快照中，所有子节点的迭代器。

###### 返回值
`Iterator<DataSnapshot>` 子节点的迭代器。 

----

## getKey()

###### 定义
String getKey()

###### 说明
从快照中，获取当前节点的名称

###### 返回值
`String` 节点名称 

----

## exists()

###### 定义
boolean exists()

###### 说明
在快照中，判断当前节点是否包含数据。相当于`snapshot.getValue()!=null` 。

###### 返回值
`boolean` 

----
## getRef()

###### 定义
Wilddog getRef()

###### 说明
从快照中，获得当前节点的引用。

###### 返回值
`Wilddog` 节点引用


# Query

## addValueEventListener()

###### 定义
void addValueEventListener(ValueEventListener listener)

###### 说明
为当前节点绑定监听事件，监听该节点数据的变化。用户需要实现ValueEventListener接口。

###### 参数
* listener `ValueEventListener`
listener将监听Change事件。

###### 返回值
`ValueEventListener` 返回监听事件的引用，可用于删除此事件。

###### 示例

```java

Wilddog ref = Wilddog("https://<appId>.wilddogio.com/test");

ValueEventListener listener = ref.addValueEventListener(new ValueEventListener(){

	 onDataChange(DataSnapshot snapshot) {

		 System.out.println(snapshot.getValue());

	 }

     onCancelled(WilddogError error) {

	     if(error != null){

		     System.out.println(error.getCode());

	     }

     }

});


```

----

## addChildEventListener()


###### 定义
void addChildEventListener(ChildEventListener listener)

###### 说明
为子节点绑定监听事件，监听该子节点数据的变化。用户需要实现ValueEventListener接口。

###### 参数
* listener `ChildEventListener`
> `onChildAdded()` 监听子节点的添加事件。
> `onChildRemoved()` 监听子节点的删除事件。
> `onChildChanged()` 监听子节点的变化事件。

###### 返回值
`ChildEventListener` 返回监听事件的引用，可用于删除此事件。

###### 示例
```java
Wilddog ref = Wilddog("https://<appId>.wilddogio.com/test");

ChildEventListener listener = ref.addChildEventListener(new ChildEventListener(){

	onChildAdded(DataSnapshot snapshot){

		System.out.println(snapshot.getValue());

	}
	
	onChildChanged(DataSnapshot snapshot){

		System.out.println(snapshot.getValue());

	}

	onChildRemoved(DataSnapshot snapshot){

		System.out.println(snapshot.getValue());

	}

	onCancelled(WilddogError error){

		if(error != null){

		    System.out.println(error.getCode());

	    }

	}

});

```

----

## removeEventListener()

###### 定义
void removeEventListener(ValueEventListener listener)

###### 说明
删除已绑定的监听事件。

###### 参数
* listener `ChildEventListener` 监听事件的引用。

###### 返回值
void

----

## startAt()

###### 定义
Object startAt(String), Object startAt(double), Object startAt(boolean)

###### 说明
创建一个大于等于的范围查询，可配合orderBy方式使用。

###### 参数
* value 类型为String double boolean

###### 返回值
Query 查询器类

----

## endAt()

###### 定义
Object endAt(String)，Object endAt(double)，Object endAt(boolean)

###### 说明
创建一个小于等于的范围查询，可配合orderBy方式使用。

###### 参数
* value 类型为String double boolean

###### 返回值
Query 查询器类

----
## equalTo()

###### 定义
Object equalTo(String)，Object equalTo(double)，Object equalTo(boolean)

###### 说明
创建一个等于的精确查询。

###### 参数
* value 类型为String double boolean

###### 返回值
Query 查询器类

----

### limitToFirst()

###### 定义
Query limitToFirst(int count)

###### 说明
创建一个limit查询。从第一条开始获取指定数量的数据。

###### 参数
* count int 数量

###### 返回值
Query 查询器类

----

## limitToLast()

###### 定义
Query limitToLast(int count)

###### 说明
创建一个limit查询。从最后一条开始获取指定数量的数据。

###### 参数
* count int 数量

###### 返回值
Query 查询器类

----

## orderByChild()

###### 定义
Query orderByChild(String childKey)

###### 说明
使用指定的子节点属性进行排序。

###### 参数
* childKey String 子节点属性。

###### 返回值
Query 查询器类

----

## orderByKey()

###### 定义
Query orderByKey()

###### 说明
使用子节点的key进行排序。

###### 返回值
Query 查询器类

----

## orderByValue()

###### 定义
Query orderByValue()

###### 说明
使用子节点的值进行排序。

###### 返回值
Query 查询器类

----

## orderByPriority()

###### 定义
Query orderByPriority()

###### 说明
根据子节点的优先级进行排序。

###### 返回值
Query 查询器类

----

