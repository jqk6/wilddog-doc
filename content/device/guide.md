/*
Title : 开发向导
Sort : 2
Tmpl : page-guide
*/


## 1. C/嵌入式SDK目录结构

目录结构如下图。

	├── app
	├── client.config
	├── env.mk
	├── include
	├── Makefile
	├── port
	├── README.md
	└── src

`app` : 用户代码目录，目前存放应用示例；

`client.config` : Linux平台下Makefile的条件编译选项，参见**配置SDK**；

`env.mk/Makefile` : Linux平台下的Makefile，用于编译SDK；

`include` : 包含以下四个文件：

	wilddog.h : 提供了常用宏定义、结构体、别名的定义；

	wilddog_api.h : API接口的声明；

	wilddog_config.h : 用户可配置的参数，参见配置SDK；

	wilddog_port.h : 平台相关的函数声明；

   在SDK使用过程中，你只需要包含"wilddog_api.h"。

`port` : 平台相关的函数定义；

`src` : SDK代码存放目录。

## 2. 配置SDK

SDK包含条件编译选项和用户参数，供你对SDK进行配置。

#### 配置条件编译选项

Linux平台下，条件编译选项在SDK目录下的client.config文件中，包含以下三个选项：

	`APP_PROTO_TYPE` : 应用层协议，目前支持`coap`；

	`APP_SEC_TYPE` : 加密方式，目前支持`dtls`和无加密`nosec`；

	`PORT_TYPE` : 目前支持`posix`；

Wiced平台下，SDK嵌入了Wiced编译框架，条件编译选项在SDK目录下的app/wiced/wiced.mk中，配置项和Linux平台中相似，`PORT_TYPE`则支持`wiced`。

----

#### 配置用户参数

用户参数在SDK include目录下的wilddog_config.h中，包含如下参数：

`WILDDOG_LITTLE_ENDIAN` : 目标机字节序，如果为大端则`undef`该宏定义；

`WILDDOG_MACHINE_BITS` : 目标机位数，一般为8/16/32/64；

`WILDDOG_PROTO_MAXSIZE` : 应用层协议数据包最大长度；

`WILDDOG_REQ_QUEUE_NUM` : 数据请求队列的元素个数；

`WILDDOG_RETRANSMITE_TIME` : 单次请求超时时间，单位为ms；

`WILDDOG_RECEIVE_TIMEOUT` : 接收数据最大等待时间。

----

## 3.了解数据格式

### 3.1 云端数据格式

#### 更像一个 JSON Tree

Wilddog云存储使用树形数据结构[<font style="color:#c7254e">JSON</font>](http://json.org/json-zh.html)，替代古老的数据table的方式。每一个数据节点，都可以用一个 `path` 来表示，如下：

```JSON
	{
		"users" : {
			"lich" : { "age" : 35, "Shape" : "thin" },
			"Pudge" : {"age" : 60, "Shape" : "fat", "ability" : "gank" }
		}		
	}
```

`lich` 节点的path为`/users/lich`，该节点还有两个子节点做为它的属性。而 `Pudge` 节点可以拥有三个属性。`lich` 与 `Pudge` 节点做为 `users` 的子节点，可以将 `users` 看作一个table，`lich` 与 `Pudge` 看作 `users` 的数据项。

可以给 `users` 添加一个 `amount` 子节点，看作 `users` 的属性，如下：

```JSON
	{
		"users" : {
			"lich" : { "age" : 35, "Shape" : "thin" },
			"Pudge" : {"age" : 60, "Shape" : "fat", "ability" : "gank" },
			"amount" : 2
		}		
	}
```

----

#### 节点名称

节点名称我们称为`key`，在同一父节点下`key`的值唯一。`path`作为节点的完整名称，全局唯一。`path`的最大长度是768 Byte。`key`中不能包含一些特殊ASCII 字符，在ASCII范围内只支持 `0-1 a-z A-Z`和 `_`, `-`, `:`三个符号，ASCII范围外支持UTF-8编码集。`key`的值创建后不能修改。

----

#### 节点Value
节点值支持 `String` `Boolean` `Number` 和 `null` 。当数据为 `null` 的时候表示数据不存在（该节点已删除）。
当本节点包含子节点的时候，可以将它的整个子树看作它的value。

----

#### List 与 Array
Wilddog没有原生支持 `List` 与 `Array` 。如果试图存储一个 `List` 与 `Array`，有替代方案解决，例如对于`Array`，可以存储为一个对象节点，`Array`的下标作为`key`。如下：

```JSON
// you want this
['Jan', 'Feb', 'Mar']
// replace
{0: 'Jan', 1: 'Feb', 2: 'Mar'}
```  

----

#### Path
每个数据节点都有一个对应的 `path` 。读和写Wilddog的数据时，我们首先根据`URL`创建数据节点。其中， `URL` 包含一个 `URI` ，即使用数据节点的 `path`  作为 `URI`。

```c
Wilddog_T client = wilddog_new('coap://<appId>.wilddogio.com/test/data');
```

该引用的 `URI` 为 `/test/data`，也是数据节点的 `path`。 
因此，每个数据都有统一资源定位，通过浏览器访问地址 `coaps://<appId>.wilddogio.com/test/data.json`，可以获取该节点JSON数据；如果在登录状态可以在浏览器中直接输入URL地址 `coaps://<appId>.wilddogio.com/test/data`，进入该节点的数据预览页面。

----

### 3.2 SDK数据格式

我们的SDK使用类JSON格式，能够和云端数据互相转化。例如，我们在云端建立一个树：

![](https://cdn.wilddog.com/z/iot/images/guide_2_1.png)

在SDK中，节点的格式为`Wilddog_Node_T`，接收到云端数据后，我们建立的节点树如下：

![](https://cdn.wilddog.com/z/iot/images/guide_2_2.png)

节点支持的数据类型包括：字符串、二进制数组、整数、浮点型、布尔型、节点。支持这些类型可以构建任意数据结构， 例如节点可能包含子节点。

	#define WILDDOG_NODE_TYPE_FALSE  0 //false
	#define WILDDOG_NODE_TYPE_TRUE   1 //true
	#define WILDDOG_NODE_TYPE_NULL   2 //null
	#define WILDDOG_NODE_TYPE_NUM    3 //整数
	#define WILDDOG_NODE_TYPE_FLOAT  4 //浮点数
	#define WILDDOG_NODE_TYPE_BYTESTRING 5 //二进制数组
	#define WILDDOG_NODE_TYPE_UTF8STRING 6 //字符串
	#define WILDDOG_NODE_TYPE_OBJECT 7 //节点类型，即该节点包含子节点

## 4. 建立连接

使用App的`URL`，建立一个Wilddog client连接。

```c
	Wilddog_T client = wilddog_new("coap://demo-z.wilddogio.com/test/data");
```

当出现异常时，建立连接失败，返回 0。成功后返回建立的节点id，定位到`/test/data`上。此时并没有开始同步数据。
多次调用`wilddog_new()`，可以通过给予不同的URI来定位不同的数据节点，但是对于同一个AppId，本地仅会建立一个连接；也可以通过`wilddog_getChild()` 与 `wilddog_getParent()` 方法来定位数据节点。

定位完节点，获得节点的id，可以对该节点进行读写操作。

## 5. 获取数据

获取数据的接口包括以下几种：

接口 | 用途
----| ----
`wilddog_query()` | 获取当前节点的数据
`wilddog_on()` | 关注当前节点，数据有变化时会收到新的数据
`wilddo_off()` | 取消关注当前节点

SDK采用异步方式获取数据，因此需要用户提供回调函数，回调函数的声明为：

```c
typedef void (*onQueryFunc)
    (
    const Wilddog_Node_T* p_snapshot, 
    void* arg, 
    Wilddog_Return_T err
    );
```

回调函数中，`p_snapshot`为只读数据，退出回调函数后会被**自动销毁**，你可以直接在回调函数内根据该数据来执行动作，或通过节点操作API将该数据拷贝至用户空间。


### 5.1 wilddog_query()

`wilddog_query()`函数声明如下：

```c
Wilddog_Return_T wilddog_query
    (
    Wilddog_T wilddog, 
    onQueryFunc callback, 
    void* arg
    );
```

你可以通过调用wilddog_query()来获取数据。

```c
STATIC void test_onQueryFunc
	(
	const Wilddog_Node_T* p_snapshot, 
	void* arg, 
	Wilddog_Return_T err
	)
{
	//如果返回码不为200，说明请求出错	
	if(err != WILDDOG_HTTP_OK)
	{
		wilddog_debug("query error!");
		return;
	}
	wilddog_debug("query success!");
	if(p_snapshot)
	{
		//将数据拷贝到用户空间，需要用户free
		*(Wilddog_Node_T**)arg = wilddog_node_clone(p_snapshot);
	}
	return;
}

int main()
{
	Wilddog_T wilddog = 0;
	Wilddog_Node_T * p_node = NULL;
	//初始化SDK
	wilddog_init();
	//新建一个数据节点
	wilddog = wilddog_new("<your URL>");
	//从云端获取数据，回调函数为test_onQueryFunc，传入参数p_node，用来将获取的数据保存到用户空间
	wilddog_query(wilddog, test_onQueryFunc, (void*)(&p_node));
	while(1)
	{
		//收取数据
		wilddog_trySync();
	}
}
```

### 5.2 wilddog_on()

SDK通过增加监听事件来获得数据，监听事件将触发一次数据的初始化和同步后续数据变化。`wilddog_on()`函数声明如下：

```c
Wilddog_Return_T wilddog_on
	(
	Wilddog_T wilddog, 
	Wilddog_EventType_T event, 
	onEventFunc onDataChange, 
	void* dataChangeArg
	);
```

使用`wilddog_on()`监听一个数据节点的变化：

```c
wilddog_on(client, WD_ET_VALUECHANGE, callback, args);
```

`Wilddog_EventType_T`代表事件类型，SDK目前只支持`WD_ET_VALUECHANGE`，即监听数据节点的所有数据变化。

```c
//每次云端有新数据到来，该函数都会被调用
STATIC void test_onObserveFunc
	(
	const Wilddog_Node_T* p_snapshot, 
	void* arg, 
	Wilddog_Return_T err
	)
{
	//如果返回码不为200，说明请求出错	
	if(err != WILDDOG_HTTP_OK)
	{
		wilddog_debug("query error!");
		return;
	}
	wilddog_debug("query success!");
	if(p_snapshot)
	{
		//将数据拷贝到用户空间，需要用户free
		*(Wilddog_Node_T**)arg = wilddog_node_clone(p_snapshot);
	}
	return;
}

int main()
{
	Wilddog_T wilddog = 0;
	Wilddog_Node_T * p_node = NULL;
	//初始化SDK
	wilddog_init();
	//新建一个数据节点
	wilddog = wilddog_new("<your URL>");
	//从云端获取数据，回调函数为test_onObserveFunc，传入参数p_node，用来将获取的数据保存到用户空间
	wilddog_on(wilddog, WD_ET_VALUECHANGE, test_onObserveFunc, (void*)(&p_node));
	while(1)
	{
		//收取数据
		wilddog_trySync();
	}
}
```

## 6. 修改数据

修改数据的接口包括以下几种：

接口 | 用途
----| ----
`wilddog_set()` | 设置当前节点的数据
`wilddog_push()` | 在当前节点之下新增一条数据
`wilddo_remove()` | 删除当前节点下所有数据

### 6.1 wilddog_set()

SDK通过 `wilddog_set()` 保存新的数据到App中，它将替换当前path节点的所有数据。我们将构建一个简单的wildblog App，来理解这些API的使用。把我们的wildblog程序的数据保存到下面这个`URL`中：

```c
Wilddog_T client = wilddog_new("coap://demo-blog.wilddogio.com/wildblog");
```

开始，我们需要在wildblog app中创建一些用户，使用用户名作为节点的key，并包含用户的属性，如昵称、出生年份、blog等级和访问量。因为我们需要明确定义用户名，我们使用`wilddog_set()` ，而不是使用`wilddog_push()`。

####创建一个blog的节点树

首先我们需要实现一个函数，来创建用户，传入参数为用户名、用户的属性，昵称、出生年份、blog等级和访问量，返回值为创建的节点树。

```c
Wilddog_Node_T *test_createUser
	(
	char * p_name, 
	char* p_nick,
	int birthYear,
	int blogLevel,
	int pv
	)
{
	Wilddog_Node_T *p_head = NULL;
	Wilddog_Node_T *p_attr, *p_nick, *p_year, *p_lvl, *p_pv;
	
	//创建用户节点，key为用户名
	p_head = wilddog_node_createObject(p_name);
	
	//创建用户昵称
	p_nick = wilddog_node_createUString("nick", p_nick);

	//创建用户出生年份
	p_year = wilddog_node_createNum("year", birthYear);

	//创建blog等级
	p_lvl = wilddog_node_createNum("level", blogLevel);

	//创建访问量
	p_pv = wilddog_node_createNum("PV", pv);
	
	//将创建的节点链接到用户节点，作为子节点
	wilddog_node_add(p_head, p_nick);
	wilddog_node_add(p_head, p_year);
	wilddog_node_add(p_head, p_lvl);
	wilddog_node_add(p_head, p_pv);

	return p_head;
}
```

接着，我们创建几个用户，并添加到节点树中：

```c
Wilddog_Node_T *p_node , *p_user1, *p_user2, *p_user3;

//创建wildblog节点
p_node = wilddog_node_createObject("wildblog");
//创建几个用户
p_user1 = test_createUser("Jackson", "binxu", 1986, 1, 123);
p_user2 = test_createUser("Tim", "beibei", 1983, 0, 1234);
p_user3 = test_createUser("Jason", "wangjibo", 1988, 2, 12345);

//将创建的用户节点树链接到wildblog节点，作为子节点
wilddog_node_add(p_node, p_user1);
wilddog_node_add(p_node, p_user2);
wilddog_node_add(p_node, p_user3);
```

现在我们获取到一个`p_node`，即想要向服务器保存的数据，构造过后的树如下：

```JSON
"wildblog": {
	"Jackson": {
		"nick": "liaobinxu",
		"year": "1986",
		"level": 1,
		"pv": 123
		},
	"Tim": {
		"nick": "beibei",
		"year": "1983",
		"level": 0,
		"pv": 1234
	},
	"Jason": {
		"nick": "wangjibo",
		"year": "1988",
		"level": 2,
		"pv": 12345
	}
}
```

----

#### 将数据保存到云端

接下来，我们通过`wilddog_set()`函数将这颗树保存到云端。

```c
wilddog_set(client, p_node, callback, NULL);

while(1)
{
	wilddog_trySync();
}
```

**注意：使用setValue()将覆盖当前位置的数据，包括下级所有子节点 。**

----

### 6.2 wilddog_push()

现在已经有了用户，需要增加一个发布blog的功能。你会想到使用`wilddog_set()`，这样是可以的。但是blog不像用户，用户可以使用唯一的用户名做key，blog的话要自己准备唯一key，不免有些麻烦。SDK提供一个`wilddog_push()` 接口，这个接口将会为新建的数据创建一个唯一ID，ID本身是按照时间戳转义的字符串。

```c
//新建"Jason"这个数据节点，它是client 节点的子节点，所以我们直接采用wilddog_getChild方法。
Wilddog_T user_jason = wilddog_getChild(client, "Jason");
 
//"Jason"创建一个blog，标题为text,内容为"hello world"
Wilddog_Node_T *p_node = wilddog_node_createUString("text", "hello world");

//将数据保存到云端
wilddog_push(user_jason, p_node, test_onPushFunc, NULL);
```

`wilddog_push()`成功后，回调函数中能够获取所push内容的`path`，回调函数如下：

```c
STATIC void test_onPushFunc(u8 *p_path,void* arg, Wilddog_Return_T err)
{
	if(err < WILDDOG_HTTP_OK || err >= WILDDOG_HTTP_NOT_MODIFIED)
	{
		wilddog_debug("push failed");
		return;
	}		
	wilddog_debug("new path is %s", p_path);
	return;
}
```

### 6.3 wilddog_remove()
错误发布了一篇Blog，需要为用户提供一个删除的途径，在SDK中可以使用`wilddog_remove()`。假设刚才"Jason"发布的blog的ID为"12345678"：

```c
//新建"12345678"这个数据节点，它是"Jason"的子节点，所以我们直接采用wilddog_getChild方法。
Wilddog_T blog = wilddog_getChild(user_jason, "12345678");

wilddog_remove(blog, callback, NULL);
```

## 7. 使用Auth登录

上面的例子中使用的系统比较简陋，不能做ACL，比如获得用户自己的blog列表，用户只能删除自己的blog，等等。因此我们在云端提供了规则表达式功能，用户可以自定义ACL，请查看[<font style="color:#c7254e">规则表达式</font>](https://z.wilddog.com/rule/quickstart)。SDK也提供了`wilddog_setAuth()`接口配合完成用户规则，接口定义如下：

```c
Wilddog_Return_T wilddog_setAuth
    (
    Wilddog_Str_T * p_host, 
    u8 *p_auth, 
    int len, 
    onAuthFunc onAuth, 
    void* args
    )
```

每个host，即`<appId>.wilddogio.com`共用一个Auth Key，通过调用`wilddog_setAuth()`接口，能够实现鉴权。Auth Key的获取方式正在开发中，敬请期待。

## 8. 移植SDK

目前SDK已经成功移植到Wiced平台上，我们以此为例，说明如何移植SDK。

### 将SDK拷贝到目标位置

首先，我们将SDK解压，并拷贝到`WICED-SDK-3.1.2\WICED-SDK\apps`中，即SDK位于`WICED-SDK-3.1.2\WICED-SDK\apps\wilddog.0.4.2\`。

由于Wiced平台特殊要求，目录名不能带有 `'.'`或`'-'`，因此我们将`wilddog.0.4.2`改为`wilddog`。

Wiced平台采用WICED IDE，打开WICED IDE，能够在工程下的`apps`目录下找到我们的SDK。

![](https://cdn.wilddog.com/z/iot/images/wiced-wilddog.png)

----

### 移植条件编译选项

Wiced平台需要用户完成Makefile，格式有严格要求，Makefile文件名称的前缀必须与目录名相同，以我们的例子为例，如下图：

![](https://cdn.wilddog.com/z/iot/images/wiced-make.png)

在`wiced.mk`中添加编译选项，并补完Makefile，详见`wiced.mk`文件。

注意：如果你的平台不支持自定义Makefile，那么请根据条件编译选项，仅将你所需的文件拷贝到平台下，避免出现重定义。需要选择拷贝的路径有：

`APP_PROTO_TYPE` : src/connecter/appProto目录下，根据编译选项拷贝文件夹；

`APP_SEC_TYPE` ： src/connecter/secure目录下，根据编译选项拷贝文件夹；

`PORT_TYPE` ： port/目录下，根据编译选项拷贝文件夹，如果你的平台不属于`posix`或`wiced`，那么你需要自己实现平台相关的函数接口。

----

### 实现平台相关代码

需要实现的平台相关函数接口位于include/wilddog_port.h，如下：

```c
int wilddog_gethostbyname(Wilddog_Address_T* addr,char* host);
int wilddog_openSocket(int* socketId);
int wilddog_closeSocket(int socketId);
int wilddog_send
    (
    int socketId,
    Wilddog_Address_T*,
    void* tosend,
    s32 tosendLength
    );
int wilddog_receive
    (
    int socketId,
    Wilddog_Address_T*,
    void* toreceive,
    s32 toreceiveLength, 
    s32 timeout
    );
```

----

### 运行示例

移植完成后，你可以运行示例确认是否移植成功，下面以Wiced平台为例：

#### 配置wifi和URL

打开`app/wiced/wifi_config_dct.h`填写热点名称和密码：

	/* This is the default AP the device will connect to (as a client)*/
	#define CLIENT_AP_SSID       "your ssid"
	#define CLIENT_AP_PASSPHRASE "your ap password"

配置URL：

	#define TEST_URL "coaps://<appId>.wilddogio.com/"

#### 建立Target

在Make Target 窗口新建编译目标

`wilddog.app.wiced-<yourboard> download run`

其中`<yourboard>`为你的开发板型号，SDK所用的wiced开发板是BCM943362WCD4，因而Target name 是 

`wilddog.app.wiced-BCM943362WCD4 download run`

#### 编译烧录运行

让你的wiced开发板通过USB连接电脑，USB驱动在`WICED-SDK-3.1.2\WICED-SDK\tools\drivers`中。

双击Make Target窗口刚刚建立的Target：`wilddog.app.wiced-<yourboard> download run`，编译完成后会自动烧录到开发板中运行。


