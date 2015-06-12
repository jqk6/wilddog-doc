/*
Title : 开发向导
Sort : 2
*/


## 1.安装与设置

#### 创建一个帐号

首先，你需要[ 注册一个Wilddog帐号 ](https://www.wilddog.com/account/signup)。 一个App会被创建。每一个App都有一个独立的域名 `<appid>.wilddogio.com`。你会使用这个url 进行存储和同步数据。

#### 使用Wilddog

接下来，你需要将Wilddog源代码拷贝到你的应用目录下。wilddog源代码由include、port、sample、src目录以及Makefile组成。其中，include目录为头文件，port目录为平台相关代码，sample目录为示例，src目录为平台无关代码。目前我们提供linux平台的实现以及wiced平台（通过wifi接入网络）的实现。

下一步，你需要对采用的应用层协议以及加密方式进行配置，在linux平台下，参数位于`client.config`中，在wiced平台下，参数位于`sample/wiced/wiced.mk`中。参数及含义如下：

	#应用层协议类型，目前只支持coap
	APP_PROTO_TYPE:=coap
	#加密类型，目前支持无加密(nosec)和dtls(仅linux端，wiced端仍在调试中)
	APP_SEC_TYPE:=nosec
	#平台类型，posix或wiced
	PORT_TYPE：=wiced

接着，你可能需要对具体参数进行配置，参数位于`include/wilddog_config.h`中，含义如下：

```c
	#define WILDDOG_LITTLE_ENDIAN 1 //芯片大小端类型
	#define WILDDOG_MACHINE_BITS 32 //机器的位数
	#define WILDDOG_PROTO_MAXSIZE 1280 //应用层协议最大长度
	#define WILDDOG_REQ_QUEUE_NUM 50 //最多同时处理的消息个数
	#define WILDDOG_PING_INTERVAL 10000 //向服务器ping的时间间隔(ms)
	#define WILDDOG_RETRANSMITE_TIME 10000 //重传超时时间(ms)
	#define WILDDOG_RECEIVE_TIMEOUT 100 //每次接收网络数据包的最大等待时间(ms)
```
## 2.了解数据
当你在`wilddog.com`云端添加一个名为`myapp`的应用时，你会得到一颗名为`myapp.wilddogio.com`的树。你可以通过`myapp.wilddogio.com`找到这棵树，只是这棵树刚发芽没有任何的枝叶，往你的应用`myapp`添加你的设备使这棵树开枝散叶。

假如你的房间里东南西北角各有一个温度传感器，如何把这四个传感器表示到你的数据树上呢？

首先在你的树上开辟一个名为`TPSensor`分支，再在该分支下开辟四个名分别为`east、south、west、north`分支并挂上一个传感器，在`wilddog`云端你的数据树看起来是这样的：

![json tree](https://raw.githubusercontent.com/skylli/mycoap/master/img/json.png)

实际上在`wilddog`云端，你的数据树是用json来描述的，分支对应于json的节点：

	{
	    "mydevice": {
	        "TPSensor": {
	            "east": 25,
	            "south": 24,
	            "west": 22,
	            "north": 24
	        }
	    }
	}

在我们提供`wilddog_sdk`里采用类似json的格式来组织和描述数据，每个节点对应一个path，例如`east`传感器的path为`mydevice/east`. 每个传感器的URL由你的应用名和对应设备的path构成`myapp.wilddogio.com/mydevice/east`

每个数据都有统一资源定位：

*	通过浏览器访问地址 https://<appId>.wilddogio.com/mydevice/east，可以获取该节点JSON数据；
*	如果在登录状态可以直接访问 https://<appId>.wilddogio.com/mydevice/east，进入该节点的数据预览页面。


服务器传来的数据也会转换成`Wilddog_Node_T`格式的节点，并传递给用户的回调函数, 在`Wilddog_Node_T`格式中，数据的组织格式如下:

	~~~~~~~~~~~~~TODO 图片

注意点：

	json节点名中不能包含一些特殊ASCII 字符，在ASCII范围内只支持 0-1 a-z A-Z 和 `_` `-` `:`三个符号，除ASCII范围外，还支持UTF-8编码集；
	没有原生支持 List 与 Array 。如果试图存储一个 List 与 Array，可以采用替代方案，例如将Array的元素存放在在同一个object中。
	json长度不能超过1024Byte；
	
	
## 3.建立连接
使用App的域名，建立一个Wilddog client连接。

```c
	unsigned char* url="coap://led.wilddogio.com/led1";
	Wilddog_T client=wilddog_new(url);
```

成功返回的client定位到`/led1` 这个数据节点上。此时并没有开始同步数据。多次调用`wilddog_new()`，可以通过传入不同的URI来定位不同的数据节点。定位完节点，获得节点的id `client` ，可以对该节点进行操作。

## 4. 发送请求
请求包括以下几种：

	| 请求 | 用途 |
	| --- | --- |
	| query | 向服务端请求该节点数据 |
	| set | 设置当前节点的数据 |
	| push | 在当前节点之下新增一条数据 |
	| remove | 删除当前节点下所有数据 |
	| on | 向服务器请求关注该节点 |
	| off |  取消关注一个节点 |


## 5.接收数据
Wilddog同步生效的依赖 `wilddog_trySync()` 必须以一定的频率被调用。调用的频率取决于硬件和应用场景，每调用一次程序尝试接收来自云端的推送和其他消息。所有的事件触发和回调函数被调用都发生在`wilddog_trySync()` 过程中。

## 6.应用举例
下面以query和on为例说明。
### 发送query请求
Query操作是CoAP GET方法的具体实现。

在建立客户端的数据节点`client`后，就可以调用`Wilddog_Return_T wilddog_query(Wilddog_T wilddog, onQueryFunc callback, void* arg)`接口查询数据。当查询完成后，在`callback()`函数中根据查询到的数据对设备进行控制操作。例如根据具体的数据来控制LED的开关状态。

回调函数`callback`对数据进行处理：

```c
	STATIC void test_onQueryFunc(
		const Wilddog_Node_T* p_snapshot, 
		void* arg, 
		Wilddog_Return_T err)
	{
		
		if(err ! WILDDOG_HTTP_OK)
		{
			wilddog_debug("query error!");
			return;
		}
		wilddog_debug("query success!");
		...
		return;
	}
```

调用query接口函数：

```c    
	wilddog_query(wilddog, test_onQueryFunc, NULL);
```

使用事件循环的方式,接收网络事件并处理：

```c
    while(1)
	{
        wilddog_trySync();
    }
```

### 发送on请求

On操作是CoAP针对Observe资源的一种扩展方法的实现；它可以看做是Query操作的扩展。

同样在建立客户端的数据节点`client`后，就可以调用`Wilddog_Return_T wilddog_on(Wilddog_T wilddog, Wilddog_EventType_T event, onEventFunc onDataChange, void* dataChangeArg)`接口对指定节点数据进行Observe。观察当前数据的变化，一旦数据改变，`onDataChange`函数将被调用，这样就能对数据的连续变化进行处理。

回调函数`onDataChange`对数据进行处理：

```c
	STATIC void test_onObserveFunc(
		const Wilddog_Node_T* p_snapshot, 
		void* arg,
		Wilddog_Return_T err)
	{
		if(err ！= WILDDOG_HTTP_OK)
		{
			wilddog_debug("observe failed!");
			return;
		}
		wilddog_debug("observe data!");
		...
		return;
	}
```

调用On接口函数：

```c
    wilddog_on(wilddog, WD_ET_VALUECHANGE, test_onObserveFunc, NULL);
```

使用事件循环的方式,接收网络事件并处理：

```c
    while(1)
	{
        wilddog_trySync();
    }
```

