/*
Title : 快速入门
Sort : 1
*/


## 1.申请wilddog云，准备设备
你需要一个[**Wilddog账号**](https://www.wilddog.com/account/login)，一台电脑，一块支持Wiced的开发板，一根minUSB连接线（连接Wiced开发板和电脑）。

通过wilddog账号你可以远程管理你的设备。

###2、获取[Wilddog C SDK](https://cdn.wilddog.com/c/client/0.4.1/wilddog.0.4.1.tar.gz)

Wilddog C SDK体积小且不依赖于任何的平台，只要实现以下5个接口即可把Wilddog CoAP SDK移植到你的开发板上。

```c
	int wilddog_gethostbyname(Wilddog_Address_T* addr,char* host);
	int wilddog_openSocket(int* socketId);
	int wilddog_closeSocket(int socketId);
	int wilddog_send(int socketId,Wilddog_Address_T*,void* tosend,s32 tosendLength);
	int wilddog_receive(int socketId,Wilddog_Address_T*,void* toreceive,s32 toreceiveLength, s32 timeout);
```
## 3.往你的Wilddog云添加设备

用你的账号登陆[**野狗云**](https://www.wilddog.com/account/login)添加应用，你会得到一个属于你应用的Url(如`https://uid.wilddogio.com/`);

![](https://cdn.wilddog.com/z/iot/images/quickstart_3_1.png)

点击刚创建的应用中的“管理应用”，进入管理页面，在此页面可以设置和查看当前应用的数据，我们试试新增一个名字为`led`，值为`0`的节点;

![管理应用](https://cdn.wilddog.com/z/iot/images/quickstart_3_2.png)

![添加应用](https://cdn.wilddog.com/z/iot/images/quickstart_3_3.png)
	    
### 4.数据操作

通过SDK你可以实现设备和云端数据的实时同步，例如把SDK嵌入到室内温度传感器，云端即可获得实时的室温数据，这主要通过对数据的获取、设置、订阅来实现。SDK采用在相同密钥长度下最强大的非对称算法--椭圆曲线加密算法(ECC)交换秘钥，其后的数据交互使用AES-128加密。

#### 4.1 linux端
在Linux端对Wilddog云端的数据进行获取、设置和订阅。

1.  进入SDK，编译生成libwilddog.a文件：

		$ make

		$ ls lib/

		libwilddog.a


2.  编译example，生成wilddog、test\_remove、test\_query、test\_set、test\_push和test\_on可执行文件:

		$ make example

		$ ls bin/

		wilddog test_remove test_query test_set test_push test_on

3.  可以分别执行test\_set、test\_remove、test\_push、test\_query和test\_on程序，对Wilddog云端数据进行增删改查和订阅操作，例如：

		$ ./bin/test_query -l <刚建立的appid>

4.  如果想进一步了解wilddog api，你可以执行wilddog程序，它分成8个步骤来展现具体的操作：

   		(1). 在本地建立数据树，它与Wilddog云端的json格式的数据树是一一对应的。		

   		(2). 在建立的本地数据树上进行部分数据节点的修改。

   		(3). Delete操作：清除Wilddog云端的json格式的数据树。 	

   		(4). Set操作：将本地的数据树set到Wilddog云端，此时可以刷新Wilddog云端数据进行检查确认。

   		(5). Get操作：获取Wilddog云端的数据。

   		(6). Push操作：在本地新建一个数据节点，并将该数据节点push到Wilddog云端数据树的根节点下。

   		(7). Get操作:获取改动后的Wilddog云端的数据。

   		(8). Observe On/Off操作： 订阅Wilddog云端的数据，只要Wilddog云端的数据被改动(值可能不变)，将会立即获取包含最新值的数据树。在wilddog程序中在获取一次变动后的数据，取消订阅操作，整个wilddog程序结束。


参照wilddog程序，就可以按照具体的实际需求来对Wilddog云端的数据进行访问、修改和订阅。


<<<<<<< HEAD
####4.2 Wiced端
我们已经把SDK移植到Wiced平台上了，代码[点此下载](https://cdn.wilddog.com/c/client/0.4.1/wilddog.0.4.1.tar.gz), `sample/wiced`为其对应的sample。
=======
#### 4.2 Wiced端
我们已经把SDK移植到Wiced平台上了，代码[点此下载](https://cdn.wilddog.com/c/client/0.4.0/wilddog.0.4.0.tar.gz), `sample/wiced`为其对应的sample。

>>>>>>> develop

1\.	导入wiced：

直接把下载的文件夹COPY到`WICED/WICED-SDK-3.1.1/WICED-SDK/APPS/`下，如下：

![路径](https://cdn.wilddog.com/z/iot/images/quickstart_3_4.png)

2\.	配置wifi，假设你的目录名为`wilddog_client_coap`(注意，wiced平台下，目录名不能带`.`或`-` ), 打开`sample/wiced/wifi_config_dct.h`填写热点名称和密码：

		/* This is the default AP the device will connect to (as a client)*/
		#define CLIENT_AP_SSID       "your ssid"
		#define CLIENT_AP_PASSPHRASE "your ap password"

3\. 配置你的appid，打开`sample/wiced/demo.c`，将`application_start`中的`uid`改为你的appid;

4\.	建立Target

在Make Target 窗口新建编译目标`wilddog_client_coap.sample.wiced-yourboard download run`, 其中yourboard为你的板子型号，我们的wiced开发板型号是BCM943362WCD4，因而Target name 是 `wilddog_client_coap.sample.wiced-BCM943362WCD4 download run`, 如下图：

![make target](https://cdn.wilddog.com/z/iot/images/quickstart_3_5.png)


5\.	编译烧录运行

让你的wiced开发板连接电脑(wiced开发板的驱动在wice_sdk里面有提供)，然后直接双击Make Target窗口的`wilddog_client_coap.sample.yourboard download run`（我的环境下是`	wilddog_client_coap.sample.wiced-BCM943362WCD4 download run`）编译，如果语法和链接部分没有错误则自动烧录到你的wiced开发板并直接重启运行，默认运行`test_demo`示例.
	
6\.	如果你想试试其他命令，例如想尝试`test_query`, 请如下操作：

	1. 在`demo.c`的`application_start(void)`函数之前一行，插入`int test_query(char* uid);`
	2. 将`application_start()`中的`test_demo`改为`test_query`，保存；
	3. 打开`sample/wiced/wiced.mk`;
	4. 向`$(NAME)_SOURCES`变量中增加你想使用的函数所在的文件，如`$(NAME)_SOURCES += test_query.c`，保存并重新编译烧录，下次运行的即是`test_query`.

**至此**，可以实现云端和你的设备的数据同步，如果要进行更多的操作请阅读[**开发向导**](https://z.wilddog.com/device/guide)。





