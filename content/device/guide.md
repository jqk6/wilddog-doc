/*
Title : 开发向导
Sort : 2
*/


## 1.安装与设置

#### 创建一个帐号

首先，你需要[ 注册一个Wilddog帐号 ](https://www.wilddog.com/account/signup)。 注册完成后会创建一个App。每一个App都有一个独立的域名 `<appid>.wilddogio.com`。你将使用这个url 进行存储和同步数据。

#### 使用Wilddog

接下来，你需要将Wilddog源代码拷贝到你的应用目录下。wilddog源代码由include、port、sample、src目录以及Makefile组成。其中，include目录为头文件，port目录为平台相关代码，sample目录为示例代码，src目录为平台无关代码。目前我们提供Linux平台的实现以及wiced平台（通过wifi接入网络）的实现。

下一步，你需要对采用的应用层协议以及加密方式进行配置，在Linux平台下，参数位于`client.config`中，在wiced平台下，参数位于`sample/wiced/wiced.mk`中。参数及含义如下：

	#应用层协议类型，目前只支持coap
	APP_PROTO_TYPE:=coap
	#加密类型，目前支持DTLS加密和无加密
	APP_SEC_TYPE:=dtls
	#平台类型，posix或wiced
	PORT_TYPE：=wiced

接着，你可能需要对具体参数进行配置，参数位于`include/wilddog_config.h`中，含义如下：

```c
	#define WILDDOG_LITTLE_ENDIAN 1 //芯片大小端类型
	#define WILDDOG_MACHINE_BITS 32 //机器的位数
	#define WILDDOG_PROTO_MAXSIZE 1280 //应用层协议最大长度
	#define WILDDOG_REQ_QUEUE_NUM 50 //最多同时处理的消息个数
	#define WILDDOG_RETRANSMITE_TIME 10000 //重传超时时间(ms)
	#define WILDDOG_RECEIVE_TIMEOUT 100 //每次接收网络数据包的最大等待时间(ms)
```
## 2.数据结构
`Wilddog_C_SDK`的设计目标是使你通过`URL`即可访问和操作你的设备或传感器，同时设备和传感器也可以通过`URL`访问、操作其他设备或传感器。在云端你的设备数据是通过Json格式表示，在SDK中则通过树形的节点表示。
### 2.1了解云端数据
当你在`wilddogio.com`云端添加一个名为`myapp`的应用时，你会得到一颗名为`myapp.wilddogio.com`的树。你可以通过`myapp.wilddogio.com`找到这棵树，初始状态下该树并没有任何叶子节点。

假如你的房间里东南西北角各有一个温度传感器，将这四个传感器表示到你的数据树上，可通过如下操作：

首先在你的树上开辟一个名为`mydevice`分支，再在该分支下开辟四个名分别为`east、south、west、north`分支对应四个传感器，在云端你的数据树看起来是这样的：

![json tree](https://cdn.wilddog.com/z/iot/images/guide_2_1.png)

实际上在云端，你的数据树是用Json格式来描述的，分支对应于Json的节点：

	{
	    "mydevice": {
	        "mySensor": {
	            "east": 25,
	            "south": 24,
	            "west": 22,
	            "north": 24
	        }
	    }
	}

每个温度传感器均有独一无二的Url,通过该Url可以访问和操作你的传感器：

	east：myapp.wilddogio.com/temperature/mydevice/east 
	south：myapp.wilddogio.com/temperature/mydevice/south 
	west：myapp.wilddogio.com/temperature/mydevice/west 
	north：myapp.wilddogio.com/temperature/mydevice/north 

### 2.2 建立和操作数据
在SDK中，每一级节点都都对应于路径path中的每一段，节点的key为该path的字符（注意path只能为字符，同时节点的key也只能为字符），上一级和下一级路径分别为其父节点和子节点(如mydevice和east)，同级路径为兄弟节点（如east和south），整个路径通过遍历链表的节点来查询和管理，上面四个传感器的Path如下:

	/temperature/mydevice/east
	/temperature/mydevice/south
	/temperature/mydevice/west
	/temperature/mydevice/north

构建该节点的对应的接口参考C-API和SDK的`./sample/posix/demo.c`. 

构建好该节点结构就可以发出URL请求，更新各个传感器的值，或者订阅各个传感器的状态。

服务器传来的数据也会转换成`Wilddog_Node_T`格式的节点树，并将节点树数据传递给用户的回调函数, 在`Wilddog_Node_T`格式中，数据的组织格式如下:

 ![json tree](https://cdn.wilddog.com/z/iot/images/guide_2_2.png)

注意点：

	节点名中不能包含一些特殊ASCII 字符，在ASCII范围内只支持 0-1 a-z A-Z 和 `_` `-` `:`三个符号，除ASCII范围外，还支持UTF-8编码集；
	我们没有原生支持 List 与 Array 。如果试图存储一个 List 与 Array，可以采用替代方案，例如将Array的元素存放在在同一个object中；
	Json长度不能超过1024Byte；
	
	
## 3.建立连接
使用一个App的url，我们可以建立一个连接，例如：

```c
	unsigned char* url="coap://myapp.wilddogio.com/temperature/mydevice/east";
	Wilddog_T client=wilddog_new(url);
```

成功返回的节点id定位到`/temperature/mydevice/east` 这个数据节点上。此时并没有开始同步数据。多次调用`wilddog_new()`，可以通过传入不同的URI来定位不同的数据节点。定位完节点，获得节点的id ，可以对该节点进行操作。

## 4.发送请求
请求包括以下几种：

	| 请求 | 用途 |
	| ----| ---- |
	| query | 向服务端请求该节点数据 |
	| set | 设置当前节点的数据 |
	| push | 在当前节点之下新增一条数据 |
	| remove | 删除当前节点下所有数据 |
	| on | 向服务器请求关注该节点 |
	| off |  取消关注一个节点 |


## 5.接收数据
SDK同步生效的依赖 `wilddog_trySync()` 必须以一定的频率被调用。调用的频率取决于硬件和应用场景，每一次调用程序尝试接收来自云端的推送和其他消息。所有的事件触发和回调函数都发生在`wilddog_trySync()` 过程中。
## 6.时间同步
SDK会维护一个本地计时器来保证SDK中所有需要时间的模块，例如超时重传，在每次调用`wilddog_trySync()`时更新该计时器。注意，这个计时器并不保证精度，想要更精确的计时，请用户手动调用`wilddog_timeIncrease()`函数增加计时器的计数。
## 7.应用举例
下面以query和on为例说明。
### 发送query请求
Query操作是CoAP GET方法的具体实现。

在建立客户端的数据节点后，就可以调用`Wilddog_Return_T wilddog_query(Wilddog_T wilddog, onQueryFunc callback, void* arg)`接口查询数据。当查询完成后，在`callback()`函数中根据查询到的数据对设备进行控制操作。

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

#### 发送on请求

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

