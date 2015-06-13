/*
Title : 开发向导
Sort : 2
*/


## 1 了解 Wilddog 云数据存储

### 更像一个 JSON Tree
Wilddog云存储使用树形数据结构，替代古老的数据table的方式。树形数据天然拥有关系型数据的特点，而且更能直观表述数据之间的关系。
整个树形数据更像一个JSON对象，没有 table 或 record，所以我们使用JSON来表述这棵数据树。每一个数据节点，都可以用一个 path 来表示，如下：

```JSON
	{
		"users" : {
			"lich" : { "age" : 35, "Shape" : "thin" },
			"Pudge" : {"age" : 60, "Shape" : "fat", "ability" : "gank" }
		}		
	}
```
`lich` 节点的path为`/users/lich`，该节点还有两个子节点做为它的属性。而 `Pudge` 节点可以拥有三个属性。所以更像NoSQL数据库的存储方式，比如mongoDB的JSON方式。`lich` 与 `Pudge` 节点做为 `users` 的子节点，可以将 `users` 看作一个table，`lich` 与 `Pudge` 看作 `users` 的数据项。

更像NoSQL，或者说更像JSON对象的一点，可以给 `users` 添加一个 `amount` 子节点，可以看作 `users` 的属性，如下：

```JSON
	{
		"users" : {
			"lich" : { "age" : 35, "Shape" : "thin" },
			"Pudge" : {"age" : 60, "Shape" : "fat", "ability" : "gank" },
			"amount" : 2
		}		
	}
```

### 节点名称
每个节点名称作为key，在同一父节点下值唯一。path作为节点的全名称，全局唯一。全名称有最大长度限制，小于等于1024Byte。节点名中不能包含一些特殊ASCII 字符，在ASCII范围内只支持 `0-1 a-z A-Z` 和 `_` `-` `:`三个符号，ASCII范围外支持UTF-8编码集。节点key一旦创建是不能修改的。

### 节点Value
节点值支持 `String` `Boolean` `Number` 和 `null` 。当数据为 `null` 的时候表示数据不存在（或者删除该节点）。
当本节点包含子节点的时候，可以将整个子树看作本节点的value。
节点value最大长度不能超过1024Byte。

### List 与 Array
Wilddog没有原生支持 `List` 与 `Array` 。如果试图存储一个 `List` 与 `Array`，有替代方案解决，可以被存储为一个对象节点，整数作为key。如下：

```JSON
// you want this
['Jan', 'Feb', 'Mar']
// replace
{0: 'Jan', 1: 'Feb', 2: 'Mar'}
```  

### Path
每个数据节点都有一个对应的 `path` 。读和写Wilddog的数据时，我们首先创建一个数据存储的引用，加载指定的 `URL` 。其中， `URL` 包含一个 `URI` ，就是使用数据节点的 `ptah`  作为 `URI`  。

```Java
Wilddog client = new Wilddog('https://<appId>.wilddogio.com/test/data');
```
该引用的 `URI` 为 `/test/data`，也是数据节点的 `path` 
因此，每个数据都有统一资源定位，通过浏览器访问地址 `https://<appId>.wilddogio.com/test/data.json`，可以获取该节点JSON数据；如果在登录状态可以在浏览器中直接输入URL地址 `https://<appId>.wilddogio.com/test/data`，进入该节点的数据预览页面。

## 2 建立连接

使用App的域名，建立一个Wilddog client连接。
```Java
try{
	Wilddog client = new Wilddog("https://demo-z.wilddogio.com/test/data");
} catch(Exception e) {
	e.printStackTrace();
}
```
`new Wilddog()` 需要使用`try catch` ，当出现异常时，建立连接失败。成功后返回的client定位到`/test/data` 这个数据节点上。此时并没有开始同步数据。
多次调用`new Wilddog()`，可以给于不同的URI来定位不同的数据的节点，但是对于同一个AppId，本地仅会建立一个连接；也可以通过`child()` 与 `getParent()` 方法来定位数据节点。
定位完节点，获得节点的引用，可以对该节点进行读写操作。


## 3 获取数据

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


## 4 修改数据

### 修改数据的方式

接口 | 描述
---- | ----
`setValue()` | 在当前Path进行覆盖操作，设置成最新的数据。将会取代已有的整个子树。
`push()` | 在当前Path进行新添加操作，将在本地为新数据生成一个唯一ID，该ID将作为当前path的子节点，且作为新数据的父节点。例如当前Path为 `/a/b`，push()，操作后变为 `/a/b/<id>`。
`updateChildren()` | 更新当前Path节点的数据，不会取代已存在的子节点。
`removeValue()` | 删除当前Path节点的数据

### setValue()
Wilddog通过 `setValue()` 保存新的数据到App中，将替换当前Path节点的所有数据。我们将构建一个简单的Blog App，来理解这些API的使用。把我们的blog程序的数据保存到下面这个wilddog引用中：

```Java
Wilddog ref = new Wilddog("https://demo-blog.wilddogio.com/wildblog");
```
开始，我们需要在wildblog app中创建一些用户，使用用户名作为节点的key，并包含用户的属性，昵称、出生年份、blog等级和访问量。因为每个用户有一个独一无二的用户名，最好使用`setValue()` ，而不是使用`push()`，`push()` 将动态创建一个唯一key作为节点名，但是这样没有什么意义。

创建一个blog的User类，并创建一些用户对象存储到wildblog中。这个User类需要符合JavaBean规范，只需要一个初始化属性的构造器和属性的getter方法。

```Java
public class User {
    private String nickName;
    private int birthYear;
    private int grade;
    private int pv;

    public User() {}

    public User(String nickName, int birthYear) {
        this.nickName = nickName;
        this.birthYear = birthYear;
        this.grade = 1;
        this.pv = 0;
    }

    public int getGrade() {
        return grade;
    }

	public int getPv() {
        return pv;
    }

    public String getNickName() {
        return nickName;
    }
    
    public long getBirthYear() {
        return birthYear;
    }
}

User jackson = new User("binxu", 1985);
User jason = new User("jibo", 1988);

Wilddog usersRef = ref.child("users");

Map<String, User> users = new HashMap<String, User>();
users.put("Jackson", jackson);
users.put("Jason", jason);

usersRef.setValue(users);

```

我们使用一个`Map` 对象保存数据。调用`setValue()`，会将Map和User类都映射成Json对象，最终将递归嵌套生成子树和子节点。现在，在浏览器输入 https://demo-blog.wilddogio.com/wildblog/users/Jason， 将会看到wildblog的用户“Jason”的value，User类的属性形成了Jason节点的子节点。可以通过`setValue()` 重新设置用户的属性：

```Java
//使用 child() 选择子节点
usersRef.child("Jason").child("nickName").setValue("wangjibo");
usersRef.child("Jason").child("grade").setValue(2);

//在child()中使用'/'选择孙子节点
usersRef.child("Jackson/nickName").setValue("liaobinxu");
usersRef.child("Jackson/birthYear").setValue(1986);

// 新加一个用户，不使用User类
usersRef.child("Tim/nickName").setValue("beibei");
usersRef.child("Tim/birthYear").setValue(1983);
usersRef.child("Tim/grade").setValue(1);
usersRef.child("Tim/pv").setValue(0);
```
上面的例子，也可以作为添加新的用户，调用`child()` 可以接受不存在的Path，将会动态创建这些不存在的节点，所以可以用于新建操作。
目前，wildblog app经过操作后，Path `/wildblog/users/` 的 JSON Tree 如下：
```JSON
{
  "users": {
    "Jackson": {
      "birthYear": "1986",
      "nickName": "liaobinxu",
      "grade": 1,
      "pv": 0
 	},
    "Jason": {
      "birthYear": "1988",
      "nickName": "wangjibo",
      "grade": 2,
      "pv": 0
 	},
 	"Tim": {
      "birthYear": "1983",
      "nickName": "beibei",
      "grade": 1,
      "pv": 0
 	}
  }
}
```

**注意： 使用setValue()将覆盖当前位置的数据，包括下级所有子节点 。**

可以通过`setValue()` 设置数据的类型可以是：`String` `Long` `Integer` `Double` `Boolean` `Map<String, Object>`。支持这些类型可以构建任意数据结构， 例如 `Map` 可能包含另外一个 `Map`，使用 `Map` 替代User类：

```Java
Wilddog usersRef = ref.child("users");

Map<String, Object> jason = new HashMap<String, Object>();
Jason.put("birthYear", 1988);
Jason.put("nickName", "wangjibo");
Jason.put("grade", 1);
Jason.put("pv", 0);

Map<String, Map<String, Object>> users = new HashMap<String, Map<String, Object>>();
users.put("Jason", jason);

usersRef.setValue(users);
```

### updateChildren()
如果你想修改或新建，一个或多个子节点时，又不想覆盖其他子节点，可以使用`updateChildren()` 方法。

```Java
Wilddog jasonRef = usersRef.child("Jason");
Map<String, String> nickname = new HashMap<String, String>();
nickname.put("nickName", "Axe");
jasonRef.updateChildren(nickname);
```

上面代码更新用户Jason的nickName。如果我们使用 `setValue()` 而不是 `updateChildren()`，它将删除 `birthYear` `grade` `pv` 。

### push()
现在已经有了用户，需要增加一个发布blog的功能。你会想到使用`setValue`方法，这样是可以的。但是blog不像用户，用户可以使用唯一的用户名做key，blog的话要自己准备唯一key，不免有些麻烦。Wilddog提供一个`push()` 接口，这个接口将会为新建的数据创建一个唯一ID，这个唯一ID按照Wilddog的默认排序规则设计的，Wilddog默认的排序是按照字符串升序序列排序的，ID本身是按照时间戳转义的字符串。
我们可以将Blog以时间顺序添加到wildblog中，使用`push()`生成ID，并按照这个ID排序：

```Java
Wilddog blogsRef = ref.child("blogs");

Map<String, String> blog = new HashMap<String, String>();
blog.put("author", "Jason");
blog.put("title", "Wilddog学习笔记1");
blog.put("content", "hello world");

Wilddog newRef = blogsRef.push();
newRef.setValue(blog);
System.out.println("create new key is : " + newRef.getKey());
```

`push()` 成功后返回新的ID的Ref，可以使用`newRef.getKey()` 显示新的ID值。

### removeValue()

错误发布了一篇Blog，需要为用户提供一个删除的途径，那么在wildblog App中可以使用`removeValue()`。

```Java
Wilddog blogsRef = ref.child("blogs");

Map<String, String> blog = new HashMap<String, String>();
blog.put("author", "Jason");
blog.put("title", "Wilddog学习笔记2");
blog.put("content", "he he he");

Wilddog newRef = blogsRef.push();
newRef.setValue(blog);
newRef.removeValue();
```

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





