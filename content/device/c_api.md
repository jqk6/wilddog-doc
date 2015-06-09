/*
Title: C API文档
Sort: 3
*/

## init
 `void wilddog_init(void)`

 初始化wilddog SDK.

**参数**

 无

**返回值**

 无

## new
 `Wilddog_T wilddog_new(Wilddog_Str_T *url)`

 初始化一个wilddog客户端.

**参数**

* `url` : `coap[s]://<appid>.wilddogio.com/<path>`.
* `<appid>` : 开发者在 wilddog 平台申请的应用id.
* `<path>` : 客户端关心的路径.

**返回值**

*	返回Wilddog\_T类型的client id，如果创建失败，返回0.
#### sample

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

## get parent
`Wilddog_T wilddog_getParent(Wilddog_T wilddog)`

 创建一个为当前客户端path父节点的客户端.

**参数**

* `wilddog` : client id.

**返回值**

*	返回父节点的id，如果创建失败，返回0.

#### sample
```c
//定位到user/jackxy
Wilddog_T wilddog=wilddog_new("coaps://myapp.wilddogio.com/user/jackxy");
//定位到user
Wilddog_T parent = wilddog_getParent(wilddog);
```
## get root
`Wilddog_T wilddog_getRoot(Wilddog_T wilddog)`

 创建一个为当前客户端path根节点的客户端.

**参数**

* `wilddog` : client id.

**返回值**

*	返回根节点的id，如果创建失败，返回0.
#### sample
```c
//定位到user/jackxy
Wilddog_T wilddog=wilddog_new("coaps://myapp.wilddogio.com/user/jackxy");
//定位到root("/")
Wilddog_T root = wilddog_getRoot(wilddog);
```
## get child
`Wilddog_T wilddog_getChild(Wilddog_T wilddog, Wilddog_Str_T * childName)`

 创建一个当前客户端path下`childName`子节点的客户端.

**参数**

* `wilddog` : client id.
* `childName` : 子节点的相对路径，多级子节点需用'/'隔开，即使子节点不存在也能创建.

**返回值**

*	返回子节点的id，如果创建失败，返回0.

#### sample
```c
//定位到user/jackxy
Wilddog_T wilddog=wilddog_new("coaps://myapp.wilddogio.com/user/jackxy");
//定位到user/jackxy/aaa
Wilddog_T child = wilddog_getChild(wilddog, "aaa");
```

## get key
`Wilddog_Str_T *wilddog_getKey(Wilddog_T wilddog)`

 获取当前客户端对应node的key.

**参数**

* `wilddog` : client id.

**返回值**

*	返回node的key，如果获取失败，返回NULL.

## destroy
 `Wilddog_Return_T wilddog_destroy(Wilddog_T *p_wilddog);`

 销毁一个客户端 回收内存.
 
**参数**

* `p_wilddog` : 指向client id的地址.

**返回值**

* 返回 `0`:成功 `<0`:失败.

## setAuth

	Wilddog_Return_T wilddog_setAuth(
		Wilddog_Str_T *p_host, 
		u8 *p_auth, 
		int len, 
		onAuthFunc onAuth,
		void* args);

 同服务器进行auth认证。注意，每个appid**共用**一个auth。

**参数**

*	`p_host` : 想要进行auth认证的host字符串。
*	`p_auth` : auth信息数据的指针。
*	`len` : auth信息的长度。
*	`onAuth` : 函数指针，类型是`void (*onAuthFunc)(void* arg, Wilddog_Return_T err)`，其中`arg`为用户传递的值，（即下面的`args`），`err`为状态码，具体见`Wilddog_Return_T`定义。
*	`args` : 用户参数接口，该值会传递到onAuth中。

#### sample
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

wilddog_setAuth("aaa.wilddogio.com",newToken, strlen(newToken), myOnAuthFunc, (void*)12345);
...
```

## query

	Wilddog_Return_T wilddog_query(
		Wilddog_T wilddog,
		onQueryFunc callback,
		void* arg)

 获取当前节点的数据,数据格式为`Wilddog_Node_T`(类似JSON).
 
 **参数**

* `wilddog` : client id.
* `callback` : 函数指针,类型是`void (*onQueryFunc)(const Wilddog_Node_T* p_snapshot, void* arg, Wilddog_Return_T err)`,其中`p_snapshot`是取回的数据镜像（err为205时）或者NULL，退出函数后即被销毁, `arg`为用户传递的值, `err`为状态码.
* `arg` : 即用户给回调函数的arg.

**返回值**

* 在出错的情况下返回 `<0` 的整数, 在正常情况下返回 `0`.
 
#### sample
```c
STATIC void test_onQueryFunc(
	const Wilddog_Node_T* p_snapshot, 
	void* arg, 
	Wilddog_Return_T err)
{
	
	if(err < WILDDOG_HTTP_OK || err >= WILDDOG_HTTP_NOT_MODIFIED)
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

## set
	Wilddog_Return_T wilddog_set(
		Wilddog_T wilddog,
		Wilddog_Node_T *p_node,
		onSetFunc callback,
		void* arg)

 设置当前节点的数据,数据格式为`Wilddog_Node_T`.
 
 **参数**

* `wilddog` : client id.
* `p_node` : `Wilddog_Node_T` 类型的指针, `Wilddog_Node_T` 为wilddog 客户端存储格式.
* `callback` : 函数指针 ,类型是`void (*onSetFunc)(void* arg, Wilddog_Return_T err)`,其中`arg`为用户传递的值,`err`为状态码.
* `arg` : 即用户给回调函数的arg.

**返回值**

 * 在出错的情况下返回 `<0` 的整数, 在正常情况下返回 `0`.

#### sample
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

## push
	Wilddog_Return_T wilddog_push(
		Wilddog_T wilddog, 
		Wilddog_Node_T *p_node, 
		onPushFunc callback, 
		void* arg)

 在当前节点之下新增一条数据,数据的key在服务端生成.
 
  **参数**

* `wilddog` :  client id.
* `p_node` : `Wilddog_Node_T`类型的指针(node 库的使用API 请参见Node API).
* `callback` : 函数指针 ,类型是`(*onPushFunc)(Wilddog_Str_T * p_newPath, void* arg, Wilddog_Return_T err)`,其中 `p_newPath` 是新增数据的完整path,`arg` 为用户传递的值,`err`为状态码.
* `arg` : 即用户给回调函数的arg.
  
 **返回值**

* 在出错的情况下返回 `<0` 的整数, 在正常情况下返回 `0`.

#### sample
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


## remove

	Wilddog_Return_T wilddog_remove(
		Wilddog_T wilddog, 
		onRemoveFunc callback, 
		void* arg)`

 删除当前节点下所有数据

**参数**

* `wilddog` :  client id.
* `callback` : 函数指针 ,类型是`void (*onRemoveFunc)(void* arg, Wilddog_Return_T err)`,其中`arg` 为用户传递的值,`err`为状态码.
* `arg` : 即用户给回调函数的arg.

**返回值**

* 在出错的情况下返回 `<0` 的整数, 在正常情况下返回 `0`.

#### sample
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


## on
	Wilddog_Return_T wilddog_on(
		Wilddog_T wilddog, 
		Wilddog_EventType_T event, 
		onQueryFunc onDataChange, 
		void* dataChangeArg)

 观察当前数据的变化,一旦数据改变, `onDataChange`函数将被调用.

**参数**

* `wilddog` :  client id.
* `event` : 关注的事件类型，见`Wilddog_EventType_T`定义.
* `onDataChange` : 函数指针,类型是`(*onEventFunc)(const Wilddog_Node_T* p_snapshot, void* arg, Wilddog_Return_T err)`,其中`p_snapshot`是取回的数据镜像（err为205时）或者NULL，退出函数后即被销毁, `arg`为用户传递的值, `err`为状态码.
* `dataChangeArg` : 即用户给回调函数的arg.
 
**返回值**

* 在出错的情况下返回 `<0` 的整数, 在正常情况下返回 `0`.

#### sample
```c
STATIC void test_onObserveFunc(
	const Wilddog_Node_T* p_snapshot, 
	void* arg,
	Wilddog_Return_T err)
{
	if(err < WILDDOG_HTTP_OK || err >= WILDDOG_HTTP_NOT_MODIFIED)
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

## off
	Wilddog_Return_T wilddog_off(
		Wilddog_T *p_wilddog, 
		Wilddog_EventType_T event)

 取消关注一个事件(对应于on)

**参数**

* `wilddog` :  client id.
* `event` : 取消的事件类型.

**返回值**

* 在出错的情况下返回 `<0` 的整数, 在正常情况下返回 `0`.

## try sync
 `void wilddog_trySync(void)`

 wilddog同步生效依赖 `wilddog_trySync` 必须以一定的频率被调用.调用的频率取决于硬件和应用场景,每调用一次程序尝试接收来自云端的推送和其他消息.所有的事件触发和回调函数被调用都发生在`wilddog_trySync` 过程中.

**参数**

 无

**返回值**

 无

## time increase
`void wilddog_timeIncrease(u32 ms)`

 为了实现更精确的时间定位，向用户提供的时间接口，用户可自行调用该函数定位时间(如置于定时器中).

**参数**

*	`ms` : 增加的时间,按毫秒计时.

**返回值**

 无

#### sample
```c
void timer_isr()
{
	//this timer increased per ms.
	wilddog_timeIncrease(1);
}
```
