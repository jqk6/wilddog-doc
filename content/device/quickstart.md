/*
Title : 快速入门
Sort : 1
*/


###一、申请wilddog云，准备设备
你需要一个[**Wilddog账号**](https://www.wilddog.com/account/login)，一台电脑，一块支持Wiced的开发板，一根minUSB连接线（连接Wiced开发板和电脑）。

通过wilddog账号你可以远程管理你的硬件设备。

###二、下载 [**Wilddog CoAP SDK** ](https://github.com/WildDogTeam/wilddog_client_coap)

Wilddog CoAP SDK体积小不依赖于任何的平台，只要实现以下5个接口即可把Wilddog CoAP SDK移植到你的开发板上。

	int wilddog_gethostbyname(wilddog_address_t* addr,char* host);
	int wilddog_openSocket(int* socketId);
	int wilddog_closeSocket(int socketId);
	int wilddog_send(int socketId,wilddog_address_t*,void* tosend,size_t tosendLength);
	int wilddog_receive(int socketId,wilddog_address_t*,void* toreceive,size_t toreceiveLength);

###三、往你的Wilddog云添加设备
用你的账号登陆[**野狗云**](https://www.wilddog.com/account/login)添加应用，你会得到一个属于你应用的Url(如`https://uid.wilddogio.com/`);

![](https://raw.githubusercontent.com/skylli/mycoap/master/img/1.png)

点击“+”添加的设备，新建一个LED灯，同时你会获得访问你的led的url (如`https://uid.wilddogio.com/led)`，通过该url你可以访问和设置该led对应的值：

![管理应用](https://raw.githubusercontent.com/skylli/mycoap/master/img/2.png)

![添加应用](https://raw.githubusercontent.com/skylli/mycoap/master/img/3.png)
	    
###四、linux端
在linux端对你Wilddog云上应用的设备进行获取、设置、订阅。

1、进入**wilddog_coap_sdk**，编译生成`libwilddog.a`库：    
       
	  ~/git_code/wilddog_client_coap/sample/posix$ make 
	  ~/git_code/wilddog_client_coap/sample/posix$ ls build/
		libwilddog.a  ports  src
	
2、编译`sample`，生成`wilddog_linux_client`可执行文件，利用该文件可以对的led进行`get/set/observe`：    

	~/git_code/wilddog_client_coap/sample/posix$ make sample
	~/git_code/wilddog_client_coap/sample/posix$ ls
	 build  Makefile   wilddog_linux_client.c wilddog_linux_client

2.1、 获取你的Wilddog云应用设备的数据：

	$ ./wilddog_linux_client get https://uid.wilddogio.com/
	......
	}
	result:
	{
		"led":	"0"
	}

2.2、设置你的Wilddog云应用设备led的数据值为1(-dxx,xx为你要输入的数据)：

    $ ./wilddog_linux_client set https://uid.wilddogio.com/led -d1
	......
	data:1
	}
	result:
	1

2.3、 新添加一个新的设备到你Wilddog云应用上(关键值依赖与当前时间轴产生一个随机序列)：

	 ./wilddog_linux_client push https://uid.wilddogio.com/temperature -d25
	......
	result:
	{
		"-JoOg8eUS52r-amr":	25
	}

2.4、 删除你Wilddog云应用上的led：

	$ ./wilddog_linux_client delete https://uid.wilddogio.com/led
	......
	result:
	(null)

2.5、订阅你Wilddog云应用上的led资源，一旦你Wilddog云应用上的led数据遇到改动时(值可能不变)，你会收到一条包含led最新值的coap封装数据包：

	$ ./wilddog_linux_client observe https://uid.wilddogio.com/led
	......
	<DEBUG> onAck src/Wilddog.c(180):received ack code:205 
	new data: 1 


>现在你已经可以随意的访问和修改、订阅你wilddog云端的数据，很简单吧。但是怎么使你云端应用和你的硬件关联，使你wilddog云的led变为一个真实的led呢？

###5.Wiced端
我们已经把`wilddog_sdk`移植到Wiced平台上了，其实现代码在[**github**](https://github.com/WildDogTeam/wilddog_client_coap)上，可以点击下载,sample/wiced为其对应的sample。

5.1、导入wiced：

直接把git下载的文件夹COPY到`WICED/WICED-SDK-3.1.1/WICED-SDK/APPS/`下，如下：

![路径](https://raw.githubusercontent.com/skylli/mycoap/master/img/45.png)

5.2、配置wifi，打开`apps/wilddog_client_coap/sample/wiced/wifi_config_dct.h`填写热点名称和密码：

	/* This is the default AP the device will connect to (as a client)*/
	#define CLIENT_AP_SSID       "your ssid"
	#define CLIENT_AP_PASSPHRASE "your ap password"

5.3、在`application_start(void)`函数的while(1)里面添加你的应用代码：
比如发一个get的request到你的wilddog云应用上的led，并判断该值为0则灭灯，否则点灯。

	wilddog_t* client=wilddog_new("your_url");
	/* query a client*/
	wilddog_query(client,lightledcallbackfunc);
	while(1){
		/* Fill in your content*/

		wilddog_trySync(client);

	}

5.4、建立Target

在Make Target 窗口新建编译目标`wilddog_client_coap.sample.wiced-yourboard download run`其中yourboard为你的板子型号，我测试用的wiced开发板是BCM943362WCD4，因而Target name 是 wilddog_client_coap.sample.wiced-BCM943362WCD4 download run 如下图：

![make target](https://raw.githubusercontent.com/skylli/mycoap/master/img/proj.png)


5.5、编译烧录运行

让你的wiced开发板连接电脑(wiced开发板的驱动在wice_sdk里面有提供)，然后直接双击Make Target窗口的`wilddog_client_coap.sample.yourboard download run`（我的环境下是`	wilddog_client_coap.sample.wiced-BCM943362WCD4 download run`）编译sample，如果语法和链接部分没有错误则自动烧录到你的wiced开发板并直接重启运行，你可以修改你的wilddog云端数据来控制你的led灯了。
	
**至此**，你拥有了利用wilddog云分析管理你的传感器，灯泡，让它更加智能的能力。是的，就是这么简单，但这仅仅是开始，要想你的灵光一现变成现实你或许需要花10分钟查看后续的[**开发向导**](https://z.wilddog.com/device/guide)。





