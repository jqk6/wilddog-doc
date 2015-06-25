/*
Title: API 文档
Sort: 4
*/


# Wilddog

## public Wilddog getParent()

获得当前Path的父节点引用对象（Wilddog），如果当前已经到达root路径，调用该函数后返回依然是root的引用对象（Wilddog）。

###### Return
`Wilddog` 上级引用对象

###### Sample
```java
Wilddog ref = new Wilddog("https://demo-z.wilddogio.com/test/a");
// 获得'/test' 路径的引用
Wilddog ref2 = ref.getParent();
// 到达root
Wilddog re3 = ref.getParent().getParent();
```
----

## public Wilddog child(String path)

定位到当前路径下的相对路径的子节点，返回Wilddog对象引用。参数path为相对路径，多层级间需要使用“/”分隔，例如“a/b/c”。

###### Param
* path `String`
path为相对路径，多层级间需要使用"/"分隔，例如“a/b”。如果path为空或null则返回当前引用。如果直接下一级，可以使用无分隔符“/”的节点名称表示，例如“a”。如果定位的path不存在，依然可以定位，后续数据操作的时候，将延迟动态创建不存在的路径节点。

###### Return
`Wilddog` 子节点引用。

###### throws PathFormatException
path解析异常。

###### Sample
```java
Wilddog ref = Wilddog("https://demo-z.wilddogio.com/test");
// 定位到 '/test/a'
Wilddog ref2 = ref.child("a");
// 定位到 '/test/a/b'
Wilddog re3 = ref.child("a/b");
Wilddog re4 = ref.child("a").child("b");
```
----

### public String getKey()
获得当前path对应的node名称。

###### Return
`String` node名称

###### Sample
```java
Wilddog ref = new Wilddog("https://demo-z.wilddogio.com/test");
// 返回 “test”
String name = ref.getKey();
// 返回 “a”
name = ref.child("a").getKey();
```
----

## public void setValue(Object value)

在当前Path进行覆盖性的赋值操作，将本地当前value或children（整颗子树）替换，并同步到云端。如果操作成功将触发已绑定的event，例如Change，ChildAdded等。
该函数是线程安全的，将阻塞其他的本地数据操作。

###### Param
* value `Object`
value的类型可以为String、Number、Boolean、null、Map或满足JavaBean规范的实体。
当value为String、Number、Boolean时，等价于Path对应的Node的`updateChildren()`操作。
当value为null时，等价于Path对应的Node的`removeValue()`操作。
当value为Map或JavaBean时，将value转为一颗子树替换当前value。

###### Return

void

###### Sample

```java
Wilddog ref = new Wilddog("https://demo-z.wilddogio.com/test");
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

## public void setValue(Object value, CompletionListener listener)

在当前Path进行覆盖性的赋值操作，将本地当前value或children（整颗子树）替换，并同步到云端，操作结果将回调用户自定义的listener。如果操作成功将触发已绑定的event，例如Change，ChildAdded等。
该函数是线程安全的，将阻塞其他的本地数据操作。

###### Param

* value `Object`
value的类型可以为String、Number、Boolean、null、Map或满足JavaBean规范的实体。
当value为String、Number、Boolean时，等价于Path对应的Node的`updateChildren()`操作。
当value为null时，等价于Path对应的Node的`removeValue()`操作。
当value为Map或JavaBean时，将value转为一颗子树替换当前value。

* listener `CompletionListener`
listener包含一个callback函数，用户可以实现`onComplete`函数，如果某个callback函数没有响应的处理，接口实现为`{}`函数即可。`setValue(value)`等价于`setValue(value, null)`。

###### Return

void

###### Sample
自定义CompletionListener
```java
public class MyHandler implements CompletionListener {
	public void onComplete(WilddogError error, Wilddog ref){
		if(error != null){
			System.out.println(error.getCode());
		}
	}
}
```

```java
Wilddog ref = new Wilddog("https://demo-z.wilddogio.com/test");
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
	public void onComplete(WilddogError error, Wilddog ref){
		if(error != null){
			System.out.println(error.getCode());
			return;
		}
		System.out.println("Good!");
	}
});
```
----

## public Wilddog push()

在当前Path进行新添加操作，将在本地为新数据生成一个唯一ID，该ID将作为当前path的子节点，且作为新数据的父节点。同时同步到云端。如果操作成功将触发已绑定的event。最后将返回新ID的引用对象Wilddog。

###### Return
`Wilddog` 新ID的引用对象

###### throws PathFormatException

###### Sample

```java
Wilddog ref = new Wilddog("https://demo-z.wilddogio.com/test");
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

## public void updateChildren(Map value)

在当前Path进行更新操作，value与已有的数据做合并，并将交集部分替换为最新的数据。
该函数是线程安全的，将阻塞其他的本地数据操作。

###### Param
* value `Map<String, Object>`
当value为null时，等价于Path对应的Node的`removeValue()`操作。


###### Return

void

###### Sample

```java
Wilddog ref = Wilddog("https://demo-z.wilddogio.com/test");
// 更新子树
Map<String, String> children = new HashMap<String, String>();
children.put("c", "cval");
ref.child("a/b").updateChildren(children);
```
----

## public void updateChildren(Map children, CompletionListener listener)

在当前Path进行更新操作，value与已有的数据做合并，并将交集部分替换为最新的数据。

###### Param
* value `Map<String, Object>`
当value为null时，等价于Path对应的Node的`removeValue()`操作。

* listener `CompletionListener`
listener包含一个callback函数，用户可以实现`onComplete`函数，如果某个callback函数没有响应的处理，接口实现为`{}`函数即可。

###### Return
void

###### Sample
自定义CompletionListener
```java
public class MyHandler implements CompletionListener {
	public void onComplete(WilddogError error, Wilddog ref){
		if(error != null){
			System.out.println(error.getCode());
		}
	}
}
```
```java
Wilddog ref = new  Wilddog("https://demo-z.wilddogio.com/test");
CompletionListener handler = new MyHandler();
// 更新子树
Map<String, String> children = new HashMap<String, String>();
children.put("c", "cval");
ref.child("a/b").updateChildren(children, handler);
```
----

## public void removeValue()

在当前Path进行删除操作，并同步到云端。如果操作成功将触发已绑定的event，例如Change，ChildRemoved。
该函数是线程安全的，将阻塞其他的本地数据操作。

###### Return
void

###### Sample

```java
Wilddog ref = new  Wilddog("https://demo-z.wilddogio.com/test");
ref.child("a/b").removeValue();
```
----

## public void removeValue(CompletionListener listener)

在当前Path进行删除操作，并同步到云端，操作结果将回调用户自定义的handler。如果操作成功将触发已绑定的event，例如Change，ChildRemoved。
该函数是线程安全的，将阻塞其他的本地数据操作。

###### Param
* listener `CompletionListener`
listener包含一个callback函数，用户可以实现`onComplete`函数，如果某个callback函数没有响应的处理，接口实现为`{}`函数即可。

###### Return
void

###### Sample

```java
Wilddog ref = new Wilddog("https://demo-z.wilddogio.com/test");
ResultHandler handler = new MyHandler();
ref.child("a/b").removeValue(handler);
```
----


## public void  authWithPassword(String email, String password, AuthHandler handler)

 密码认证是使用用户的邮箱和密码，这是最简单的认证方式。

###### Param
*  email `String` app认证用户的email账户
* password `String` app认证用户password密码
* handler `AuthResultHandler` 回调函数，包括以下方法：
> `onAuthenticated(Auth auth)` 操作成功。
> `onAuthenticationError()` 操作异常或失败，WilddogError作为函数参数返回给调用者。

###### Ref
token `String` app用户的token, 是用户访问的凭证
uid `String` 用户user id
provider `String`  值等于 "password"
token `String` app用户的token, 是用户访问的凭证
expires `ing` 超时时间，使用unix time单位秒
providerData `Map<String,Object>` 若使用微博或微信时, 则包含微博或微信的认证信息；否则为空

###### Return
void

###### Sample

```java
Wilddog ref = new Wilddog("https://demo-z.wilddogio.com/test");
AuthResultHandler handler = new MyAuthResultHandler();
ref.authWithPassword("demo@wilddog.com", "demo1234", handler);
```
----

## public void authWithOAuthToken(String provider, Map<String, String> options, Wilddog.AuthResultHandler handler)
使用社交媒体帐号登录。使用通过第三方token，获取用户信息。

###### Param
*  provider`String` 登陆使用的社交账户， 例如："weibo"，"weixin", "weixinmp" (微信公众帐号)，"qq"等
* options`Map<String, String>` 使用社交帐号登陆的必要参数。


###### Return
void

###### Sample
```java
Map<String, String> options = new HashMap<String, String>();
options.put("access_token", "<Weixin Access Token>");
options.put("openId", "<Weixin Open Id>");
Wilddog ref = new Wilddog("https://demo-z.wilddogio.com/test");
ref.authWithOAuthToken("weixin", options, new MyAuthResultHandler());
```
----


## public void  authWithCustomToken(String token,  AuthHandler handler)

使用一个合法的token进行登录

###### Param
* token`String` 已有的合法token,token 可以是一个Wilddog 超级密钥，或由密钥生成的token。


###### Return
void

###### Sample

```java
Wilddog ref = new Wilddog("https://demo-z.wilddogio.com/test");

// 1.使用secret登录
ref.authWithCustomToken("<The Secrets Of Your Wilddog App>", new MyAuthResultHandler());

// 2.集成自己帐号系统登录
// 假如 "uid":"1"，"secret":"<The-First-Secret>",
// 生成"token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ2IjowLCJpYXQiOjE0MzQ0NzMzMjgsImQiOnsidWlkIjoiMSIsInNvbWUiOiJhcmJpdHJhcnkiLCJkYXRhIjoiaGVyZSJ9fQ.fSmYzuOGPh7IApc7Jk_s17kk3KgS-ZB9Y9OCzczuMd0"
// JWT 参见(http://jwt.io)
ref.authWithCustomToken("<The JWT Token With Your First Secret Encoded>", new MyAuthResultHandler());

```
----

## public void  createUser(String email, String password, Wilddog.ResultHandler handler)

通过邮箱注册用户 通过createUser 注册的终端用户会托管在WILDDOG 平台, 被注册的用户可以采用 authWithPassword 认证.

###### Param
*  email `String` email账户
* password `String`   密码


###### Return
void

###### Sample

```java
public class MyResultHandler implements Wilddog.ResultHandler {

	public void onSuccess() {
		System.out.println("MyResultHandler [success]");
	}

	public void onError(WilddogError error) {
		if(error != null){
			System.out.println(error.getCode());
		}
	}
}
```
```java
Wilddog ref = new Wilddog("https://demo-z.wilddogio.com/test");
ref.createUser("<email>", "<password>", new MyResultHandler());
```
----

## public void changeEmail(String oldEmail, String password, String newEmail, Wilddog.ResultHandler handler)

修改登录邮箱 WILDDOG 平台托管的用户可以通过changeEmail 修改登录邮箱



###### Param
*  oldEmail`String` 原来的email账户
*  newEmail`String` 新的email账户
* password `String` a用户password密码

###### Return
void

###### Sample
```java
Wilddog ref = new Wilddog("https://demo-z.wilddogio.com/test");
ref.changeEmail("<old-email>", "<password>", "<new-email>" , new MyResultHandler());
```
----

## public void changePassword(String email, String oldPassword, String newPassword, Wilddog.ResultHandler handler)

为app 用户提供修改email。

###### Param
*  email`String` 用户的email账户
*  oldPassword`String` 用户原来password密码
* newPassword`String` 用户新的password密码

###### Return
void

###### Sample

```java
Wilddog ref = new Wilddog("https://demo-z.wilddogio.com/test");
ref.changePassword("<email>", "<password>", "<new-password>", new MyResultHandler());
```
----

## public void removeUser(String email, String password, Wilddog.ResultHandler handler)

为app提供删除用户的功能。

###### Param
*  email`String` 用户的email账户
*  password`String` 用户password密码

###### Return
void

###### Sample
```java
Wilddog ref = new Wilddog("https://demo-z.wilddogio.com/test");
ref.removeUser("<email>", "<password>", new MyResultHandler());

```
----

## public void resetPassword(String email,  Wilddog.ResultHandler handler)

重置app密码。

###### Param
*  email`String` app认证用户的email账户

###### Return
void

###### Sample
```java
Wilddog ref = new Wilddog("https://demo-z.wilddogio.com/test");
ref.resetPassword("<email>", new MyResultHandler());
```

# Snapshot
EventHandler触发时，作为参数传递给用户。如果是Changed、ChildChanged、ChildAdded接口获得最新的数据；如果是ChildRemoved接口获得被删除的数据。

### public Object getValue()
获得当前节点的数据。

###### Return
`Object` 如果是叶子节点，返回String、Boolean、Number类型；如果包含子树，将返回`Map<String, Object>`。

----

## public long getChildrenCount()
获得子节点的总数。

###### Return
`long` 子节点个数 。

----

## public boolean hasChild(String key)
是否包含指定子节点。

###### Param
* key `String`
子节点名称。

###### Return
`boolean` true为包含指定子节点，false为不包含。

----

## public boolean hasChildren()
是否包含子节点。

###### Return
`boolean` true为包含子节点，false为不包含。

----

## public Snapshot child(String node)
获得指定子节点的Snapshot。

###### Param
* node `String` 
子节点名称。

###### Return
`Snapshot` 

----

## public Iterator getChildren()
获得所有子节点的Snapshot。

###### Return
`Iterator<DataSnapshot>` 子节点Snapshot集合的遍历器。 

----

## public String getKey()
获得当前节点的名称

###### Return
`String` 节点名称 

----

## public boolean exists()
是否存在值，如果是叶子节点是否包含值，非叶子节点是否有后代。

###### Return
`boolean` 

----
## public Wilddog getRef()
获得数据对应的Wilddog引用，使用当前path。

###### Return
`Wilddog` 节点引用


# Query

## public ValueEventListener addValueEventListener(ValueEventListener listener)

在当前path上绑定监听事件，监听该节点数据的变化。用户需要实现ValueEventListener接口。

###### Param
* listener `ValueEventListener`
listener将监听Change事件， `onDataChange()` 监听节点数据或子树的变化，参数snapshot为变化后的最新数据。

###### Return
`ValueEventListener` 用于删除时使用。

###### Sample

```java
Wilddog ref = Wilddog("https://demo-z.wilddogio.com/test");
ValueEventListener listener = ref.addValueEventListener(new ValueEventListener(){
	 public void onDataChange(DataSnapshot snapshot) {
		 System.out.println(snapshot.getValue());
	 }

     public void onCancelled(WilddogError error) {
	     if(error != null){
		     System.out.println(error.getCode());
	     }
     }
});

```

----

## public ChildEventListener addChildEventListener(ChildEventListener listener)

在当前path上绑定监听事件，监听该节点的子节点的数据的变化。用户需要实现ChildEventListener接口。

###### Param
* listener `ChildEventListener`
> `onChildAdded()` 监听下一级添加新的子节点，参数snapshot为新的子节点的数据。
> `onChildRemoved()` 监听下一级被删除的子节点，参数snapshot为被删除的子节点数据。
> `onChildChanged()` 监听下一级被修改的子节点，子节点的下级节点中发生任意变化都将触发该事件，参数snapshot为修改后的子节点数据。

###### Return
`ChildEventListener` 用于删除时使用。

###### Sample
```java
Wilddog ref = Wilddog("https://demo-z.wilddogio.com/test");
ChildEventListener listener = ref.addChildEventListener(new ChildEventListener(){
	public void onChildAdded(DataSnapshot snapshot){
		System.out.println(snapshot.getValue());
	}
	
	public void onChildChanged(DataSnapshot snapshot){
		System.out.println(snapshot.getValue());
	}

	public void onChildRemoved(DataSnapshot snapshot){
		System.out.println(snapshot.getValue());
	}

	public void onCancelled(WilddogError error){
		if(error != null){
		    System.out.println(error.getCode());
	    }
	}
});
```

----

## public void removeEventListener(ValueEventListener listener)

取消已绑定的监听事件。
###### Param
* listener `ChildEventListener` 监听事件引用。

----

## public Query startAt()

范围查询，配合orderBy*方式使用。表示起始的value值，大于某一指定的value。

###### Param
* value 类型为String double boolean

----

## public Query endAt()

范围查询，配合orderBy*方式使用。表示终止的value值，小于某一指定的value。

###### Param
* value 类型为String double boolean

----
## public Query equalTo()

精确匹配，配合orderBy*方式使用。表示等于某一指定的value。

###### Param
* value 类型为String double boolean

----

### public Query limitToFirst(int count)

限制查询，配合orderBy*方式使用。表示从开始取固定条目数量。

###### Param
* count int 数量限制

----

## public Query limitToLast(int count)

限制查询，配合orderBy*方式使用。表示取固定条目数量到结尾。

###### Param
* count int 数量限制

----

## public Query orderByChild(String childName)

数据对象包含公有的子节点属性进行排序。

###### Param
* childName String 子节点名称

----

## public Query orderByKey()

按照节点key名称排序。

----

## public Query orderByValue()

按照节点value排序。

----

## public Query orderByPriority()

按照节点的优先级排序。

----

