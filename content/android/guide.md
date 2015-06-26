/*
Title : 开发向导
Sort : 2
*/

## 1  安装与设置
### 创建账户和应用
首先注册并登陆Wilddog账号，进入控制面板。在控制面板中，添加一个新的应用。你会获得一个独一无二的应用URL `https://<appId>.wilddogio.com/`，在同步和存取数据的时候，将使用这个URL。

### 引入 Wilddog Java SDK

下载SDK。
[Download Wilddog Java SDK](https://cdn.wilddog.com/android/client/current/wilddog-client-jvm-0.4.0-SNAPSHOT.jar)
（目前只提供jvm版SDK，android版的SDK即将推出）

导入SDK。
将wilddog-client-jvm-xxx.jar拷贝到Android应用的libs目录中，然后在IDE中将jar文件添加到应用的classpath。


## 2 了解数据

### 数据是JSON树
野狗的数据是JSON对象的形式存储在云端数据库中。当我们向JSON树添加一条数据的时候，它将以KEY/VALUE的形式存在于JSON树结构中。
例如，当我们在`users/mchen/`节点下添加一个名字为`widgets`子节点时，数据将如下所示：

```JSON
{
  "users": {
    "mchen": {
      "friends": { "brinchen": true },
      "name": "Mary Chen",
      // our child node appears in the existing JSON tree
      "widgets": { "one": true, "three": true }
    },
    "brinchen": { ... },
    "hmadi": { ... }
  }
}
```
在Java环境下，JSON树可被转换成为以下几种数据类型：`String` `Boolean` `Number` `Map<String, Object>` `List<Object>`。

##创建引用
为了读写数据，你需要创建对Wilddog数据库的引用。这里会用到之前获得的应用URL `https://<appId>.wilddogio.com/`。
```Java
Wilddog rootRef = new Wilddog("https://docs-examples.wilddogio.com/web/data");
```
当创建一个引用不意味就马上创建一个连接。当执行读写操作时，才从云端取数据。 

你可以直接访问path。例如：使用`/web/data/users/mchen/name`直接访问Mary Chen的`name`。
```Java
Wilddog rootRef = new Wilddog("https://docs-examples.wilddogio.com/web/data/users/mchen/name");
```
也可以使用`/web/data`的相对path`users/mchen/name`访问Mary Chen的`name`。
```Java
Wilddog rootRef = new Wilddog("https://docs-examples.wilddogio.com/web/data");
rootRef.child("users/mchen/name");
```

### 节点名称
每个节点名称，在同一父节点下值唯一。节点的全名称叫path例如`/web/data/users/mchen/name`，是全局唯一。全名称的最大长度限制小于等于1024Byte。节点名称不能包含一些特殊ASCII 字符，支持 `0-1 a-z A-Z` 和 `_` `-` `:`，ASCII范围外支持UTF-8编码集。节点key一旦创建是不能修改的。

### 节点Value
节点Value支持 `String` `Boolean` `Number` 和 `null` 。当数据为 `null` 的时候表示数据不存在（或者删除该节点）。节点Value最大长度不能超过1024Byte。
当本节点包含子节点的时候，整个子树是本节点的Value。

### 集合List 与 数据Array
Wilddog没有原生支持 `List` 与 `Array` 。如果试图存储一个 `List` 与 `Array`，其中的元素必须是key为整数和value为object的键值对对象。如下：

```JSON
// we send this
['hello', 'world']
// Wilddog databases store this
{0: 'hello', 1: 'world'}
```  
为了帮助开发者在野狗数据库中存储数组， 当返回的数据像一个数组， getValue()方法返回的数据将是一个数组，数组类型是ArrayList。
```JSON
// we send this
['a', 'b', 'c', 'd', 'e']
// Wilddog databases store this
{0: 'a', 1: 'b', 2: 'c', 3: 'd', 4: 'e'}

// since the keys are numeric and sequential,
// if we query the data, we get this
['a', 'b', 'c', 'd', 'e']

// however, if we then delete a, b, and d,
// they are no longer mostly sequential, so
// we do not get back an array
{2: 'c', 4: 'e'}
```  
#### 限制和约束

| 描述 | 约束 | 备注 |
| --- | --- | --- |
| 树的深度 |32 | |
|key的长度 | 768byte | UTF-8 编码,不能包含 `.` `$` `#` `[` `]` `/` 和 ASCII 控制字符 |
| 一个叶子节点的数据大小 | 10mb | UTF-8 编码 |
| 通过SDK写入的数据大小限制 | 16mb | UTF-8 编码 |
| 通过 REST 写入数据大小限制 |256mb | |
| 一次能读取的节点 |1亿 | |     


## 3 保存数据

在本文档中，我们将介绍向数据库写入数据的方法:`setValue()`, `updateChildren()`, `push()`。

### 保存数据的方法
接口 | 描述
---- | ----
`setValue()` | 覆盖指定路径的所有数据，如messages/users/<username>
`updateChildren()` | 对子节点进行合并操作。不存在的子节点将会被新增，存在子节点将会被替换。
`push()` | 在当前节点下生成一个子节点，并返回子节点的引用。子节点的key利用服务端的当前时间生成，可作为排序使用。

### 使用setValue()写入数
wilddog通常使用`setValue()`方法来写入数据，该方法用来覆盖指定路径上的所有数据。为了更好地理解该方法，我们建立一个blogging APP来说明。APP的数据保存在下面引用对应的路径中：
```Java
Wilddog ref = new Wilddog("https://docs-examples.wilddogio.com/android/saving-data/fireblog");
```
我们需要向数据库添加一些用户，为每个用户保存独一无二的用户名，同时保存用户全名和出生日期。由于每个用户的用户名都是独一无二的，所以最好使用setValue()方法，而不建议使用push()方法，因为我们已经有了独一无二的用户名作为key值，不需要在添加的时候重新生成唯一标识。

首先，我们编写User类代码，将User对象以用户名作为key值添加到Map中。然后，为用户数据所在路径创建引用，调用setValue()方法将Map中的每个用户添加到数据库中。
```Java
public class User {
    private int birthYear;
    private String fullName;

    public User() {}

    public User(String fullName, int birthYear) {
        this.fullName = fullName;
        this.birthYear = birthYear;
    }

    public long getBirthYear() {
        return birthYear;
    }

    public String getFullName() {
        return fullName;
    }
}

User alanisawesome = new User("Alan Turing", 1912);
User gracehop = new User("Grace Hopper", 1906);

Map<String, User> users = new HashMap<String, User>();
users.put("alanisawesome", alanisawesome);
users.put("gracehop", gracehop);

Wilddog usersRef = ref.child("users");

usersRef.setValue(users);
```
我们传入setValue()方法中的对象，需要满足如下条件：
1. 需要对象所属的类中存在默认的构造函数; 
2. 类中所有的属性都定义了getter方法。

我们使用Map将数据保存到数据库中，因为Map中的元素会自动映射成为JSON对象，并保存到指定路径。现在，我们访问 `https://docs-examples.wilddogio.com/android/saving-data/fireblog/users/alanisawesome/fullName`，将会看到返回值"Alan Turing"。我们也可以直接将数据保存到数据库的指定路径：
```Java
//Referencing the child node using a .child() on it's parent node
usersRef.child("alanisawesome").child("fullName").setValue("Alan Turing");
usersRef.child("alanisawesome").child("birthYear").setValue(1912);

//Using the / in the .child() call to specify a child and a grandchild node also works!
usersRef.child("gracehop/name").setValue("Grace Hopper");
usersRef.child("gracehop/birthYear").setValue(1906);
```
上面介绍的两种保存数据的方式，一种是使用Map将所有数据一次性保存到数据库，另一种是将数据分别保存到数据库的指定路径，最终的效果都是一样的：
```JSON
{
  "users": {
    "alanisawesome": {
      "birthYear": "1912",
      "fullName": "Alan Turing"
    },
    "gracehop": {
      "birthYear": "1906",
      "fullName": "Grace Hopper"
    }
  }
}
```
使用`setValue()`方法将会覆盖指定路径的所有数据，包括子节点的数据。
我们向`setValue()`方法传递的参数类型需要与JSON中能用的类型对应，如`String`, `Long`, `Double`, `Boolean`, `Map<String, Object>` 和 `List<Object>`。使用这些数据类型，我们可以构造任意复杂的数据结构，例如Map中嵌套另一个Map。我们可以不使用User对象，而使用Map来实现与上面相同的功能：
```Java
Wilddog usersRef = ref.child("users");

Map<String, String> alanisawesomeMap = new HashMap<String, String>();
alanisawesomeMap.put("birthYear", "1912");
alanisawesomeMap.put("fullName", "Alan Turing");

Map<String, String> gracehopMap = new HashMap<String, String>();
gracehopMap.put("birthYear", "1906");
gracehopMap.put("fullName", "Grace Hopper");

Map<String, Map<String, String>> users = new HashMap<String, Map<String, String>>();
users.put("alanisawesome", alanisawesomeMap);
users.put("gracehop", gracehopMap);

usersRef.setValue(users);
```
注意：如果向`setValue()`方法传递null作为参数，将会删除指定路径的数据。

### 更新已保存的数据
如果想不覆盖路径下的所有数据，只更新部分数据，则可以使用`updateChildren()`方法，例如：
```Java
Wilddog hopperRef = usersRef.child("gracehop");
Map<String, Object> nickname = new HashMap<String, Object>();
nickname.put("nickname", "Amazing Grace");
hopperRef.updateChildren(nickname);
```
以上的代码将会为用户新增nickname属性。如果我们此处使用`setValue()`方法，则用户的fullName和birthYear属性将会被删除，只保留nickname属性。
*注意*: 将null作为参数传给`updateChildren()`，会将指定位置的数据删除。

### 增加回调函数
如果你想知道数据是否已经成功保存，可以增加一个回调函数。`setValue()`和`updateChildren()`方法都支持回调函数，当数据保存失败时，将会返回错误信息：
```Java
ref.setValue("I'm writing data", new Wilddog.CompletionListener() {
    @Override
    public void onComplete(WilddogError wilddogError, Wilddog wilddog) {
        if (firebaseError != null) {
            System.out.println("Data could not be saved. " + wilddogError.getMessage());
        } else {
            System.out.println("Data saved successfully.");
        }
    }
});
```
`updateChildren()`方法只能更新同一层级节点的数据，如果节点不属于同一个层级，则`updateChildren()`方法会被当做setValue()方法执行。

### 向列表中添加数据
当需要向数据库列表中添加数据时，我们需要注意应用通常都是多用户的，应根据实际情况调整列表结构。扩展我们上面的实例，假如我们要向blog APP中新增posts属性。可能你首先想到的是使用`setValue()`方法保存数据，使用自增的序列来作为元素的key值，结构如下：
```Java
// NOT RECOMMENDED - use push()!
{
  "posts": {
    "0": {
      "author": "gracehop",
      "title": "Announcing COBOL, a New Programming Language"
    },
    "1": {
      "author": "alanisawesome",
      "title": "The Turing Machine"
	}
  }
}
```
如果用户要在/posts/2节点处增加一个posts，当只有一个用户操作时是没有问题的，但是实际情况是可能会有多个用户同时添加，当有两个用户同时向/posts/2节点添加数据时，其中一个posts会被另一个覆盖。

为了解决这个问题，wilddog提供了`push()`方法，使用该方法每次新加元素时，都会为元素生成一个唯一标识，通过这种方式，多个客户端可以同时向同一个位置添加元素。`push()`生成的唯一标识是基于时间戳计算得来的，所以列表元素是按照时间顺序排列的。
我们可以通过下面的方式来向blog APP添加posts：
```Java
Wilddog postRef = ref.child("posts");

Map<String, String> post1 = new HashMap<String, String>();
post1.put("author", "gracehop");
post1.put("title", "Announcing COBOL, a New Programming Language");
postRef.push().setValue(post1);

Map<String, String> post2 = new HashMap<String, String>();
post2.put("author", "alanisawesome");
post2.put("title", "The Turing Machine");
postRef.push().setValue(post2);
```
由于使用了`push()`方法为每个blog post生成了基于时间戳的唯一标识，即使多个用户同时添加post也不会产生冲突。Wilddog数据库中的数据结构如下：
```Java
{
  "posts": {
    "-JRHTHaIs-jNPLXOQivY": {
      "author": "gracehop",
      "title": "Announcing COBOL, a New Programming Language"
    },
    "-JRHTHaKuITFIhnj02kE": {
      "author": "alanisawesome",
      "title": "The Turing Machine"
    }
  }
}
```
获取`push()`方法生成的唯一标识：
调用`push()`方法将会返回一个指向新路径的引用，我们可以通过这个引用来获取唯一标识，或者在新路径中添加数据。下面的代码可以实现上面实例的功能，同时我们可以获取`push()`方法生成的唯一标识：

```Java
// Generate a reference to a new location and add some data using push()
Wilddog postRef = ref.child("posts");
v newPostRef = postRef.push();

// Add some data to the new location
Map<String, String> post1 = new HashMap<String, String>();
post1.put("author", "gracehop");
post1.put("title", "Announcing COBOL, a New Programming Language");
newPostRef.setValue(post1);

// Get the unique ID generated by push()
String postId = newPostRef.getKey();
```
通过getKey()方法就可以获取生成的唯一标识。

### 离线操作
如果客户端断开了网络连接，你的应用依然可以正确工作。

## 4 获取数据

Wilddog 通过为client附加一个异步EventListener监听器来获得数据。监听器将触发一次数据的初始化和同步后续数据变化。
使用 `addValueEventListener()` 监听一个数据节点的变化。

```Java
	client.addValueEventListener(new ValueEventListener(){
		public void onDataChange(DataSnapshot snapshot) {
			System.out.println(snapshot.getValue());
		}

		public void onCancelled(WilddogError error) {
			if(error != null){
				System.out.println(error.getCode());
			}
		}
	}
```

监听器使用callback模式，每个callback方法接收到Snapshot对象，是数据的快照，所以为只读数据。调用`Snapshot.getValue()` 返回Object对象，可能的类型为`Boolean` `String` `Number` `Map<String, Object>` `null`。如果没有数据存在，将返回`null`。

像这样，实现`onDataChange` 接口，将触发一次数据的初始化，即从云端pull数据到本地，之后云端 push 该数据节点的变化数据，包括子节点的变化。

上面事例已经接触到了`ValueEventListener` 与 `Snapshot` 俩个重要类，下面详细说明这两个类。

### ValueEventListener 与 ChildEventListener

监听器分4个监听事件，`Value Changed` `Child added` `Child removed` `Child Changed`。分别对应四个callback方法`onDataChanged()`  `onChildAdded()` `onChildRemoved()` `childChanged()`。

#### Value Changed

本地第一次pull数据的时候，需要实现该接口，并在后续该数据节点发生变化时也将触发该方法。
该方法获得Snapshot参数，代表最新的数据，非叶子节点，将包含所有下级的子节点。

#### Child Added

当本节点有新的子节点添加成功时，将触发`onChildAdded()`。如果一次同步有N个子节点添加成功，将触发N次`onChildAdded()`。如果新加的子节点还包含子节点，这个孙子节点不会触发`onChildAdded()`，但是将会触发`onChildChanged()`。
该方法获得Snapshot参数，代表新添加的子节点数据，非叶子节点，将包含新的子节点的所有下级子节点。

#### Child Removed 

当本节点有子节点被删除成功时，将触发`onChildRemoved()`。如果一次同步有N个子节点被删除，将触发N次`onChildRemoved()`。如果被删除的子节点还包含子节点，这些孙子节点也将被删除，但是不会触发`onChildRemoved()`，但是将会触发`onChildChanged()` 。
该方法获得Snapshot参数，代表被删除的子节点数据，非叶子节点，将包含被删除子节点的所有下级子节点。

#### Child Changed

当本节点有子节点发生变化时，将触发`onChildChanged()`。如果一次同步有N个子节点被修改，将触发N次`onChildChanged()`。触发`onChildChanged()`的条件有：

* 子节点的value发生变化；
* 孙子节点有value发生变化；
* 子节或孙子节点发生`childRemoved` `childChanged` `childAdded`。

### Snapshot

与监听事件配合，在事件触发的时候作为参数传递给用户使用。不同的事件代表的含义不同。

* value changed 触发时， `snapshot` 代表该节点最新的数据，包含节点的value或者该节点的整个子树。
*  child added 触发时， `snapshot` 代表新添加的子节点，包含新子节点的value或者新子节点的整个子树。
*  child removed 触发时， `snapshot` 代表被删除的子节点，包含被删除的子节点的value或者它的整个子树。
*  child changed 触发时， `snapshot` 代表发生变化的子节点，包含子节点的alue或者子节点的整个子树。
注意以上获得的snapshot，不只包含有变化的数据。如果使用`onChildRemoved()` 则为删除前该节点的数据快照；如果使用`onDataChanged()`    `onChildAdded()`  `onChildChanged()`则为操作后的该节点的数据快照。

## 5 查询数据
很多情况下，我们需要按条件查询部分数据。Wilddog提供Query功能，可以先对数据进行排序，如`orderByChild()`，`orderByKey()`， `orderByValue()` ，`orderByPriority()` ；再通过条件函数来筛选数据，如`limitToFirst()`，`limitToLast()`， `startAt()`， `endAt()`， `equalTo()` 。

我们Wilddog同学认为野生动物是最cool的，我们使用[Wilddog的Zoo](https://zoo.wilddogio.com)数据库来演示Query功能。下面是Zoo的数据片段：
```JSON
{
  "SnowLeopard": {
    "shoulderHeight" : 50,
    "length" : 120,
    "tailLength" : 90,
    "weight": 70
  },
  "Jaguar": {
    "shoulderHeight" : 100,
    "length" : 250,
    "tailLength" : 80, 
    "weight" : 170
  },
  "Wilddog": {
    "shoulderHeight" : 60,
    "length" : 110,
    "tailLength" : 30, 
    "weight" : 30
  }
}
```
我们可以通过四种方式排序，按照`key`，`child key`，`value` 和 `priority`。每一次query都会依赖一种排序方式，默认按照`priority`排序，每种排序详解如下：

### `child key` 排序
某一级数据对象拥有一个共同的子节点，可以使用接口`orderByCHild()`按照这个子节点的value排序。例如，现在我们查看所有野生动物的肩高情况，
```Java
Wilddog ref = new Wilddog("https://zoo.wilddogio.com/animals");
Query query = ref.orderByChild("shoulderHeight");

query.addChildEventListener(new ChildEventListener() {
    @Override
    public void onChildAdded(DataSnapshot snapshot, String previousChild) {
        Map<String, Object> value = (Map<String, Object>)snapshot.getValue();
        System.out.println(snapshot.getKey() + ", shoulder height is " + value.get("shoulderHeight") + " cm ");
    }
    // ....
});
```
输出结果：
```Java
SnowLeopard, shoulder height is 50 cm
Wilddog, shoulder height is 60 cm
Jaguar, shoulder height is 100 cm
```
如果有一个数据对象没有包含指定的`child key`，其value按照null处理。这意味这个数据对象将排到最前面，详细的`oreder by` 规则可以参照[数据排序](https://z.wilddog.com/android/guide#6-)。
query一次只能选用一个orederBy*。同一个query上多次调用orderBy*将抛出一个异常。

### `key` 排序
我们也可以按照节点的key name的字母顺排序，下面的示例使用字母序排列动物们：
```Java
Wilddog ref = new Wilddog("https://zoo.wilddogio.com/animals");
Query query = ref.orderByKey();

query.addChildEventListener(new ChildEventListener() {
    @Override
    public void onChildAdded(DataSnapshot snapshot, String previousChild) {
        System.out.println(snapshot.getKey());
    }
    // ....
});
```
输出结果：
```Java
Jaguar
SnowLeopard
Wilddog
```

### `value` 排序
我们可以直接通过节点的值进行排序，使用orderByValue()方法。我们为野生动物们举行了一场睡觉运动会，记录了它们的成绩，我们可以为它们做一个排行榜，数据如下：
```Java
{
  "records": {
    "Wilddog" : 480,
    "SnowLeopard" : 320,
    "Jaguar" : 610,
	"BrownBear":370,
	"Porcupine" : 700,
	"Hyena" : 260,
	"BengalWhiteTiger" : 530
  }
}
```
```Java
Wilddog ref = new Wilddog("https://zoo.wilddogio.com/records");
Query query = ref.orderByValue();

query.addChildEventListener(new ChildEventListener() {
    @Override
    public void onChildAdded(DataSnapshot snapshot, String previousChildKey) {
      System.out.println("The " + snapshot.getKey() + "  has been slept " + snapshot.getValue() + " hours");
    }
    // ....
});
```
输出结果：
```Java
The Hyena has been slept for 260 hours
The SnowLeopard has been slept for 320 hours
The BrownBear has been slept for 370 hours
The Wilddog has been slept for 480 hours
The BengalWhiteTiger has been slept for 530 hours
The Jaguar has been slept for 610 hours
The Porcupine has been slept for 700 hours
```

### `priority` 排序
如果对某一层数据对象使用过`setPriority`之后，可以使用`orderByPrioriy()`进行排序，具体排序规则可以查看[数据排序](https://z.wilddog.com/android/guide#6-)。

## 6 数据排序
本节讲述在Wilddog中数据是如何排序的，以及如何读取有序的数据。

### orderByChild
当使用`orderByChild()`时，包含指定字段的数据将会按照以下规则排序：
1. 指定字段的值为`null`的子节点数据排在最前边。
2. 接下来是指定字段的值为`false`的子节点数据。如果存在多个子节点该字段的值为`false`，那么这些子节点根据节点名按字典序排列。
3.  接下来是指定字段的值为`true`的子节点数据。如果存在多个子节点该字段的值为`true`，那么这些子节点根据节点名按字典序排列。
4. 接下来是指定字段的值为数值类型的子节点数据，按照升序排列。如果存在多个子节点该指定字段的值相同，那么这些子节点数据按照节点名排序。
5. 接下来是字符串类型的值，按照字典序升序排列。如果存在多个子节点该指定字段的值相同，那么这些子节点数据按照节点名排序。
6. 最后是对象类型的值，按照节点名升序排列。

### orderByKey
当使用`orderByKey()`对数据进行排序时，数据将会按照下面的规则，以字段名升序排列返回。注意，节点名只能是字符串类型。
1. 节点名能转换为32-bit整数的子节点优先，按数值型升序排列。
2. 接下来是字符串类型的节点名，按字典序排列。

### orderByValue
当使用`orderByValue()`时，子节点将会按照它们的值进行排序。排序的规则与`orderByChild()`相同，唯一的区别是使用的是本节点的值，而不是节点下指定字段的值。

### orderByPriority
当使用`orderByPriority()`对数据进行排序时，子节点数据将按照优先级和字段名进行排序。注意，优先级的值只能是数值型或字符串。
1. 没有优先级的数据（默认）优先。
2. 接下来是优先级为数值型的子节点。它们按照优先级数值排序，由小到大。
3. 接下来是优先级为字符串的子节点。它们按照优先级的字典序排列。
4. 当多个子节点拥有相同的优先级时（包括没有优先级的情况），它们按照节点名排序。节点名可以转换为数值类型的子节点优先（数值排序），接下来是剩余的子节点（字典序排列）。


## 7 复杂查询
我们已经知道如何将数据进行排序，然后通过下面的描述，我们将学会如何构建更加复杂的条件限制查询。

### limit 查询
我们要找出最肥的两只动物，对他们进行减肥训练。
```Java
Wilddog ref = new Wilddog("https://zoo.wilddogio.com/animals");
Query queryRef = ref.orderByChild("weight").limitToLast(2);

queryRef.addChildEventListener(new ChildEventListener() {
    @Override
    public void onChildAdded(DataSnapshot snapshot, String previousChild) {
     Map<String, Object> value = (Map<String, Object>)snapshot.getValue();
        System.out.println(snapshot.getKey() + "'s weight is " + value.get("weight"));
    }
    // ....
});
```
`orederByChild()`按照value的升序排序，所以最肥的在最后面，因此在配合使用`limitToLast(2)`取最后两条数据。使用`limitToFirst(2)`将获得重量最轻的前俩个。
本示例中`onChildAdded()`将触发两次，除非总数据量不足2个。
当使用`limitToLast(2)`后，如果新加入一只更肥的动物，将会推送给client，将原来两只中较轻的一只移除，最后client本地只有两只动物。

如果我们想要创建一个睡觉运动会前三动物的排行榜。我们可以这么做：
```Java
Wilddog ref = new Wilddog("https://zoo.wilddogio.com/records");
Query query = ref.orderByValue().limitToLast(3);

query.addChildEventListener(new ChildEventListener() {
    @Override
    public void onChildAdded(DataSnapshot snapshot, String previousChildKey) {
       System.out.println("The " + snapshot.getKey() + "  has been slept " + snapshot.getValue() + " hours");
    }
    // ....
});
```

### Range 查询
使用`startAt()`，`endAt()`和 `equalTo()` 可以为我们的查询选择任意的起点和终点。例如，我们想要找到所有动物中身长至少1米的动物，可以结合`orderByChild()` 和 `startAt()`，
```Java
Wilddog ref = new Wilddog("https://zoo.wilddogio.com/animals");
Query query = ref.orderByChild("length").startAt(100);

queryRef.addChildEventListener(new ChildEventListener() {
    @Override
    public void onChildAdded(DataSnapshot snapshot, String previousChild) {
        System.out.println(snapshot.getKey());
    }
    // ....
});
```
`startAt()`与`endAt()`一起使用可以界定一个范围，我可以查找所有动物中身长在1米到1米5之间的动物，
```Java

Wilddog ref = new Wilddog("https://zoo.wilddogio.com/animals");
Query query = ref.orderByChild("length").startAt(100).endAt(150);

queryRef.addChildEventListener(new ChildEventListener() {
    @Override
    public void onChildAdded(DataSnapshot snapshot, String previousChild) {
        System.out.println(snapshot.getKey());
    }
    // ....
});
```
使用`equalTo()`可以精准配置数据，例如我们要查找孟加拉虎，

```Java
Wilddog ref = new Wilddog("https://zoo.wilddogio.com/animals");
Query query = ref.orderByKey().equalTo("BengalWhiteTiger");

query.addChildEventListener(new ChildEventListener() {
    @Override
    public void onChildAdded(DataSnapshot snapshot, String previousChild) {
        System.out.println(snapshot.getValue());
    }
    // ....
});
```


## 8 离线事件
Wilddog提供了离线事件触发功能。使用`OnDisconnect()`获得离线事件配置对象，它有4个方法`removeValue()`，`setValue()`，`updateChildren()`，`cancel()`。调用`removeValue()`，`setValue()`，`updateChildren()`后，将在服务端注册3个数据操作事件，当在Client彻底断线，服务端将侦测到client连接断开后，将触发已注册的事件。调用`cancel()` 将注销所有离线事件。


## 9 使用Auth登录
上面的Wildblog中使用的用户系统比较简陋，不能做ACL，比如获得用户自己的blog列表，用户只能删除自己的blog，等等。这时可以使用高级一些的auth接口并配合Rule模块来完成用户的ACL。
```Java
ref.createUser("Jason", "12345678", null);
```
使用 `createUser()` 可以创建新的用户，新的用户在Wilddog的独立的用户系统中保存，并且每个App的用户系统之间是相互隔离的。
```Java
ref.authWithPassword("Jason", "123456", null);
```
使用 `authWithPassword()` 登录用户。
```Java
Auth auth = ref.getAuth();
```
获得 `auth` 对象。使用 `auth` 对象来关联用户自己的数据。
```Java
Map<String, Object> jason = new HashMap<String, Object>();
Jason.put("birthYear", 1988);
Jason.put("nickName", "wangjibo");
Jason.put("grade", 1);
Jason.put("pv", 0);

Wilddog userRef = ref.child("users").child(auth.getUid());
userRef.setValue(jason);

```
这样，blog的用户信息与登录用户关联了起来，同样也可以将blog数据与登录用户关联起来。
```Java
Wilddog blogRef = ref.child("blogs").child(auth.getUid());

Map<String, String> blog = new HashMap<String, String>();
blog.put("author", "Jason");
blog.put("title", "Wilddog学习笔记1");
blog.put("content", "hello world");

Wilddog newRef = blogRef.push();
newRef.setValue(blog);
```
最后在配置Wildblog的Rule，已可以限制用户的权限了。
```Javascript
{
	"rules": {
		"wildblog":{
			"users": {
				".read" : true,
				"$userId" : {
					".write": "auth.id === $userId"
				}
			},
			
			"blogs": {
				".read" : true,
				"$userId" : {
					"$blogId" : {
						".write" : "auth.id === $userId"
					}
				}
			}
		}
	}
		
}
```
这个Rule表示，登录用户只能修改自己的信息与自己的blog。