/*
Title : 开发向导
Sort : 2
*/


## 1.安装与设置

#### 创建一个帐号

首先，你需要[ 注册一个Wilddog帐号 ](https://www.wilddog.com/account/signup)。 一个App会被创建。每一个App都有一个独立的域名 `<appid>.wilddogio.com`。你会使用这个url 进行存储和同步数据。

#### 使用Wilddog

接下来，你需要将Wilddog源代码拷贝到你的应用目录下，需要拷贝的为src和ports目录。其中，src目录为平台无关代码，ports目录为平台相关代码。目前我们提供linux平台的实现以及wiced平台（通过wifi接入网络）的实现。

下一步，如果需要的话，你可以对参数进行配置，参数位于`src/wilddog_config.h`中。参数及含义如下：

```c
	#define WILDDOG_SERVER_PORT 5683//CoAP监听端口
	#define WILDDOG_BUF_SIZE 1280//CoAP数据包最大长度
	#define WILDDOG_LOOP_PER_SECOND 100//每秒循环次数
	#define WILDDOG_RECV_TIMEOUT 10000 //接收操作超时时间 ms
	#define WILDDOG_OBSERVE_TIMEOUT 0//观察操作超时时间 ms
	#define WILDDOG_PING_INTV 20000//ping的间隔 ms
	#define WILDDOG_RECONNECT_THRESHOLD 30000//重连间隔 ms
```
## 2.了解数据
当你在`wilddog.com`云端添加一个名为`myapp`的应用时，你会得到一颗名为`myapp.wilddogio.com`的树。你可以通过`myapp.wilddogio.com`找到这棵树，只是这棵树刚发芽没有任何的枝叶，往你的应用`myapp`添加你的设备使这棵树开枝散叶。

假如你的房间里东南西北角各有一个温度传感器，如何把这四个传感器表示到你的数据树上呢？

首先在你的树上开辟一个名为`TPSensor`分支，再在该分支下开辟四个名分别为`east、south、west、north`分支并挂上一个传感器，在`wilddog`云端你的数据树看起来是这样的：

![json tree](https://raw.githubusercontent.com/skylli/mycoap/master/img/json.png)

实际上在`wilddog`云端，你的数据树是用json来描述的，分支对应于json的节点：

    	{
        "mydevice" : {
            "TPSensor" : {"east": 25, "south" : 24, "west" : 22,"north":24 }
        	}        
    	}

在我们提供`wilddog_sdk`里同样是利用json来组织和描述数据，每个节点对应一个path，例如`east`传感器的path为`mydevice/east`,每个传感器的URL由你的应用名和对应设备的path构成`myapp.wilddogio.com/mydevice/east`
每个数据都有统一资源定位：

	通过浏览器访问地址 https://<appId>.wilddogio.com/mydevice/east，可以获取该节点JSON数据；
	如果在登录状态可以直接访问 https://<appId>.wilddogio.com/mydevice/east，进入该节点的数据预览页面。


服务器传来的数据也会转换成json格式放置在`Wilddog.data`下，比如你访问`TPSensor`，你得到的json为：

	{"east": 25, "south" : 24, "west" : 22,"north":24 }

注意点：

	json节点名中不能包含一些特殊ASCII 字符，在ASCII范围内只支持 0-1 a-z A-Z 和 `_` `-` `:`三个符号，ASCII范围外支持UTF-8编码集；
	没有原生支持 List 与 Array 。如果试图存储一个 List 与 Array，有替代方案解决，可以被存储为一个对象节点，整数作为key
	json整个长度有限制不能超过1024Byte；
	
	
## 3.建立连接
使用App的域名，建立一个Wilddog client连接。

```c
	unsigned char* url="coap://led.wilddogio.com/led1";
	wilddog_t* client=wilddog_new(url);
```

成功返回的client定位到`/led1` 这个数据节点上。此时并没有开始同步数据。多次调用`wilddog_new()`，可以通过传入不同的URI来定位不同的数据节点，但是对于同一个AppId，本地仅会建立一个连接。定位完节点，获得节点的引用 `client` ，可以对该节点进行操作。

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

在建立客户端的数据节点`wilddog_t`后，就可以调用`int wilddog_query(wilddog_t* wilddog, onCompleteFunc callback)`接口查询数据。当查询完成后，在`onQueryComplete()`函数中根据查询到的数据对设备进行控制操作。例如根据具体的数据来控制LED的开关状态。

回调函数`callback`对数据进行处理：

```c
	void onQueryComplete(wilddog_t* wilddog,handle,int errCode){
    if(errCode<0)
        printf("query error:%d",errCode)
    else{
       cJSON* data= wilddog->data;
       //do something with data via cJSON API
		 //e.g. switch the LED depend on the data
    	}
	}
```

调用query接口函数：

```c    int handle=wilddog_query(client,onQueryComplete);```

使用事件循环的方式,接收网络事件并处理：

```c
    while(1){
        
        wilddog_trySync(client);
    }
```

### 发送on请求

On操作是CoAP针对Observe资源的一种扩展方法的实现；它可以看做是Query操作的扩展。

同样在建立客户端的数据节点`wilddog_t`后，就可以调用`int wilddog_on(wilddog_t* wilddog, onDataFunc onDataChange, onCompleteFunc callback)`接口对指定节点数据进行Observe。观察当前数据的变化，一旦数据改变，`onDataChange`函数将被调用，这样就能对数据的连续变化进行处理。

回调函数`onDataChange`对数据进行处理：

```c
	void onDataChange(wilddog_t* wilddog,cJSON* value){
	  if(value==NULL){
	      return ;
	  }
	  char* c=cJSON_print(value);
	  printf("new data is: %s",c);
	  free(c);
	}
```

调用On接口函数：

```c    int handle=wilddog_on(wd,onDataChange,NULL)；```

使用事件循环的方式,接收网络事件并处理：

```c
    while(1){
        
        wilddog_trySync(client);
    }
```

