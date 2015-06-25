/*
Title: 使用指南
Sort: 2
Tmpl : page-guide
*/

## 1. 理解 Wilddog 的安全策略

Wilddog 提供了一套完整的安全策略来保障安全。使用这些工具能更容易的控制用户身份验证以及数据的访问权限，并校验数据输入的正确性。

####  概述

安全是一个非常重大的话题，也是应用开发中的一个难点。使用Wilddog开发你的App，安全变的简单许多。有的方面彻底交给我们就可以了，比如管理App的用户和密码；我们不能完全处理的地方，我们都做到最简化，例如我们提供了一种声明式的语言，用于保护你的数据安全。


#### 身份认证

每个用户都有一个唯一ID，在Wilddog的安全策略中起到很重要的作用。不同的用户有不同的数据访问权限，有时不同用户也有不同的功能。例如，在聊天程序中，每个消息与创建它的用户相关联。用户可以删除自己的消息，但不能删除其他用户的消息。想要确保安全，第一步是识别用户合法性，这个过程就是auth认证。

Wilddog 提供三种auth机制，

* Email和password登录。Wilddog提供了用户账户管理功能。
* 集成微博第三方登录。
* Custom token登录，使用你已有的账户体系登录。


#### 用户授权
用户身份认证只是安全体系中的一部分。一旦确认了用户身份，还需要一种机制来控制对数据的访问权限。
Wilddog提供了一种声明式的语言来编写“规则表达式”，这些规则在Wilddog云端保护App数据。你可以进入Wilddog的控制面板，选择一个应用进行管理，在“规则表达式”中编辑这个规则。
通过这个规则表达式，你可以控制任何一个数据节点的访问权限。在任何一个数据节点上适用的规则，将会自动延展到所有子节点。

```Json
{
  "rules": {
    "foo": {
      ".read": true,
      ".write": false
    }
  }
}
```

这个规则示例使任何人都有权限读取 `/foo` 节点和它的所有子节点的数据，但禁止任何人修改数据。
Wilddog的规则表达式中包含一些内置的变量和函数，可用于构建规则表达式表达式。这些变量和函数功能强大，使得表达式中可以引用其它数据节点，云端时间戳等。
其中最重要的内置变量是`auth` 对象，它代表用户的身份信息，包含用户唯一标识`auth.uid` 和 用户登录方式`auth.provider`。`auth` 对象是许多规则的基础。

```JavaScript
{
  "rules": {
    "users": {
      "$user_id": {
        ".write": "$user_id == auth.uid"
      }
    }
  }
}
```
规则中以`$`开头的路径$user_id是一个动态路径。这个规则授予用户`/users/<auth.uid>/`的写权限，当用户的唯一id与规则中动态路径变量相匹配时。

#### 数据校验
Wilddog是一个schema-free的数据库。但是应用数据的一致性是很重要的。 规则表达式引擎中包含一个`.validate`规则。它的使用和`.read`，`.write`相同，唯一的区别是`.validate`规则不会自动延展到子节点。

```JavaScript
{
  "rules": {
    "foo": {
      ".validate": "newData.isString() && newData.val().length < 100"
    }
  }
}
```
这条规限制强制写入`/foo`时，必须是长度少于100的字符串。

`.validate`规则中可以使用所有的`.read`和`.write`规则的内置对象。同样可以使用 `auth`等对象。
```JavaScript
{
  "rules": {
    "user": {
      ".validate": "auth != null && newData.val() == auth.uid"
    }
  }
}
```
这条规则限制数据写入`/users`时，必须登录一个用户，且写入数据的值必须是登录的用户ID。
`.validate`规则不能替代App代码中对数据的校验。为了更好的性能和用户体验，你仍然需要在代码中对输入数据进行校验。

## 2. 数据安全

Wilddog提供了一个强大的，基于表达式的，类似javascript的规则语言。通过这个语言，你可以定义数据的组织形式，读写权限。规则运行在Wilddog云端，任何时间对任何数据的操作都会经过规则引擎。

#### 概述
规则是声明式的，即独立于主产品逻辑之外。这样是有好处的：安全性不完全依赖于客户端，无需中间服务器即可保护数据安全，真正解决无后端应用中的安全问题。

#### 规则种类
规则表达式共有三个类型，如下表：
| 规则类型 | 描述 |
| --- | --- |
| .read | 定义了数据是否可以被用户读取 | 
| .write | 定义了数据是否可以被用户写入 |
| .validate | 定义了什么样的数据是正确的格式，是否有某些子属性，数据类型等 | 

规则被存储为JSON格式，如下：
```js
{
  "rules": {
    "foo": {
      // /foo/ is readable by the world
      ".read": true,
      // /foo/ is writable by the world
      ".write": true,
      // data written to /foo/ must be a string less than 100 characters
      ".validate": "newData.isString() && newData.val().length < 100"
    }
  }
}
```
如果没有为指定的节点赋予读和写的规则表达式（如上边代码中数据的根节点），那么它们将会采用默认值false。

#### 内置变量
在规则表达式中，可以使用一些内置变量。下面的实例中将会涵盖到大部分内置变量，这里先列出一个简要描述：
| 变量 | 描述 |
| --- | --- |
| now | 当前的时间戳，以毫秒作为单位 |
| root | 一个DataSnapshot对象，代表数据根节点 |
| newData | 一个DataSnapshot对象，代表试图进行的操作完成之后的数据，包括旧的数据和新写入的数据 |
| data | 一个DataSnapshot对象，代表试图进行的操作之前，该节点的数据 |
| $variable | 一个路径的通配 |
| auth | 当前登陆用户的信息 |

#### data和newData
data指的是写操作发生之前，当前节点的数据。newData则指的是，假定写操作会成功，那么写操作成功之后当前节点的数据。newData代表的是旧数据和即将写入的数据合并之后的数据。

为了演示它们的用法，考虑一个这样的场景：我们需要一个规则，在指定的路径下，当前节点数据不存在的时候可以写入，也可以删除已存在的数据，但不能对已有数据进行修改：
```js
// we can write as long as old data or new data does not exist
// in other words, if this is a delete or a create, but not an update
".write": "!data.exists() || !newData.exists()"
```

#### 引用其它路径的数据
通过使用内置变量`root`，`data`和`newData`，你可以访问到任何数据节点。

参考下面的例子，只有当`allow_writes`节点的值为`true`，且父节点没有设置一个`readOnly`标志，且新写入的数据中存在名为`foo`的子节点时，数据才被允许写入。
```js
{
  ".write": "root.child('allow_writes').val() === true &&
            !data.parent().child('readOnly').exists() &&
            newData.child('foo').exists()"
}
```

#### 规则重叠
这是一个非常重要的特性！规则表达式遵循一个自上向下延展的原则。如果一个数据节点上的`.write`或`.read`规则执行结果为true时，同时它的所有的子节点也都将拥有读或写的权限。子节点上的规则不能收回父节点或祖先节点已经赋予的读或写的权限。参考下面的例子：
``` js

  "rules": {
     "foo": {
        // allows read to /foo/*
        ".read": "data.child('baz').val() === true",
        "bar": {
          /* ignored, since read was allowed already */
          ".read": false
        }
     }
  }
}
```
在这个规则的作用下，只要当`/foot/`节点包含一个名为`baz`且值为`true`的子节点时，`/bar`就能被读取。`/bar`下的规则`".read":false`不起任何作用。因为.read的默认值本来就是`false`，而且当`/foo`的`.read`规则运行结果为`true`时，子节点`bar`也不能收回已赋予的权限。

#### 规则不是过滤器
规则的执行是原子性的。在一次操作中，只要任何一个数据节点没有访问权限，那么整个操作将会失败。参考这个例子：
```js
{
  "rules": {
    "records": {
      "rec1": {
        ".read": true
      },
      "rec2": {
        ".read": false
      }
    }
  }
}
```
如果不理解规则执行的原子性，很可能会误以为读取路径`/records`将会返回`rec1`，不返回`rec2`。然而实际的结果是，整个读取操作返回一个错误。

由于读操作是原子性的，`rec2`是不可读的，因此将会返回一个没有操作权限的错误。

#### 使用$Variables
规则路径中以`$`开头的变量是通配的，它的值可以在规则表达式中被使用：
```js
{
  "rules": {
    "rooms": {
      // this rule applies to any child of /rooms/, the key for each room id
      // is stored inside $room_id variable for reference
      "$room_id": {
        "topic": {
          // the room's topic can be changed if the room id has "public" in it
          ".write": "$room_id.contains('public')"
        }
      }
    }
  }
}
```

也可以如下面这样使用，限定在`/widgets/`节点下，任何没有明确列出的子节点都不能被写入：
```js
{
  "rules": {
    "widget": {
      // a widget can have a title or color attribute
      "title": { ".validate": true },
      "color": { ".validate": true },
      // but no other child paths are allowed
      // in this case, $other means any key excluding "title" and "color"
      "$other": { ".validate": false }
    }
  }
}
```

需要注意的是，规则路径中的动态变量总是字符串类型的。如果需要把`$variables`和一个数值进行比较，将总是返回false。正确的写法是将数值转换为字符串（如：$key == newData.val() + ''）。


#### 数据校验
通过`.validate`规则，可以保障数据的组织形式和格式。`.validate`规则在`.write`规则执行成功之后执行。下面的例子只允许格式为 YYYY-MM-DD且年份在1900-2099之间的数据被写入：
```js
".validate": "newData.isString() &&
              newData.val().matches(/^(19|20)[0-9][0-9][-\\/. ](0[1-9]|1[012])[-\\/. ](0[1-9]|[12][0-9]|3[01])$/)"
```

`.validate`规则不会重叠延展。如果在一次操作中，任何一个子节点的`.validate`规则失败，整个写操作都将失败。当数据被删除（也就是值为null）时，`.validate`表达式被忽略。

参考下面的规则：
```js
{
  "rules": {
    // write is allowed for all paths
    ".write": true,
    "widget": {
      // a valid widget must have attributes "color" and "size"
      // allows deleting widgets (since .validate is not applied to delete rules)
      ".validate": "newData.hasChildren(['color', 'size'])",
      "size": {
        // the value of "size" must be a number between 0 and 99
        ".validate": "newData.isNumber() &&
                      newData.val() >= 0 &&
                      newData.val() <= 99"
      },
      "color": {
        // the value of "color" must exist as a key in our mythical
        // /valid_colors/ index
        ".validate": "root.child('valid_colors/' + newData.val()).exists()"
      }
    }
  }
}
```

下面用javascript SDK作为示例，展示了各种写操作的结果。
```js
var ref = new Wilddog(URL + "/widget");

// 写入失败: 没有color和size子节点
ref.set('foo');

// 写入失败: 没有color子节点
ref.set({size: 22});

// 写入失败：size子节点不是数值
ref.set({ size: 'foo', color: 'red' });

// 写入成功：
ref.set({ size: 21, color: 'blue'});

// 如果节点存在且有color子节点, 操作将会成功, 否则失败，因为newData.hasChildren(['color', 'size'])将会失败。
ref.child('size').set(99);
```

#### 匿名聊天的例子
下面是一个匿名聊天的App的规则示例：

```js
{
  "rules": {
    "room_names": {
      ".read": true,
      "$room_id": {
        
        ".validate": "newData.isString()"
      }
    },
    "messages": {
      "$room_id": {
        
        ".read": true,
        
        ".validate": "root.child('room_names/'+$room_id).exists()",
        "$message_id": {
          
          ".write": "!data.exists() && newData.exists()",
          
          ".validate": "newData.hasChildren(['name', 'message', 'timestamp'])",
          
          "name": { ".validate": "newData.isString() && newData.val().length > 0 \
              && newData.val().length < 20 && !newData.val().contains('admin')" },
          
          "message": { ".validate": "newData.isString() && newData.val().length > 0 && newData.val().length < 50" },
          
          "timestamp": { ".validate": "newData.val() <= now" },
          
          "$other": { ".validate": false }
        }
      }
    }
  }
}
```
