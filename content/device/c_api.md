/*
Title: C API文档
Sort: 3
*/

## sys init
 `void wilddog_sys_init(void)`

 初始化wilddog SDK.

**参数**

 无

**返回值**

 无

## init
 `Wilddog_Ref_T *wilddog_init(Wilddog_Str_T *url)`

 初始化一个wilddog客户端.

**参数**

* `url` : `coap[s]://<appid>.wilddogio.com/<path>`.
* `<appid>` : 开发者在 wilddog 平台申请的应用id.
* `<path>` : 客户端关心的路径.

**返回值**

*	返回指向Wilddog\_Ref\_T 结构体的指针，如果创建失败，返回NULL.
#### sample

```c
int main()
{
	//init client
	Wilddog_Ref_T* wilddog=wilddog_init("coaps://myapp.wilddogio.com/user/jackxy/device/light/10abcde");
	//do something
	...
	//recycle memeory
	wilddog_destroy(&wilddog);
}
```

## get parent
`Wilddog_Ref_T *wilddog_getParent(Wilddog_Ref_T *p_wilddog)`

 创建一个为当前客户端path父节点的客户端.

**参数**

* `p_wilddog` : 指向已经初始化的`Wilddog_Ref_T`结构体指针.

**返回值**

*	返回指向Wilddog\_Ref\_T 结构体的指针，如果创建失败，返回NULL.

#### sample
```c
//定位到user/jackxy
Wilddog_Ref_T* p_wilddog=wilddog_init("coaps://myapp.wilddogio.com/user/jackxy");
//定位到user
Wilddog_Ref_T* p_parent = wilddog_getParent(p_wilddog);
```
## get root
`Wilddog_Ref_T *wilddog_getRoot(Wilddog_Ref_T *p_wilddog)`

 创建一个为当前客户端path根节点的客户端.

**参数**

* `p_wilddog` : 指向已经初始化的`Wilddog_Ref_T`结构体指针.

**返回值**

*	返回指向Wilddog\_Ref\_T 结构体的指针，如果创建失败，返回NULL.
#### sample
```c
//定位到user/jackxy
Wilddog_Ref_T* p_wilddog=wilddog_init("coaps://myapp.wilddogio.com/user/jackxy");
//定位到root("/")
Wilddog_Ref_T* p_root = wilddog_getRoot(p_wilddog);
```
## get child
`Wilddog_Ref_T *wilddog_getChild(Wilddog_Ref_T *p_wilddog, Wilddog_Str_T * childName)`

 创建一个当前客户端path下`childName`子节点的客户端.

**参数**

* `p_wilddog` : 指向已经初始化的`Wilddog_Ref_T`结构体指针.
* `childName` : 子节点的相对路径，多级子节点需用'/'隔开，即使子节点不存在也能创建.

**返回值**

*	返回指向Wilddog\_Ref\_T 结构体的指针，如果创建失败，返回NULL.

#### sample
```c
//定位到user/jackxy
Wilddog_Ref_T* p_wilddog=wilddog_init("coaps://myapp.wilddogio.com/user/jackxy");
//定位到user/jackxy/aaa
Wilddog_Ref_T* p_child = wilddog_getChild(p_wilddog, "aaa");
```

## get key
`Wilddog_Str_T *wilddog_getKey(Wilddog_Ref_T *p_wilddog)`

 获取当前客户端对应的node名称.

**参数**

* `p_wilddog` : 指向已经初始化的`Wilddog_Ref_T`结构体指针.

**返回值**

*	返回node名称，如果创建失败，返回NULL.

## destroy
 `Wilddog_Return_T wilddog_destroy(Wilddog_Ref_T **pp_wilddog);`

 销毁一个客户端 回收内存.
 
**参数**

* `pp_wilddog` : 指向已经初始化的`Wilddog_Ref_T`结构体指针的指针.

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
		Wilddog_Ref_T *p_wilddog,
		onQueryFunc callback,
		void* arg)

 获取当前节点的数据,数据格式为`Wilddog_Node_T`(类似JSON).
 
 **参数**

* `p_wilddog` : 已经初始化的`Wilddog_Ref_T`结构体的指针.
* `callback` : 函数指针,类型是`void (*onQueryFunc)(const Wilddog_Node_T* p_snapshot, void* arg, Wilddog_Return_T err)`,其中`p_snapshot`是取回的数据镜像（err为205时）或者NULL，退出函数后即被销毁, `arg`为用户传递的值, `err`为状态码.
* `arg` : 即用户给回调函数的arg.

**返回值**

* 在出错的情况下返回 `<0` 的整数, 在正常情况下返回 `0`.
 
#### sample
```c
void myOnAuthFunc(void* arg, Wilddog_Return_T err)
{
	if(err < 0 || err >= 400)
	{
		printf("auth fail!\n");
		return;
	}
	printf("hello world!\n");
	*(int*)err = TRUE;
	return;
}
void onQueryComplete(
	const Wilddog_Node_T* p_snapshot,
	void* arg,
	Wilddog_Return_T err)
{
	Wilddog_Node_T** p_data = (Wilddog_Node_T**)arg;
    if(err<0 || err >= 400)
        printf("query error:%d",errCode);
    else
	{
		*p_data = wilddog_node_clone(p_snapshot);
	}
	return;
}
int main()
{
	int ready = FALSE;
	Wilddog_Str_T * p_str = NULL;
	Wilddog_Node_T * p_data = NULL;
	Wilddog_Ref_T* wilddog =wilddog_init("coap://a.wilddogio.com/a/b/c");
	
	if(!wilddog)
		return -1;
	wilddog_setAuth("a.wilddogio.com", "12345678", 8, myOnAuthFunc, (void*)&ready);
    
    while(1)
	{
        //使用事件循环的方式,需要循环接收网络事件并处理.
		if(ready == TRUE)
		{
			wilddog_query(wilddog,onQueryComplete, &p_data);
		}
        wilddog_trySync();
    }
	p_str = wilddog_debug_n2jsonString(p_data);
	if(p_str)
	{
		wilddog_debug("%s", p_str);
		wfree(p_str);
	}
	if(p_data)
		wilddog_node_delete(p_data);
	if(wilddog)
		wilddog_destroy(&wilddog);
	return 0;
}
```

## set
	Wilddog_Return_T wilddog_set(
		Wilddog_Ref_T *p_wilddog,
		Wilddog_Node_T *p_node,
		onSetFunc callback,
		void* arg)

 设置当前节点的数据,数据格式为`Wilddog_Node_T`.
 
 **参数**

* `p_wilddog` :  已经初始化的`Wilddog_Ref_T`结构体的指针.
* `p_node` : `Wilddog_Node_T` 类型的指针, `Wilddog_Node_T` 为wilddog 客户端存储格式.
* `callback` : 函数指针 ,类型是`void (*onSetFunc)(void* arg, Wilddog_Return_T err)`,其中`arg`为用户传递的值,`err`为状态码.
* `arg` : 即用户给回调函数的arg.

**返回值**

 * 在出错的情况下返回 `<0` 的整数, 在正常情况下返回 `0`.

#### sample
```c
void myOnAuthFunc(void* arg, Wilddog_Return_T err)
{
	if(err < 0 || err >= 400)
	{
		printf("auth fail!\n");
		return;
	}
	printf("hello world! %d\n", (int)arg);
	return;
}
void onSetComplete(void* arg, Wilddog_Return_T err)
{
    if(errCode<0)
        printf("set error:%d",errCode);
    else
	{
       //do something
    }
}
...
int main()
{
	Wilddog_Node_T * p_data = NULL;
    Wilddog_Ref_T* wilddog =wilddog_init("coap://a.wilddogio.com/a/b/c");
    ...
	wilddog_setAuth("a.wilddogio.com", "12345678", 8, myOnAuthFunc, NULL);
	...
	//after authed
	p_data = wilddog_node_createNum(NULL, 123);
    wilddog_set(wilddog, p_data, onSetComplete, NULL);
	wilddog_node_delete(p_data);
    while(1)
	{
        //使用事件循环的方式,需要循环接收网络事件并处理.
        wilddog_trySync();
    }
	wilddog_destroy(&wilddog);
}
```

## push
	Wilddog_Return_T wilddog_push(
		Wilddog_Ref_T *p_wilddog, 
		Wilddog_Node_T *p_node, 
		onPushFunc callback, 
		void* arg)

 在当前节点之下新增一条数据,数据的key在服务端生成.
 
  **参数**

* `p_wilddog` :  已经初始化的`Wilddog_Ref_T`结构体的指针.
* `p_node` : `Wilddog_Node_T`类型的指针(node 库的使用API 请参见Node API).
* `callback` : 函数指针 ,类型是`(*onPushFunc)(Wilddog_Str_T * p_newPath, void* arg, Wilddog_Return_T err)`,其中 `p_newPath` 是新增数据的完整path,`arg` 为用户传递的值,`err`为状态码.
* `arg` : 即用户给回调函数的arg.
  
 **返回值**

* 在出错的情况下返回 `<0` 的整数, 在正常情况下返回 `0`.

#### sample
```c
void myOnAuthFunc(void* arg, Wilddog_Return_T err)
{
	if(err < 0 || err >= 400)
	{
		printf("auth fail!\n");
		return;
	}
	printf("hello world! %d\n", (int)arg);
	return;
}
void onPushComplete(Wilddog_Str_T * p_newPath, void* arg, Wilddog_Return_T err)
{
    if(errCode<0)
        printf("set error:%d",errCode);
    else
	{
       //do something
    }
}
...
int main()
{
	Wilddog_Node_T * p_data = NULL;
    Wilddog_Ref_T* wilddog =wilddog_init("coap://a.wilddogio.com/a/b/c");
    ...
	wilddog_setAuth("a.wilddogio.com", "12345678", 8, myOnAuthFunc, NULL);
	...
	//after authed
	p_data = wilddog_node_createNum(NULL, 123);
    wilddog_push(wilddog, p_data, onPushComplete, NULL);
	wilddog_node_delete(p_data);
    while(1)
	{
        //使用事件循环的方式,需要循环接收网络事件并处理.
        wilddog_trySync();
    }
	wilddog_destroy(&wilddog);
}
```


## remove

	Wilddog_Return_T wilddog_remove(
		Wilddog_Ref_T *p_wilddog, 
		onRemoveFunc callback, 
		void* arg)`

 删除当前节点下所有数据

**参数**

* `p_wilddog` :  已经初始化的`Wilddog_Ref_T`结构体的指针.
* `callback` : 函数指针 ,类型是`void (*onRemoveFunc)(void* arg, Wilddog_Return_T err)`,其中`arg` 为用户传递的值,`err`为状态码.
* `arg` : 即用户给回调函数的arg.

**返回值**

* 在出错的情况下返回 `<0` 的整数, 在正常情况下返回 `0`.

#### sample
```c
void myOnAuthFunc(void* arg, Wilddog_Return_T err)
{
	if(err < 0 || err >= 400)
	{
		printf("auth fail!\n");
		return;
	}
	printf("hello world! %d\n", (int)arg);
	return;
}
void onRemoveComplete(void* arg, Wilddog_Return_T err)
{
    if(errCode<0)
        printf("set error:%d",errCode);
    else
	{
       //do something
    }
}
...
int main()
{
	Wilddog_Node_T * p_data = NULL;
    Wilddog_Ref_T* wilddog =wilddog_init("coap://a.wilddogio.com/a/b/c");
    ...
	wilddog_setAuth("a.wilddogio.com", "12345678", 8, myOnAuthFunc, NULL);
	...
	//after authed
    wilddog_remove(wilddog, onRemoveComplete, NULL);
    while(1)
	{
        //使用事件循环的方式,需要循环接收网络事件并处理.
        wilddog_trySync();
    }
	wilddog_destroy(&wilddog);
}
```


## on
	Wilddog_Return_T wilddog_on(
		Wilddog_Ref_T *p_wilddog, 
		Wilddog_EventType_T event, 
		onQueryFunc onDataChange, 
		void* dataChangeArg)

 观察当前数据的变化,一旦数据改变, `onDataChange`函数将被调用.

**参数**

* `p_wilddog` :  已经初始化的`Wilddog_Ref_T`结构体的指针.
* `event` : 关注的事件类型，见`Wilddog_EventType_T`定义.
* `onDataChange` : 函数指针,类型是`(*onEventFunc)(const Wilddog_Node_T* p_snapshot, void* arg, Wilddog_Return_T err)`,其中`p_snapshot`是取回的数据镜像（err为205时）或者NULL，退出函数后即被销毁, `arg`为用户传递的值, `err`为状态码.
* `dataChangeArg` : 即用户给回调函数的arg.
 
**返回值**

* 在出错的情况下返回 `<0` 的整数, 在正常情况下返回 `0`.

#### sample
```c
void myOnAuthFunc(void* arg, Wilddog_Return_T err)
{
	if(err < 0 || err >= 400)
	{
		printf("auth fail!\n");
		return;
	}
	printf("hello world!\n");
	*(int*)err = TRUE;
	return;
}
void onQueryComplete(
	const Wilddog_Node_T* p_snapshot,
	void* arg,
	Wilddog_Return_T err)
{
	Wilddog_Node_T** p_data = (Wilddog_Node_T**)arg;
    if(err<0 || err >= 400)
        printf("query error:%d",errCode);
    else
	{
		//do some thing
	}
	return;
}
int main()
{
	int ready = FALSE;
	Wilddog_Ref_T* wilddog =wilddog_init("coap://a.wilddogio.com/a/b/c");
	
	if(!wilddog)
		return -1;
	wilddog_setAuth("a.wilddogio.com", "12345678", 8, myOnAuthFunc, (void*)&ready);
    
    while(1)
	{
        //使用事件循环的方式,需要循环接收网络事件并处理.
		if(ready == TRUE)
		{
			wilddog_on(wilddog, WD_ET_VALUECHANGE, onQueryComplete, NULL);
			ready = FALSE;
		}
        wilddog_trySync();
    }
	if(wilddog)
		wilddog_destroy(&wilddog);
	return 0;
}
```

## off
	Wilddog_Return_T wilddog_off(
		Wilddog_Ref_T *p_wilddog, 
		Wilddog_EventType_T event)

 取消关注一个事件(对应于on)

**参数**

* `p_wilddog` :  已经初始化的`Wilddog_Ref_T`结构体的指针.
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

 为了实现更精确的时间定位，向用户提供的时间接口，用户可将该函数置于如定时器中.

**参数**

*	`ms` : 增加的时间,按毫秒计时.

**返回值**

 无

#### sample
```c
void timer_isr()
{
	wilddog_timeIncrease(1);
}
```

