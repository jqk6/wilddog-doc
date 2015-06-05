/*
 Title: node API文档
 Sort : 5
*/

## 节点创建

####创建一个Object类型节点

	Wilddog_Node_T * wilddog_node_createObject(Wilddog_Str_T* key)

**参数**

 `key` : 节点的key值.

**返回值**

 创建成功则返回节点的指针，失败返回NULL.

####创建一个字符串类型节点

	Wilddog_Node_T * wilddog_node_createUString(Wilddog_Str_T* key, Wilddog_Str_T *value)

**参数**

 `key` : 节点的key值.

 `value` : utf-8字符串的指针.

**返回值**

 创建成功则返回节点的指针，失败返回NULL.

####创建一个二进制数组类型节点

	Wilddog_Node_T * wilddog_node_createBString(Wilddog_Str_T* key, u8 *value, int len)

**参数**

 `key` : 节点的key值.

 `value` : 二进制数组的指针.

 `len` : 数据的长度(字节).

**返回值**

 创建成功则返回节点的指针，失败返回NULL.

####创建一个浮点类型节点

	Wilddog_Node_T * wilddog_node_createFloat(Wilddog_Str_T* key, wFloat num)

**参数**

 `key` : 节点的key值.

 `num` : 浮点数据(8位机器为32bits, 其他为64bits).

**返回值**

 创建成功则返回节点的指针，失败返回NULL.

####创建一个整数类型节点

	Wilddog_Node_T * wilddog_node_createNum(Wilddog_Str_T* key, s32 num)

**参数**

 `key` : 节点的key值.

 `num` : 32位有符号整数.

**返回值**

 创建成功则返回节点的指针，失败返回NULL.

####创建一个null类型节点

	Wilddog_Node_T * wilddog_node_createNull(Wilddog_Str_T* key)

**参数**

 `key` : 节点的key值.

**返回值**

 创建成功则返回节点的指针，失败返回NULL.

####创建一个TRUE类型节点

	Wilddog_Node_T * wilddog_node_createTrue(Wilddog_Str_T* key)

**参数**

 `key` : 节点的key值.

**返回值**

 创建成功则返回节点的指针，失败返回NULL.

####创建一个FALSE类型节点

	Wilddog_Node_T * wilddog_node_createFalse(Wilddog_Str_T* key)

**参数**

 `key` : 节点的key值.

**返回值**

 创建成功则返回节点的指针，失败返回NULL.

## 节点之间的操作

#### add

	Wilddog_Return_T wilddog_node_add(Wilddog_Node_T *parent, Wilddog_Node_T *child)

向某个节点中添加子节点.

**参数**

 `parent` : 指向父节点的指针.

 `child` : 指向要添加的子节点的指针.

**返回值**

 成功返回 `0`, 失败返回 `<0`的值.

#### delete

	Wilddog_Return_T wilddog_node_delete( Wilddog_Node_T *head)

删除节点及其所有子节点.

**参数**

 `head` : 指向节点的指针.

**返回值**

 成功返回 `0`, 失败返回 `<0`的值.

#### clone

	Wilddog_Node_T * wilddog_node_clone( Wilddog_Node_T *head)

将节点及其所有子节点拷贝.

**参数**

 `head` : 指向节点的指针.

**返回值**

 成功返回拷贝后新的头节点指针, 失败返回NULL.

#### find

	Wilddog_Node_T *wilddog_node_find( Wilddog_Node_T *root, char *path)

在root中查找该path(相对路径)下的节点是否存在.

**参数**

 `root` : 指向头节点的指针.

 `path` : 指向相对路径的指针.

**返回值**

 成功返回节点指针, 失败返回NULL.


##节点内部的操作

####获取当前节点的key值

	Wilddog_Str_T *wilddog_node_getKey(Wilddog_Node_T *node)

**参数**

 `node` : 指向节点的指针.

**返回值**

 成功返回指向节点key的指针，失败返回NULL.

####设置当前节点的key值

	Wilddog_Return_T wilddog_node_setKey(Wilddog_Node_T *node, Wilddog_Str_T *key)

**参数**

 `node` : 指向节点的指针.

 `key` : 指向新key值的指针.

**返回值**

 成功返回指向节点key的指针，失败返回NULL.

####获取当前节点的类型

	u8 wilddog_node_getType(Wilddog_Node_T *node)

**参数**

 `node` : 指向节点的指针.

**返回值**

 返回节点类型.

####设置当前节点的类型

	void wilddog_node_setType(Wilddog_Node_T *node, u8 type)

**参数**

 `node` : 指向节点的指针.

 `type` : 新的类型值.

**返回值**

 无

####获取当前节点的value值

	Wilddog_Str_T* wilddog_node_getValue(Wilddog_Node_T *node, int * len)

**参数**

 `node` : 指向节点的指针.

 `len` : 输出参数，将存储value值的长度(字节).

**返回值**

 成功返回指向节点value的指针(可根据type和传出的len来转化)，失败返回NULL.

####设置当前节点的value值

	Wilddog_Return_T wilddog_node_setValue(Wilddog_Node_T *node, u8 *value, int len)

**参数**

 `node` : 指向节点的指针.

 `value` : 指向新value值的指针.

 `len` : 新value的长度.

**返回值**

 成功返回 `0`, 失败返回 `<0` 的数.

