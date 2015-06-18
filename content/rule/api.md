/*
Title: API 文档
Sort: 3
*/

## RuleDataSnapshot
数据树节点的接口。

### val()
获得节点的数据(String， Number， Boolean or null)

#### Return
`Object` 如果节点为叶子节点返回节点值；如果包含子节点将子树转化为json字符串返回；如果数据不存在，则返回null。

---
### child(childPath) 
获得指定直接下级子节点的`RuleDataSnapshot`对象。

#### Param 
* childPath `String`
子节点路径，例如“a”。

#### Return
`RuleDataSnapshot`

---

### parent() 
获得当前节点的父节点`RuleDataSnapshot`

#### Return
`RuleDataSnapshot`

---

### hasChild(childPath)
判断当前节点是否存在指定子节点。

#### Param
* childPath `String`
子节点路径，例如“a”。

#### Return
`boolean` true表示存在，false表示不存在。

---

### hasChildren(pathList)
判断当前节点是否存在指定一组子节点。


#### Param
* pathList `List<String>` 路径数组
一组子节点路径，例如['a','b','c']

#### Return
`boolean` true表示存在，false表示不存在。有一个path不存在就会返回false。

---

### exist() 
判断当前节点是否存在

#### Return
`boolean` true表示存在，false表示不存在。

----

### isNumber()
判断当前节点value的类型是否是数值型。

#### Return
`boolean` 

----

### isString()
判断当前节点value的类型是否是`String`类型。

#### Return
`boolean` 

----

### isBoolean()
判断当前节点value的类型是否是布尔类型。

#### Return
`boolean` 

----

### isBoolean()
判断当前节点value的类型是否是布尔类型。

#### Return
`boolean` 

----

## Auth
用户登录对象，提供两个属性使用

属性     | 类型|描述
-------- |-----| ---
uid | String| 用户唯一ID
provider| String| 使用的auth方式，TODO 需要补充完整 



## String

###  String toLowerCase() 
将字符串转为小写

---
###  String toUpperCase()
将字符串转为大写

---

### String replace(char oldChar, char newChar) 
将字符串中的oldChar替换为newChar。

---

### boolean matches(String regex)
判断字符串是否符合给定的正则规则。

---
### boolean contains(CharSequence s)
字符串是否包含指定子串。

---
### boolean startsWith(String prefix)
字符串以指定字符串开头。

---
### boolean endsWith(String prefix)
字符串以指定字符串结尾。

---
