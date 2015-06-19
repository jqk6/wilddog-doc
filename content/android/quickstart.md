/*
Title: 快速入门
Sort: 1

*/

## 1.创建账户和应用
首先注册并登陆Wilddog账号，进入[控制面板](https://www.wilddog.com/dashboard)。在控制面板中，可以创建应用(App)。每个App都拥有一个独一无二的以`wilddogio.com`结尾的URL。在同步和存取数据的时候，我们将使用这个URL。

创建App成功后，Wilddog将为你初始化一个兼容JSON数据格式的树型数据库，之后你就可以操作这个数据库了。

----

## 2.使用Wilddog Java Client




> **Download**
> 你可以在这下载BETA版 Wilddog Java SDK：
> [Download Wilddog Java SDK](https://cdn.wilddog.com/android/client/current/wilddog-client-jvm-0.4.0-SNAPSHOT.jar)

----


## 3.读写数据
首先需要创建一个引用。调用Wilddog的构造函数，传递你的App对应的URL作为参数。
```Java
Wilddog client = new Wilddog("https://<appId>.wilddogio.com/");
```
`Wilddog()`的URL参数可以包含一个Path，用于定位到树形数据的某一节点上。树型数据的某一节点可以看作一个Path，上面例子中Path为`/`，代表树形Root节点。如果URL为`https://<appId>.wilddogio.com/message`，则代表树形的`/message`。

Wilddog提供了数据读写API，通过`setValue()` `updateChildren()` `push()` `removeValue()` 修改对应节点的数据；通过`addValueEventListener()`立即读取数据，并监听某一节点数据的持续变化。

### 读数据
使用`addValueEventListener()`方法附加一个event监听，你需要实现`ValueEventListener`接口，作为`addValueEventListener()`的参数，用来处理接收到的最新的数据变化。

```Java
client.addValueEventListener(new ValueEventListener(){
	 public void onDataChange(DataSnapshot snapshot){
		 System.out.println(snapshot.getValue());
	 }
	 public void onCancelled(WilddogError error){
		 if(error != null){
			 System.out.println(error.getCode());
		 }
	 }
});
```
调用`addValueEventListener()`方法后，将在`onDataChanged()`回调函数中获得节点最新的数据，之后的数据变化将会在四个回调函数中处理。


### 写数据
我们拥有一个Wilddog引用以后，可以使用setValue给该节点设置值，值的类型为`String` `Boolean` `Number` `Map<String, Object>` 或者符合JavaBean规范的实体。
```Java
client.setValue("hello world!!!");
```
如果有client B通过`addValueEventListener()`监听了相同Path，那么在Client B上将收到上面`setValue()`的新值。

