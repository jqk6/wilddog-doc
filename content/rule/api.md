/*
Title: API 文档
Sort: 3
*/

# RuleDataSnapshot
数据树节点的接口。

## val()

###### 定义
object val()

###### 说明
获得节点的数据, 类型包括`String` `Number` `Boolean` `null`

###### 返回值
`Object` 如果节点为叶子节点返回节点值；如果包含子节点将子树转化为json字符串返回；如果数据不存在，则返回null。

---

## child()

###### 定义
RuleDataSnapshot child(childPath) 

###### 说明
获得指定直接下级子节点的`RuleDataSnapshot`对象。

###### 参数
* childPath `String`
子节点路径，例如“a”。

###### 返回值
`RuleDataSnapshot`

---
## parent()

###### 定义
RuleDataSnapshot parent() 

###### 说明
获得当前节点的父节点`RuleDataSnapshot`

###### 返回值
`RuleDataSnapshot`

---
## hasChild

###### 定义
boolean hasChild(childPath)

###### 说明
判断当前节点是否存在指定子节点。

###### 参数
* childPath `String`
子节点路径，例如“a”。

###### 返回值
`boolean` true表示存在，false表示不存在。

---

## hasChildren

###### 定义
boolean hasChildren(pathList)

###### 说明
判断当前节点是否存在指定一组子节点。

###### 参数
* pathList `List<String>` 路径数组
一组子节点路径，例如['a','b','c']

###### 返回值
`boolean` true表示存在，false表示不存在。有一个path不存在就会返回false。

---

## exist() 

###### 定义
boolean exist() 

###### 说明
判断当前节点是否存在

###### 返回值
`boolean` true表示存在，false表示不存在。

----

## isNumber()

###### 定义
boolean isNumber()

###### 说明
判断当前节点value的类型是否是数值型。

###### 返回值
`boolean` 

----

## isString()

###### 定义
boolean isString()

###### 说明
判断当前节点value的类型是否是`String`类型。

###### 返回值
`boolean` 

----

## isBoolean()

###### 定义
boolean isBoolean()

###### 说明
判断当前节点value的类型是否是布尔类型。

###### 返回值
`boolean` 

----


## Auth
用户登录对象，提供两个属性使用

属性     | 类型|描述
-------- |-----| ---
uid | String| 用户唯一ID
provider| String| 使用的auth方式，TODO 需要补充完整 



# String

## toLowerCase()

###### 定义
String toLowerCase() 

###### 说明
将字符串转为小写

###### 返回值
String 该字符串的大写形式

---
## toUpperCase()

###### 定义
String toUpperCase()

###### 说明
将字符串转为大写

###### 返回值
String 该字符串的小写形式

---

## replace()

###### 定义 
String replace(char oldChar, char newChar) 

###### 说明
将字符串中的oldChar替换为newChar。

###### 参数
* oldChar `char` 被替换的字符串
* newChar `char` 替换的字符串

###### 返回值
String 替换后的字符串

---


---

## matches()

###### 定义
boolean matches(String regex)
###### 说明
判断字符串是否符合给定的正则规则。

###### 参数
* regex `String` 正则表达式

###### 返回值
boolean  true，表示匹配；否则，表示不匹配

---
## contains()

###### 定义
boolean contains(CharSequence s)

###### 说明
字符串是否包含指定子串。

###### 参数
* s `CharSequence` 包含的字符串

###### 返回值
boolean  true，表示包含；否则，表示不包含

---
## startsWith()

###### 定义
boolean startsWith(String prefix)

###### 说明
字符串以指定字符串开头。

###### 参数
* prefix `String` 以指定字符串开头

###### 返回值
boolean  true，表示包含；否则，表示不包含

---

## endsWith()

###### 定义
boolean endsWith(String prefix)

###### 说明
字符串以指定字符串结尾。

###### 参数
* prefix `String` 以prefix字符串结尾

###### 返回值
boolean  true，表示包含；否则，表示不包含

---

