/*
Title : 快速入门
Sort : 1
Tmpl : page-quickstart
*/


## 第一步 创建账户和应用
首先注册并登陆Wilddog账号，进入[<font style="color:#c7254e">控制面板</font>](https://www.wilddog.com/dashboard)。在控制面板中，添加一个新的应用。你会获得一个独一无二的应用URL `https://<appId>.wilddogio.com/`，在同步和存取数据的时候，我们将使用这个URL。

----

## 第二步 下载Wilddog C/嵌入式SDK

我们的SDK已经在Linux平台和Wiced平台上成功移植，在此仅以Linux为例，Wiced平台请查看[<font style="color:#c7254e">开发向导</font>](https://z.wilddog.com/device/guide)中的移植SDK。


> 你可以在这里下载 [<font style="color:#c7254e">Wilddog C/嵌入式 SDK</font>](https://cdn.wilddog.com/c/client/0.4.2/wilddog.0.4.2.tar.gz)



----

## 第三步 编译SDK



解压SDK
	
	$ tar zxvf wilddog.0.4.2.tar.gz
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


####4.2 Wiced端
我们已经把SDK移植到Wiced平台上了，代码[点此下载](https://cdn.wilddog.com/c/client/0.4.1/wilddog.0.4.1.tar.gz), `sample/wiced`为其对应的sample。

1\.	导入wiced：

直接把下载的文件夹COPY到`WICED/WICED-SDK-3.1.1/WICED-SDK/APPS/`下，如下：

![路径](https://cdn.wilddog.com/z/iot/images/quickstart_3_4.png)

2\.	配置wifi，假设你的目录名为`wilddog_client_coap`(注意，wiced平台下，目录名不能带`.`或`-` ), 打开`sample/wiced/wifi_config_dct.h`填写热点名称和密码：

		/* This is the default AP the device will connect to (as a client)*/
		#define CLIENT_AP_SSID       "your ssid"
		#define CLIENT_AP_PASSPHRASE "your ap password"

----

## 第四步 运行示例
向应用URL存储一个key-value结构的数据

	$ ./bin/test set -l <应用URL> --key a --value 1 

获取应用URL的数据

	$ ./bin/test query -l <应用URL>
		
执行结果：
		
	"/":{"a":"1"}




