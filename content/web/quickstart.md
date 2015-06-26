/*
Title: 快速入门
Sort: 0
Tmpl : page-quickstart
*/


## 第一步 创建账号和应用

首先注册并登陆Wilddog账号，进入[控制面板](https://www.wilddog.com/dashboard)。在控制面板中，添加一个新的应用。你会获得一个独一无二的应用URL https://<appId>.wilddogio.com/，在同步和存取数据的时候，将使用这个URL。

----

## 第二步 引入Wilddog javascript SDK
引入Wilddog SDK非常简单，只需在HTML文件中加入一个script标签。建议直接使用wilddog cdn中的库。

```html
<script src = "https://cdn.wilddog.com/js/client/current/wilddog.js" ></script>

```

----

## 第三步 读写数据

### 创建引用

为了读写数据，你需要创建对Wilddog数据库的引用。这里会用到之前获得的应用URL `https://<appId>.wilddogio.com/`

```js
var ref = new Wilddog("https://<appId>.wilddogio.com/");

```

上面代码创建的引用将定位到数据的根节点。参数中的URL可以包含一个URI，用于定位到数据的指定节点上。如果URL为`http://<appId>.wilddogio.com/message`，那么这个引用将定位在数据的`/message`节点上。更多关于数据结构和创建引用的信息，请参见[了解数据](https://docs.wilddog.com/web/guide#2-)。

Wilddog提供了数据读写API，通过`set()` `update()` `push()` `remove()` 修改对应节点的数据；通过`on()`立即读取数据，并监听该节点数据的变化。

### 写数据
创建引用之后，就可以通过`set()` 写入任何合法的JSON数据。
```js
ref.set({
    "name" : "Hello World!",
    "author" : "Wilddog",
    "location" : {
        "city" : "beijing",
        "zip" : 100000
    }    
});
```

### 读数据
读数据是通过绑定callback函数并处理结果事件来实现的。假设我们按照上面的代码写入了数据，那么我们就可以使用`on()`函数来获取city字段的值。
```js
ref.child("location/city").on("value", function(snapshot) {
  alert(snapshot.val());   // 结果应该会alert出"beijing"
});
```
回调函数的参数是一个DataSnapshot对象类型，调用它的`val()`函数得到一个JSON数据对象。上边这个实例中，value这个事件只会在获取到数据的时候被触发一次。关于更多的事件类型，请参见[开发向导](https://docs.wilddog.com/web/guide)。

