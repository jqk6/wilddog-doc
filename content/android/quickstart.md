/*
Title: 快速入门
Sort: 1
Tmpl : page-quickstart
*/


## 第一步 创建账号和应用
首先注册并登录Wilddog账号，进入控制面板。在控制面板中，添加一个新的应用。你会获得一个独一无二的应用URL `https://<appId>.wilddogio.com/`，在同步和存取数据的时候，将使用这个URL。

----

## 第二步 引入 Wilddog Java SDK

请注意：目前只提供java版SDK，android版的SDK即将推出。

#### 使用Maven中央仓库获得SDK：
```XML
<dependency>
	<groupId>com.wilddog</groupId>
	<artifactId>wilddog-client-jvm</artifactId>
	<version>0.4.1</version>
</dependency>
```

#### 直接下载：

１，　Version 0.4.1　RELEASE版本 [下载地址](https://cdn.wilddog.com/android/client/wilddog-client-jvm-0.4.1.jar)

| 描述 | 约束 |
| --- | --- |
|MD5值|774a8cd5a65b98e8c36837524c58512a|
|SHA1值|c9ac946c9320777236fbdecdbb58f64eb56dd75d|
|SHA512值|fb55e53be7642f7fc550d4036fc8fcf20d1dc99257681e186881eabff80208ccc08ddc7e05f820ae6cb1d139e019a18757b8c6641c37c8cd59ac5a777e6f40bc|

２，最新SNAPSHOT版本 [下载地址](https://cdn.wilddog.com/android/client/wilddog-client-jvm-current-SNAPSHOT.jar)

<br><br><br>
###导入 SDK
将wilddog-client-jvm-xxx.jar拷贝到Android应用的libs目录中，然后在IDE中将jar文件添加到应用的classpath。

----

## 第三步 读写数据
###创建引用
为了读写数据，你需要创建对Wilddog数据库的引用。这里会用到之前获得的应用URL `https://<appId>.wilddogio.com/`。
```java

Wilddog ref = new Wilddog("https://<appId>.wilddogio.com/");

```


### 写数据
创建引用后，你可以使用`setValue()`方法写入数据，我们支持以下类型:
`String` `Boolean` `Number` `Map<String, Object>`等。
```java
ref.setValue("hello world!!!");
```

###读数据
你需要添加`addValueEventListener()`方法来监听URL路径下的数据变化，回调方法`onDataChange()`用于处理接收到的变化数据。

```Java

ref.addValueEventListener(new ValueEventListener(){

	 public void onDataChange(DataSnapshot snapshot){

		 System.out.println(snapshot.getValue()); //打印结果 "hello world!!!"

	 }

	 public void onCancelled(WilddogError error){

		 if(error != null){

			 System.out.println(error.getCode());

		 }

	 }

});

```
上面的例子中，回调方法onDataChange()会在第一次数据库初始化时被调用一次，接下来会在每次数据发生改变时再次被调用。

## 第四步 认证用户
野狗提供以下用户认证方式：野狗默认用户数据库、自定义用户数据库、社交账户登录（微博、微信、QQ）、匿名登录。

以默认用户数据库为例，首先需要在控制面中启用此认证方式。

1. 进入“终端用户认证”界面。
2. 切换到“野狗默认用户数据库”标签，选中“开启野狗默认用户数据库”。

现在你就可以通过代码来创建新用户了
```Java

		ref.createUser("bobtony@wilddog.com", "correcthorsebatterystaple", new Wilddog.ValueResultHandler<Map<String, Object>>() {

		    @Override
		    public void onSuccess(Map<String, Object> result) {

		        System.out.println("Successfully created user account with uid: " + result.get("uid"));

		    }

			@Override
			public void onError(WilddogError erro) {
				
			}

		});

```
当你创建完用户后，就可以使用`authWithPassword`方法来登录了。
想了解更多的终端用户认证功能，请参考 [终端用户认证](/auth/authentication)

## 第五步 数据保护 
你可以使用强大的”规则表达式”来控制数据的访问权限，并且可以实现输入数据的有效性校验。
 
不论你是否需要，野狗都强烈建议你使用”规则表达式”来限制你的数据访问权限。” 规则表达式”的语法非常强大和灵活，你可以通过它来实现数据访问的细粒度控制。
```json

{

  ".read": true,

  ".write": "auth.uid === 'admin'",

  ".validate": "newData.isString() && newData.val().length < 500"

}

```
## 第六步 了解更多

1. [开发向导](/android/guide/1)
2. [Java API](/android/api)
