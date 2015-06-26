/*
Title: C API文档
Sort: 3
*/

# Wilddog

## wilddog\_init()

###### 定义

void wilddog\_init(void)

###### 说明 
 初始化wilddog SDK.

###### 返回值
void

----
## wilddog\_new()

###### 定义
Wilddog\_T wilddog\_new(Wilddog\_Str\_T *url)

###### 说明
 初始化一个关联应用ID 和路径的url的 Wildog 客户端

###### 参数

* Wilddog\_Str\_T* `url`关注节点url,Wilddog 中任何数据都能够通过一个url来进行访问，如`coap[s]://<appid>.wilddogio.com/<path>` 
其中<appid>为开发者在 wilddog 平台申请的应用id.
<path>为客户端关心的路径.

###### 返回值
 `Wilddog_T` 类型的客户端ID，如果创建失败，返回0.

###### 示例
```c
int main()
{
	//init client
	Wilddog_T wilddog=wilddog_new("coaps://myapp.wilddogio.com/user/jackxy/device/light/10abcde");
	//do something
	...
	//recycle memeory
	wilddog_destroy(&wilddog);
}
```
----
## wilddog\_getParent()

###### 定义

Wilddog\_T wilddog\_getParent(Wilddog\_T wilddog)

###### 说明

获取父节点的ID。如果当前节点是root节点，函数执行后返回root节点本身的ID。

###### 参数

* Wilddog\_T `wilddog`查询节点的ID

###### 返回值

返回父节点的id，如果创建失败，返回0.

###### 示例
```c
//定位到user/jackxy
Wilddog_T wilddog=wilddog_new("coaps://myapp.wilddogio.com/user/jackxy");
//定位到user
Wilddog_T parent = wilddog_getParent(wilddog);
```
----
## wilddog\_getRoot

###### 定义
Wilddog\_T wilddog\_getRoot(Wilddog\_T wilddog)

###### 说明

 获取根节点ID。

###### 参数

* Wilddog\_T `wilddog` 当前节点的ID

###### 返回值

Wilddog\_T `root` 根节点的ID，如果失败，返回0。 

###### 示例
```c
//定位到user/jackxy
Wilddog_T wilddog=wilddog_new("coaps://myapp.wilddogio.com/user/jackxy");
//定位到root("/")
Wilddog_T root = wilddog_getRoot(wilddog);
```
----

## wilddog\_getChild（）

###### 定义
Wilddog\_T wilddog\_getChild(Wilddog\_T wilddog, Wilddog\_Str\_T * childName)

###### 说明

 查询当前节点下名字为childName的子节点ID。

###### 参数

* Wilddog\_T `wilddog`当前节点ID

* Wilddog\_Str\_T `* childName`
子节点的相对路径，多级子节点需用'/'隔开，即使子节点不存在也能创建.

###### 返回值
`Wilddog_T` 
子节点的id，如果创建失败，返回0.


###### 示例
```c
//定位到user/jackxy
Wilddog_T wilddog=wilddog_new("coaps://myapp.wilddogio.com/user/jackxy");
//定位到user/jackxy/aaa
Wilddog_T child = wilddog_getChild(wilddog, "aaa");
```
----
## wilddog\_getKey()

###### 定义

Wilddog\_Str\_T *wilddog\_getKey(Wilddog\_T wilddog)

###### 说明

 获取当前节点的名称key.
###### 参数
Wilddog\_T `wilddog` 当前节点ID

###### 返回值

 `Wilddog_Str_T` 如果获取失败，返回NULL.

----
## wilddog\_destroy()
###### 定义
Wilddog\_Return\_T wilddog\_destroy(Wilddog\_T *p\_wilddog)

###### 说明
 销毁一个客户端回收内存.
 
###### 参数

* Wilddog\_T* `p_wilddog`
 节点的ID.

###### 返回值

 `Wilddog_Return_T` 返回 `0`:成功 `<0`:失败.

----

## wilddog\_setAuth（）

###### 定义
Wilddog\_Return\_T wilddog\_setAuth(Wilddog\_Str\_T *p\_host, u8 *p\_auth,int len,onAuthFunc onAuth,void* args);

###### 说明
 发送Auth数据到服务器进行认证。

###### 参数

* Wilddog\_Str\_T `*p_host`进行auth认证的host字符串，如 `"<appid>.wilddogio.com"`；

* u8 `*p_auth` auth的数据指针；

* int `len` auth数据的长度

* onAuthFunc `onAuth`  服务端回应认证或者等待认证超时触发的回调函数，类型是`void (*onAuthFunc)(void* arg, Wilddog_Return_T err)`，其中`arg`为用户传递的值，（即下面的`args`），`err`为状态码，具体见`Wilddog_Return_T`定义。

void `*args`用户参数接口，该值会传递到`onAuth`中

###### 返回值
 `Wilddog_Str_T` 返回0则为成功发送Auth数据，负数则发送Auth失败，注意该返回值仅表明auth是否成功发送，是否通过服务器的认证在你的回调函数中判断。
###### 示例
```c
void myOnAuthFunc(void* arg, Wilddog_Return_T err)
{
	if(err < WILDDOG_ERR_NOERR || err >= WILDDOG_HTTP_BAD_REQUEST)
	{
		printf("auth fail!\n");
		return;
	}
	printf("hello world! %d\n", (int)arg);
	return;
}
//aquired a new auth token
char* newToken="ABCD1234567890"
int args = 0;
wilddog_setAuth("aaa.wilddogio.com",newToken, strlen(newToken), myOnAuthFunc, (void*)&args);
...
```
----
## wilddog\_query（）

###### 定义
Wilddog\_Return\_T wilddog\_query(Wilddog\_T wilddog,onQueryFunc callback,void* arg)

###### 说明
 获取当前节点的数据,数据格式为`Wilddog_Node_T`(类似JSON).
 
###### 参数

* Wilddog\_T `wilddog` 客户端ID

* onQueryFunc `callback` 服务端回应数据或者接受等待超时触发的回调函数,类型是`void (*onQueryFunc)(const Wilddog_Node_T* p_snapshot, void* arg, Wilddog_Return_T err)`,其中`p_snapshot`是取回的数据镜像（err为200时）或者NULL，**退出函数后即被销毁**, `arg`为用户传递的值, `err`为状态码

* void* `arg` 即用户给回调函数的arg

###### 返回值

 `Wilddog_Return_T` 返回 `0`:成功 `<0`:失败.
 
###### 示例
```c
STATIC void test_onQueryFunc(
	const Wilddog_Node_T* p_snapshot, 
	void* arg, 
	Wilddog_Return_T err)
{
	
	if(err != WILDDOG_HTTP_OK)
	{
		wilddog_debug("query error!");
		return;
	}
	wilddog_debug("query success!");
	if(p_snapshot)
	{
		*(Wilddog_Node_T**)arg = wilddog_node_clone(p_snapshot);
	}
	
	return;
}
int main(void)
{
	Wilddog_T wilddog = 0;
	Wilddog_Node_T * p_node = NULL;
	
	wilddog_init();
	
	wilddog = wilddog_new(<url>);

	wilddog_query(wilddog, test_onQueryFunc, (void*)(&p_node));
	while(1)
	{
		if(p_node)
		{
			_wilddog_debug_printnode(p_node);
			...
			wilddog_node_delete(p_node);
		}
		wilddog_trySync();
	}
	...
	wilddog_destroy(&wilddog);
}

```
----
## wilddog\_set()

###### 定义
Wilddog\_Return\_T wilddog\_set(
Wilddog\_T wilddog,
Wilddog\_Node\_T *p\_node,
onSetFunc callback,
void* arg)

###### 说明
 设置当前节点的数据,数据格式为`Wilddog_Node_T`.
 
###### 参数
* Wilddog\_T `wilddog` 当前节点的ID
* Wilddog\_Node\_T `*p_node` 节点存储格式.
* onSetFunc `callback` 服务端回应或者等待f服务器回应超时触发的回调函数 ,类型是`void (*onSetFunc)(void* arg, Wilddog_Return_T err)`,其中`arg`为用户传递的值,`err`为状态码
* void* `arg` 用户给回调函数的`callback`的参数`arg`

###### 返回值

`Wilddog_Return_T` 返回 `0`:成功 `<0`:失败.

###### 示例
```c
STATIC void test_onSetFunc(void* arg, Wilddog_Return_T err)
{
						
	if(err < WILDDOG_HTTP_OK || err >= WILDDOG_HTTP_NOT_MODIFIED)
	{
		wilddog_debug("set error!");
		return;
	}
	wilddog_debug("set success!");
	*(BOOL*)arg = TRUE;
	return;
}
int main(void)
{
	BOOL isFinish = FALSE;
	Wilddog_T wilddog = 0;
	Wilddog_Node_T * p_node = NULL;

	wilddog_init();

	/* create a node to "wilddog", value is "123456" */
	p_node = wilddog_node_createUString(NULL,"123456");

	wilddog = wilddog_new(<url>);

	wilddog_set(wilddog,p_node,test_onSetFunc,(void*)&isFinish);
	wilddog_node_delete(p_node);
	while(1)
	{
		if(TRUE == isFinish)
		{
			wilddog_debug("set success!");
			...
		}
		wilddog_trySync();
	}
	wilddog_destroy(&wilddog);
}
```
----
## wilddog\_push（）

###### 定义
Wilddog\_Return\_T wilddog\_push(
Wilddog\_T wilddog, 
Wilddog\_Node\_T *p\_node, 
onPushFunc callback, 
void* arg)
###### 说明
 在当前节点之下新增一条数据,数据的key由服务端生成.

###### 参数 

* Wilddog\_T `wilddog` 当前节点的ID
* Wilddog\_Node\_T `*p_node` 新增`node`的ID
* onPushFunc `callback` 函数指针 ,类型是`(*onPushFunc)(Wilddog_Str_T * p_newPath, void* arg, Wilddog_Return_T err)`,其中 `p_newPath` 是新增数据的完整path,`arg` 为用户传递的值,`err`为状态码. 
* void `*arg` 用户给回调函数的`callback`的参数`arg`.

  
###### 返回值
`Wilddog_Return_T` 返回 `0`:成功 `<0`:失败.

###### 示例
```c
STATIC void test_onPushFunc(u8 *p_path,void* arg, Wilddog_Return_T err)
{
						
	if(err < WILDDOG_HTTP_OK || err >= WILDDOG_HTTP_NOT_MODIFIED)
	{
		wilddog_debug("push failed");
		return;
	}		
	wilddog_debug("new path is %s", p_path);
	*(BOOL*)arg = TRUE;
	return;
}
int main(void)
{
	BOOL isFinish = FALSE;
	Wilddog_T wilddog;
	Wilddog_Node_T * p_node = NULL, *p_head = NULL;
	wilddog_init();

	p_head = wilddog_node_createObject(NULL);
	p_node = wilddog_node_createNum("2",1234);
	wilddog_node_add(p_head, p_node);
	
	wilddog = wilddog_new(<url>);
	wilddog_push(wilddog, p_head, test_onPushFunc, (void *)&isFinish);	
	wilddog_node_delete(p_head);
	
	while(1)
	{
		if(isFinish)
		{
			wilddog_debug("push success!");
			break;
		}
		wilddog_trySync();
	}
	wilddog_destroy(&wilddog);
}

```
----

## wilddog\_remove()

###### 定义
Wilddog\_Return\_T wilddog\_remove(
Wilddog\_T wilddog, 
onRemoveFunc callback, 
void* arg)

###### 说明
 删除当前节点下所有数据

###### 参数

* Wilddog\_T `wilddog`当前节点的ID
* onRemoveFunc `callback`收到服务器回应或则等待服务器回应超时触发的回调函数，类型是`void (*onRemoveFunc)(void* arg, Wilddog_Return_T err)`,其中`arg` 为用户传递的值,`err`为状态码。
* void `*arg` 用户传给回调函数的`arg`.

###### 返回值
`Wilddog_Return_T` 返回 `0`:成功 `<0`:失败.

###### 示例
```c
STATIC void test_onDeleteFunc(void* arg, Wilddog_Return_T err)
{
	if(err < WILDDOG_HTTP_OK || err >= WILDDOG_HTTP_NOT_MODIFIED)
	{
		wilddog_debug("delete failed!");
		return;
	}
	wilddog_debug("delete success!");
	*(BOOL*)arg = TRUE;
	return;
}

int main(void)
{
	BOOL isFinished = FALSE;
	Wilddog_T wilddog;

	wilddog_init();
	wilddog = wilddog_new(<url>);

	wilddog_remove(wilddog, test_onDeleteFunc, (void*)&isFinished);
	while(1)
	{
		if(TRUE == isFinished)
		{
			wilddog_debug("remove success!");
			break;
		}
		wilddog_trySync();
	}
	wilddog_destroy(&wilddog);
}
```
----

## wilddog\_on()
###### 定义
Wilddog\_Return\_T wilddog_on(
Wilddog\_T wilddog, 
Wilddog\_EventType\_T event, 
onQueryFunc onDataChange, 
void* dataChangeArg)

###### 说明

 监听一个数据,一旦该数据改变, `onDataChange`函数将被调用.

###### 参数


* Wilddog\_T `wilddog` 当前节点ID 
* Wilddog\_EventType\_T `event` 关注的事件类型，见`Wilddog_EventType_T`定义
* onQueryFunc `onDataChange` 数据变化所触发的回调函数，类型是`(*onEventFunc)(const Wilddog_Node_T* p_snapshot, void* arg, Wilddog_Return_T err)`,其中`p_snapshot`是取回的数据镜像（err为200时）或者NULL，**退出函数后即被销毁**, `arg`为用户传递的值, `err`为状态码. 
* void `*dataChangeArg` 传给回调函数的`arg`

###### 返回值
`Wilddog_Return_T` 返回 `0`:成功 `<0`:失败.

###### 示例
```c
STATIC void test_onObserveFunc(
	const Wilddog_Node_T* p_snapshot, 
	void* arg,
	Wilddog_Return_T err)
{
	if(err != WILDDOG_HTTP_OK)
	{
		wilddog_debug("observe failed!");
		return;
	}
	wilddog_debug("observe data!");
	
	return;
}

int main(void)
{
	BOOL isFinished = FALSE;
	Wilddog_T wilddog;
	STATIC int count = 0;	
	wilddog_init();

	wilddog = wilddog_new(TEST_ON_PATH);
	if(0 == wilddog)
	{
		wilddog_debug("new wilddog failed!");
		return 0;
	}
	wilddog_on(wilddog, WD_ET_VALUECHANGE, test_onObserveFunc, (void*)&isFinished);
	while(1)
	{
		if(TRUE == isFinished)
		{
			wilddog_debug("get new data %d times!", count++);
			isFinished = FALSE;
			if(count > 10)
			{
				wilddog_debug("off the data!");
				wilddog_off(wilddog, WD_ET_VALUECHANGE);
				break;
			}
		}
		wilddog_trySync();
	}
	wilddog_destroy(&wilddog);
	
}
```
----

## wilddog\_off
###### 定义
Wilddog\_Return\_T wilddog\_off(
Wilddog\_T *p\_wilddog, 
Wilddog\_EventType\_T event)

###### 说明

 取消对一个数据的监听(对应于on)
###### 参数

* Wilddog\_T `*p_wilddog` 当前节点ID
* Wilddog\_EventType_T `event` 取消的事件类型

###### 返回值

`Wilddog_Return_T`返回 `0`:成功 `<0`:失败.

----
## wilddog\_trySync()

###### 定义
 void wilddog\_trySync(void)

###### 说明
 wilddog同步云端数据依赖 `wilddog_trySync` 必须以一定的频率被调用.调用的频率取决于硬件和应用场景,每调用一次程序尝试接收来自云端的推送和处理重发和维持链接事务.所有事件的回调函数的触发都发生在`wilddog_trySync` 过程中.
###### 返回值
void

----

## wilddog_timeIncrease（）

###### 定义
void wilddog\_timeIncrease(u32 ms)

###### 说明
 为了实现更精确的时间定位，向用户提供的时间接口，用户可自行调用该函数校准wilddog的时间(如置于定时器中).

###### 参数

* u32 `ms` 增加的时间,按毫秒计时.

###### 返回值
void

###### 示例
```c
void timer_isr()
{
	//this isr is been called per ms.
	wilddog_timeIncrease(1);
}
```
----

#Node

##wilddog\_node\_createObject()

###### 定义

Wilddog\_Node\_T * wilddog\_node\_createObject(Wilddog_Str\_T* key)

###### 说明
创建一个Object类型的节点

###### 参数

* Wilddog_Str\_T `*key `节点的key值.

###### 返回值

 创建成功则返回该节点的指针，失败返回NULL.

----

## wilddog\_node\_createUString（）

###### 定义
Wilddog_Node\_T * wilddog_node\_createUString(Wilddog\_Str\_T* key, Wilddog\_Str\_T *value)

###### 说明
创建一个字符串类型节点

###### 参数

* Wilddog\_Str\_T `*key` 节点的key值
* Wilddog\_Str\_T `*value` 指向utf-8字符串的指针

###### 返回值
`Wilddog_Node_T` 创建成功则返回节点的指针，失败返回NULL.

----

##wilddog\_node\_createBString()

###### 定义 
Wilddog\_Node\_T * wilddog\_node\_createBString(Wilddog\_Str\_T* key, u8 *value, int len)

###### 说明
创建一个二进制数组类型节点

###### 参数
* Wilddog\_Str\_T `*key` 节点的key值
* u8 `*value` 二进制数组的指针
* int `len` 数据的长度(字节)

###### 返回值
`Wilddog_Node_T*`  创建成功则返回节点的指针，失败返回NULL.

----

## wilddog\_node\_createFloat

###### 定义
Wilddog\_Node\_T * wilddog\_node\_createFloat(Wilddog\_Str\_T* key, wFloat num)

###### 说明
创建一个浮点类型节点

###### 参数
* Wilddog\_Str\_T `*key` 节点的key值
* wFloat `num` 浮点数据(8位机器为32bits, 其他为64bits)

###### 返回值
 `Wilddog_Node_T *`创建成功则返回节点的指针，失败返回NULL.

## wilddog\_node\_createNum（）

###### 定义
Wilddog\_Node\_T * wilddog\_node\_createNum(Wilddog\_Str\_T* key, s32 num)
###### 说明
创建一个整数类型节点

###### 参数
* Wilddog\_Str\_T* `key` 节点的key值
* s32 `num` 32位有符号整数

###### 返回值
 `Wilddog_Node_T `  创建成功则返回节点的指针，失败返回NULL.

----
## wilddog\_node\_createNull()

###### 定义

Wilddog\_Node\_T * wilddog\_node\_createNull(Wilddog\_Str\_T* key)

###### 说明
创建一个null类型节点

###### 参数
* Wilddog\_Str\_T* `key` 节点的key值

###### 返回值
 `Wilddog_Node_T ` 创建成功则返回节点的指针，失败返回NULL.

----

## wilddog\_node\_createTrue()

###### 定义

Wilddog\_Node\_T * wilddog\_node\_createTrue(Wilddog\_Str\_T* key)

###### 说明
创建一个TRUE类型节点

###### 参数
* Wilddog\_Str\_T* `key` 节点的key值

###### 返回值
`Wilddog_Node_T ` 创建成功则返回节点的指针，失败返回NULL.

----

## wilddog\_node\_createFalse（）

###### 定义
Wilddog\_Node\_T * wilddog\_node\_createFalse(Wilddog\_Str\_T* key)



###### 说明
创建一个FALSE类型节点

###### 参数

* Wilddog\_Str\_T* `key` 节点的key值

###### 返回值
`Wilddog_Node_T ` 创建成功则返回节点的指针，失败返回NULL.

----

## wilddog\_node\_add（）

###### 定义

Wilddog\_Return\_T wilddog_node_add(Wilddog\_Node\_T *parent, Wilddog\_Node\_T *child)

###### 说明

两个节点建立父子关系
###### 参数

* Wilddog\_Node\_T *`parent` 指向父节点的指针
* Wilddog\_Node\_T *`child` 指向要添加的子节点的指针

###### 返回值
 `Wilddog_Return_T` 成功返回 `0`, 失败返回 `<0`的值。

----

## wilddog\_node\_delete

###### 定义 
Wilddog\_Return\_T wilddog\_node\_delete( Wilddog\_Node\_T *head)

###### 说明
删除节点及其所有子节点

###### 参数
* Wilddog\_Node\_T* `head` 要删除节点的指针。

###### 返回值
 `Wilddog_Return_T` 成功返回 `0`, 失败返回 `<0`的值。

----

## wilddog\_node\_clone（）

###### 定义
Wilddog\_Node\_T * wilddog\_node\_clone( Wilddog\_Node\_T *head)

###### 说明
拷贝当前节点及其下所有子节点。

###### 参数
* Wilddog\_Node\_T* `head` 指向节点的指针。

###### 返回值
`Wilddog_Node_T` 成功返回拷贝后新的头节点指针, 失败返回NULL.

----


## wilddog\_node\_find()

###### 定义
Wilddog\_Node\_T *wilddog\_node\_find( Wilddog_Node\_T *root, char *path)

###### 说明
root中查找该path(相对路径)下的节点是否存在.

###### 参数
* Wilddog_Node\_T* `root` 指向根节点的指针
* char* `path` 指向相对路径的指针

###### 返回值
`Wilddog_Node_T` 成功返回节点指针, 失败返回NULL

----

## wilddog\_node\_getKey（）

###### 定义
Wilddog\_Str\_T *wilddog\_node\_getKey(Wilddog\_Node\_T *node)

###### 说明
获取当前节点的key值

###### 参数
* Wilddog\_Node\_T* `node` 指向节点的指针

###### 返回值
 `Wilddog_Str_T` 成功返回指向节点key的指针，失败返回NULL.

----

## wilddog\_node\_setKey

###### 定义 
Wilddog\_Return\_T wilddog\_node\_setKey(Wilddog\_Node\_T *node, Wilddog\_Str\_T *key)

###### 说明
设置当前节点的key值

###### 参数
* Wilddog\_Node\_T* `node` 指向节点的指针
* Wilddog\_Str\_T* `key` 指向新key值的指针

###### 返回值
 `Wilddog_Return_T` 成功返回指向节点key的指针，失败返回NULL.

----

## wilddog\_node\_getType()

###### 定义
u8 wilddog\_node\_getType(Wilddog\_Node\_T *node)

###### 说明
获取当前节点的类型

###### 参数
* Wilddog\_Node\_T* `node` 指向节点的指针

###### 返回值
 `u8` 返回节点类型 

----

## wilddog\_node\_setType()

###### 定义
void wilddog\_node\_setType(Wilddog\_Node\_T *node, u8 type)

###### 说明
设置当前节点的类型

###### 参数
* Wilddog\_Node\_T* `node` 指向节点的指针
* u8 `type` 新的类型值

----
## wilddog\_node\_getValue（）

###### 定义
Wilddog\_Str\_T* wilddog\_node\_getValue(Wilddog\_Node\_T *node, int * len)

###### 说明
获取当前节点的value值

###### 参数
* Wilddog\_Node\_T* `node` 指向节点的指针  
* int* `len` 输出参数，将存储value值的长度(字节)

###### 返回值
 `Wilddog_Node_T` 成功返回指向节点value的指针(可根据type和传出的len来转化)，失败返回NULL.

----


## wilddog\_node\_setValue（）

###### 定义
Wilddog\_Return\_T (Wilddog\_Node\_T *node, u8 *value, int len)

###### 说明
设置当前节点的value值 

###### 参数
* Wilddog\_Node\_T* `node` 指向节点的指针
* u8* `value` 指向新value值的指针
* int `len` 新value的长度

###### 返回值
 `Wilddog_Return_T` 成功返回 `0`, 失败返回 `<0` 的数.

----

