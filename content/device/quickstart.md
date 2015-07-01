/*
Title : 快速入门
Sort : 1
Tmpl : page-quickstart
*/


## 第一步 创建账号和应用
首先注册并登陆Wilddog账号，进入[控制面板](https://www.wilddog.com/dashboard)。在控制面板中，添加一个新的应用。你会获得一个独一无二的应用URL `https://<appId>.wilddogio.com/`，在同步和存取数据的时候，我们将使用这个URL。


----

## 第二步 使用Wilddog C/嵌入式SDK

### 获得 SDK
你可以在这里下载 [Wilddog C/嵌入式 SDK](https://cdn.wilddog.com/c/client/0.4.2/wilddog.0.4.2.tar.gz)（我们的SDK已经在Linux平台和Wiced平台上成功移植，在此仅以Linux为例，Wiced平台请查看 [开发向导](https://z.wilddog.com/device/guide)中的移植SDK。）


----

## 第三步 编译SDK



解压SDK
	
	$ tar zxvf wilddog.0.4.2.tar.gz


编译SDK，编译后的库文件在lib目录下

	$ cd wilddog.0.4.2
	$ make 

编译示例，编译后的可执行文件在bin目录下

	$ make example

----

## 第四步 运行示例
向应用URL存储一个key-value结构的数据

	$ ./bin/test set -l <应用URL> --key a --value 1 

获取应用URL的数据

	$ ./bin/test query -l <应用URL>
		
执行结果：
		
	"/":{"a":"1"}

## 第五步 了解更多

1. [开发向导](guide)
2. [C API文档](api)

