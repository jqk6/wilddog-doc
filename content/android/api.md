/*
Title: API 文档
Sort: 4
*/


## Wilddog

### public Wilddog getParent()
获得当前Path的父节点引用对象（Wilddog），如果当前已经到达root路径，调用该函数后返回依然是root的引用对象（Wilddog）。

#### Return
`Wilddog` 上级引用对象

#### Sample
```java
Wilddog ref = new Wilddog("https://demo-z.wilddogio.com/test/a");
// 获得'/test' 路径的引用
Wilddog ref2 = ref.getParent();
// 到达root
Wilddog re3 = ref.getParent().getParent();
```
----

### public Wilddog child(String path)
定位到当前路径下的相对路径的子节点，返回Wilddog对象引用。参数path为相对路径，多层级间需要使用“/”分隔，例如“a/b/c”。

#### Param
* path `String`
path为相对路径，多层级间需要使用"/"分隔，例如“a/b”。如果path为空或null则返回当前引用。如果直接下一级，可以使用无分隔符“/”的节点名称表示，例如“a”。如果定位的path不存在，依然可以定位，后续数据操作的时候，将延迟动态创建不存在的路径节点。

#### Return
`Wilddog` 子节点引用。

#### throws PathFormatException
path解析异常。

#### Sample
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

#### Return
`String` node名称

#### Sample
```java
Wilddog ref = new Wilddog("https://demo-z.wilddogio.com/test");
// 返回 “test”
String name = ref.getKey();
// 返回 “a”
name = ref.child("a").getKey();
```
----

### public ValueEventListener addValueEventListener(ValueEventListener listener)
在当前path上绑定监听事件，监听该节点数据的变化。用户需要实现ValueEventListener接口。

#### Param
* listener `ValueEventListener`
listener将监听Change事件， `onDataChange()` 监听节点数据或子树的变化，参数snapshot为变化后的最新数据。

#### Return
`ValueEventListener` 用于删除时使用。

#### Sample

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

### public ChildEventListener addChildEventListener(ChildEventListener listener)
在当前path上绑定监听事件，监听该节点的子节点的数据的变化。用户需要实现ChildEventListener接口。

#### Param
* listener `ChildEventListener`
> `onChildAdded()` 监听下一级添加新的子节点，参数snapshot为新的子节点的数据。
> `onChildRemoved()` 监听下一级被删除的子节点，参数snapshot为被删除的子节点数据。
> `onChildChanged()` 监听下一级被修改的子节点，子节点的下级节点中发生任意变化都将触发该事件，参数snapshot为修改后的子节点数据。

#### Return
`ChildEventListener` 用于删除时使用。

#### Sample
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

### public void setValue(Object value)
在当前Path进行覆盖性的赋值操作，将本地当前value或children（整颗子树）替换，并同步到云端。如果操作成功将触发已绑定的event，例如Change，ChildAdded等。
该函数是线程安全的，将阻塞其他的本地数据操作。

#### Param
* value `Object`
value的类型可以为String、Number、Boolean、null、Map或满足JavaBean规范的实体。
当value为String、Number、Boolean时，等价于Path对应的Node的`updateChildren()`操作。
当value为null时，等价于Path对应的Node的`removeValue()`操作。
当value为Map或JavaBean时，将value转为一颗子树替换当前value。

#### Return

void

#### Sample

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

#### Param

* value `Object`
value的类型可以为String、Number、Boolean、null、Map或满足JavaBean规范的实体。
当value为String、Number、Boolean时，等价于Path对应的Node的`updateChildren()`操作。
当value为null时，等价于Path对应的Node的`removeValue()`操作。
当value为Map或JavaBean时，将value转为一颗子树替换当前value。

* listener `CompletionListener`
listener包含一个callback函数，用户可以实现`onComplete`函数，如果某个callback函数没有响应的处理，接口实现为`{}`函数即可。`setValue(value)`等价于`setValue(value, null)`。

#### Return

void

#### Sample
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

### public Wilddog push()
在当前Path进行新添加操作，将在本地为新数据生成一个唯一ID，该ID将作为当前path的子节点，且作为新数据的父节点。同时同步到云端。如果操作成功将触发已绑定的event。最后将返回新ID的引用对象Wilddog。

#### Return
`Wilddog` 新ID的引用对象

#### throws PathFormatException

#### Sample

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

### public void updateChildren(Map value)
在当前Path进行更新操作，value与已有的数据做合并，并将交集部分替换为最新的数据。
该函数是线程安全的，将阻塞其他的本地数据操作。

#### Param
* value `Map<String, Object>`
当value为null时，等价于Path对应的Node的`removeValue()`操作。


#### Return

void

#### Sample

```java
Wilddog ref = Wilddog("https://demo-z.wilddogio.com/test");
// 更新子树
Map<String, String> children = new HashMap<String, String>();
children.put("c", "cval");
ref.child("a/b").updateChildren(children);
```
----

### public void updateChildren(Map children, CompletionListener listener)
在当前Path进行更新操作，value与已有的数据做合并，并将交集部分替换为最新的数据。

#### Param
* value `Map<String, Object>`
当value为null时，等价于Path对应的Node的`removeValue()`操作。

* listener `CompletionListener`
listener包含一个callback函数，用户可以实现`onComplete`函数，如果某个callback函数没有响应的处理，接口实现为`{}`函数即可。

#### Return
void

#### Sample
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

### public void removeValue()
在当前Path进行删除操作，并同步到云端。如果操作成功将触发已绑定的event，例如Change，ChildRemoved。
该函数是线程安全的，将阻塞其他的本地数据操作。

#### Return
void

#### Sample

```java
Wilddog ref = new  Wilddog("https://demo-z.wilddogio.com/test");
ref.child("a/b").removeValue();
```
----

### public void removeValue(CompletionListener listener)
在当前Path进行删除操作，并同步到云端，操作结果将回调用户自定义的handler。如果操作成功将触发已绑定的event，例如Change，ChildRemoved。
该函数是线程安全的，将阻塞其他的本地数据操作。

#### Param
* listener `CompletionListener`
listener包含一个callback函数，用户可以实现`onComplete`函数，如果某个callback函数没有响应的处理，接口实现为`{}`函数即可。

#### Return
void

#### Sample
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
ResultHandler handler = new MyHandler();
ref.child("a/b").removeValue(handler);
```
----


### public void  authWithPassword(String email, String password, AuthHandler handler)
wilddog为app提供多种认证方式，包含密码认证、OAuth认证、自定义token。 密码认证是使用用户的邮箱和密码，这是最简单的认证方式。认证失败后调用用户自定义failure方法， 认证成功调用success方法， 包含参数auth对象。

#### Param
*  email `String` app认证用户的email账户
* password `String` app认证用户password密码
* handler `AuthHandler`
handler包含三个callback函数，用户可以实现AuthHandler接口中的函数，如果某个callback函数没有响应的处理，接口实现为`{}`函数即可。
callback函数如下：
> `success(Auth auth)` 操作成功。
> `failure()` 操作异常或失败，WilddogError作为函数参数返回给调用者。
> `timeout()` 操作超时。

#### Ref
* auth `Auth`认证信息, 包含用户id, token; 若使用微博或微信时,  则包含oauth属性
uid `String` app用户的id
provider `String` app用户的提供者, 值包括password, custom, dev, weibo
token `String` app用户的token, 是用户访问的凭证
email `String` app用户的email
oauth `Map<String,Object>` 若使用微博或微信时, 则包含微博或微信的认证信息；否则为空

#### Return
void

#### Sample
```java
public class MyAuthHandler implements AuthHandler {

	public void timeout() {	}

	public void success(Auth auth) {
		System.out.println(auth);
	}

	public void failure(WilddogError wilddogError) {
		System.out.println(wilddogError);
	}
}
```
```java
Wilddog ref = new Wilddog("http://demo.wilddogio.com/test");
AuthHandler handler = new MyAuthHandler();
ref.authWithPassword("demo@wilddog.com", "demo1234", handler);
```
----

### public void  authWithOAuthToken(OauthEnum provider, String token, AuthHandler handler)
wilddog为app提供多种认证方式，包含密码认证、OAuth认证、自定义token。oauth token认证是第三方oauth的token登录app。认证失败后调用用户自定义failure方法， 认证成功调用success方法， 包含参数auth对象。

#### Param
*  provider`OauthEnum ` oauth的provider枚举， 例如：weibo，weixin，github
* token`String` oauth的provider的token，例如 weibo 的token
* handler `AuthHandler`
handler包含三个callback函数，用户可以实现AuthHandler接口中的函数，如果某个callback函数没有响应的处理，接口实现为`{}`函数即可。
callback函数如下：
> `success(Auth auth)` 操作成功。
> `failure()` 操作异常或失败，WilddogError作为函数参数返回给调用者。
> `timeout()` 操作超时。

#### Ref
* auth `Auth`认证信息, 包含用户id, token; 若使用微博或微信时,  则包含oauth属性
uid `String` app用户的id
provider `String` app用户的提供者, 值包括password, custom, dev, weibo
token `String` app用户的token, 是用户访问的凭证
email `String` app用户的email
oauth `Map<String,Object>` 若使用微博或微信时, 则包含微博或微信的认证信息；否则为空

#### Return
void

#### Sample
```java
public class MyAuthHandler implements AuthHandler {

	public void timeout() {	}

	public void success(Auth auth) {
		System.out.println(auth);
	}

	public void failure(WilddogError wilddogError) {
		System.out.println(wilddogError);
	}
}
```
```java
Wilddog ref = new Wilddog("http://demo.wilddogio.com/test");
AuthHandler handler = new MyAuthHandler();
ref.authWithOAuthToken(OauthEnum.WEIBO, "2.00Q4iPUBuXlzeC0cXXXXXXXXXXXXXX", handler);
```
----

### public void  authWithCustomToken(String token,  AuthHandler handler)
wilddog为app提供多种认证方式，包含密码认证、OAuth认证、自定义token。oauth token认证是第三方oauth的token登录app。认证失败后调用用户自定义failure方法， 认证成功调用success方法， 包含参数auth对象。

#### Param
* token`String` token， 可以是以下值（secret值，wilddog管理app owner或deveploer的token， jwt自定一定token）
* handler `AuthHandler`
handler包含三个callback函数，用户可以实现AuthHandler接口中的函数，如果某个callback函数没有响应的处理，接口实现为`{}`函数即可。
callback函数如下：
> `success(Auth auth)` 操作成功。
> `failure()` 操作异常或失败，WilddogError作为函数参数返回给调用者。
> `timeout()` 操作超时。

#### Ref
* auth `Auth`认证信息, 包含用户id, token; 若使用微博或微信时,  则包含oauth属性
uid `String` app用户的id
provider `String` app用户的提供者, 值包括password, custom, dev, weibo
token `String` app用户的token, 是用户访问的凭证
email `String` app用户的email
oauth `Map<String,Object>` 若使用微博或微信时, 则包含微博或微信的认证信息；否则为空

#### Return
void

#### Sample
```java
public class MyAuthHandler implements AuthHandler {

	public void timeout() {	}

	public void success(Auth auth) {
		System.out.println(auth);
	}

	public void failure(WilddogError wilddogError) {
		System.out.println(wilddogError);
	}
}
```
```java
Wilddog ref = new Wilddog("http://demo.wilddogio.com/test");
AuthHandler handler = new MyAuthHandler();
// 1.使用secret登录
ref.authWithCustomToken("PGXGTPOk4FbJYUZ4covLb4rnwkHlVltyXXXXXXX", handler);

// 2.wilddog用户登录(开发者)
ref.authWithCustomToken("fPlIkbN2KgHzrVXXXXX-82AVGRZnViEByXXXXX_9HHJvBfbIQWXfhsmNzl0kqlD4XXXXX_bJr6qqggXXXXX-engrlsAyjiEzozOwBZonuOuqMCBAXXXX_67lCvwGmsy5ALD0A5uRBiDluGu9F2XXXXX-N0eVC7cICBuWEOsn8LHxtripFV7IfbxCqY1tnXxbRUEXXXXXXX-xKGCRErXXXX", handler);

// 3.使用custom登录( JWT token)
ref.authWithCustomToken("2.00Q4iPUBuXlzeC0cXXXXXXXXXXXXXX", handler);

// 4.使用custom登录( JWT token server oauth)
ref.authWithCustomToken("2.00Q4iPUBuXlzeC0cXXXXXXXXXXXXXX", handler);
```
----

### public void  createUser(String email, String password, AuthHandler handler)
wilddog为app提供多种认证方式，包含密码认证、OAuth认证、自定义token。创建密码认证用户， 创建用户成功后自动认证。

#### Param
*  email `String` app认证用户的email账户
* password `String` app认证用户password密码
* handler `AuthHandler`
handler包含三个callback函数，用户可以实现AuthHandler接口中的函数，如果某个callback函数没有响应的处理，接口实现为`{}`函数即可。
callback函数如下：
> `success(Auth auth)` 操作成功。
> `failure()` 操作异常或失败，WilddogError作为函数参数返回给调用者。
> `timeout()` 操作超时。。

#### Ref
* auth `Auth`认证信息, 包含用户id, token; 若使用微博或微信时,  则包含oauth属性
uid `String` app用户的id
provider `String` app用户的提供者, 值包括password, custom, dev, weibo
token `String` app用户的token, 是用户访问的凭证
email `String` app用户的email
oauth `Map<String,Object>` 若使用微博或微信时, 则包含微博或微信的认证信息；否则为空

#### Return
void

#### Sample
```java
public class MyAuthHandler implements AuthHandler {

	public void timeout() {	}

	public void success(Auth auth) {
		System.out.println(auth);
	}

	public void failure(WilddogError wilddogError) {
		System.out.println(wilddogError);
	}
}
```
```java
Wilddog ref = new Wilddog("http://demo.wilddogio.com/test");
AuthHandler handler = new MyAuthHandler();
ref.createUser("demo@wilddog.com", "demo1234", handler);
```
----

### public void changeEmail(String oldEmail, String newEmail, String password, ResultHandler handler)
为app 用户提供修改email。

#### Param
*  oldEmail`String` app认证用户原来的email账户
*  newEmail`String` app认证用户新的email账户
* password `String` app认证用户password密码
* handler `ResultHandler`
handler包含三个callback函数，用户可以实现ResultHandler接口中的函数，如果某个callback函数没有响应的处理，接口实现为`{}`函数即可。
callback函数如下：
> `success()` 操作成功。
> `failure()` 操作异常或失败，WilddogError作为函数参数返回给调用者。
> `timeout()` 操作超时。。

#### Return
void

#### Sample
```java
public class MyResultHandler implements ResultHandler{

	public void timeout() {}

	public void success() {}

	public void failure(WilddogError wilddogError) {
		System.out.println(wilddogError);
	}
}
```
```java
Wilddog ref = new Wilddog("http://demo.wilddogio.com/test");
ResultHandler handler = new MyResultHandler ();
ref.createUser("demo@wilddog.com", "demo-new@wilddog.com", "demo1234", handler);
```
----

### public void changePassword(String email, String oldPassword, String newPassword, ResultHandler handler)
为app 用户提供修改email。

#### Param
*  email`String` app认证用户的email账户
*  oldPassword`String` app认证用户原来password密码
* newPassword`String` app认证用户新的password密码
* handler `ResultHandler`
handler包含三个callback函数，用户可以实现ResultHandler接口中的函数，如果某个callback函数没有响应的处理，接口实现为`{}`函数即可。
callback函数如下：
> `success()` 操作成功。
> `failure()` 操作异常或失败，WilddogError作为函数参数返回给调用者。
> `timeout()` 操作超时。。

#### Return
void

#### Sample
```java
public class MyResultHandler implements ResultHandler{

	public void timeout() {}

	public void success() {}

	public void failure(WilddogError wilddogError) {
		System.out.println(wilddogError);
	}
}
```
```java
Wilddog ref = new Wilddog("http://demo.wilddogio.com/test");
ResultHandler handler = new MyResultHandler ();
ref.changePassword("demo@wilddog.com", "demo1234", "demo5678", handler);
```
----

### public void removeUser(String email, String password, ResultHandler handler)
为app提供删除用户的功能。

#### Param
*  email`String` app认证用户的email账户
*  password`String` app认证用户password密码
* handler `ResultHandler`
handler包含三个callback函数，用户可以实现ResultHandler接口中的函数，如果某个callback函数没有响应的处理，接口实现为`{}`函数即可。
callback函数如下：
> `success()` 操作成功。
> `failure()` 操作异常或失败，WilddogError作为函数参数返回给调用者。
> `timeout()` 操作超时。。

#### Return
void

#### Sample
```java
public class MyResultHandler implements ResultHandler{

	public void timeout() {}

	public void success() {}

	public void failure(WilddogError wilddogError) {
		System.out.println(wilddogError);
	}
}
```
```java
Wilddog ref = new Wilddog("http://demo.wilddogio.com/test");
ResultHandler handler = new MyResultHandler ();
ref.removeUser("demo@wilddog.com", "demo1234", handler);
```
----

### public void resetPassword(String email, ResultHandler handler)
重置app密码。

#### Param
*  email`String` app认证用户的email账户
*  password`String` app认证用户password密码
* handler `ResultHandler`
handler包含三个callback函数，用户可以实现ResultHandler接口中的函数，如果某个callback函数没有响应的处理，接口实现为`{}`函数即可。
callback函数如下：
> `success()` 操作成功。
> `failure()` 操作异常或失败，WilddogError作为函数参数返回给调用者。
> `timeout()` 操作超时。。

#### Return
void

#### Sample
```java
public class MyResultHandler implements ResultHandler{

	public void timeout() {}

	public void success() {}

	public void failure(WilddogError wilddogError) {
		System.out.println(wilddogError);
	}
}
```
```java
Wilddog ref = new Wilddog("http://demo.wilddogio.com/test");
ResultHandler handler = new MyResultHandler ();
ref.resetPassword("demo@wilddog.com", handler);
```



## Snapshot
EventHandler触发时，作为参数传递给用户。如果是Changed、ChildChanged、ChildAdded接口获得最新的数据；如果是ChildRemoved接口获得被删除的数据。

### public Object getValue()
获得当前节点的数据。

#### Return
`Object` 如果是叶子节点，返回String、Boolean、Number类型；如果包含子树，将返回`Map<String, Object>`。

----

### public long getChildrenCount()
获得子节点的总数。

#### Return
`long` 子节点个数 。

----

### public boolean hasChild(String key)
是否包含指定子节点。

#### Param
* key `String`
子节点名称。

#### Return
`boolean` true为包含指定子节点，false为不包含。

----

### public boolean hasChildren()
是否包含子节点。

#### Return
`boolean` true为包含子节点，false为不包含。

----

### public Snapshot child(String node)
获得指定子节点的Snapshot。

#### Param
* node `String` 
子节点名称。

#### Return
`Snapshot` 

----

### public Iterator getChildren()
获得所有子节点的Snapshot。

#### Return
`Iterator<DataSnapshot>` 子节点Snapshot集合的遍历器。 

----

### public String getKey()
获得当前节点的名称

#### Return
`String` 节点名称 

----

### public boolean exists()
是否存在值，如果是叶子节点是否包含值，非叶子节点是否有后代。

#### Return
`boolean` 

----
### public Wilddog getRef()
获得数据对应的Wilddog引用，使用当前path。

#### Return
`Wilddog` 节点引用