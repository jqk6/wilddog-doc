/*
Title: 快速入门
Sort: 1
Tmpl : page-quickstart
*/

Wilddog提供非常简单的用户帐号系统。它能轻松集成到你的现有logic server,   或者只通过客户端集成。提供的功能包括， 通过邮箱&密码方式登录、通过第三方平台帐号登录，例如新浪微博帐号。



# 概述
大多数应用程序需要明确用户身份。为每一个用户定制不通的服务，并赋以不同的数据权限。验证用户的过程叫做身份认证。 Wilddog 提供一套完整的用户解决方案。

使用wilddog  用户认证， 以下两点需要注意：
* 在同一个provider， 用户uid必须是唯一的。
* auth变量在Wilddog Rules里有定义，如果auth变量为空，代表是一个未认证的用户。 对于一个认证用户， auth变量必须包含（auth.uid)，Rules规则与auth.uid配合使用，这种机制保证每个用户安全访问数据。
 
当用户登录到app， Wilddog管理这些session， 确保用户在浏览器或应用程序重新启动被记住。
Wilddog支持邮箱&密码登录、社交帐号登录。App使用Wilddog用户认证， 只需要添加App client代码， 不用写服务端代码。

如果你存在服务端用户认证，你也能轻松集成到Wilddog。

----


# 设置Authentication Provider
下面是wilddog支持的provider列表


Platform	| 描述
-------- | ---
Custom	| 自己生成token的方式。使用这种方式，你能够集成到现有的用户认证系统。也能够在服务端使用。
Email & Password| 让Wilddog管理为你管理用户的密码。使用email&password, 通过注册和认证用户。
Anonymous	| 使用匿名认证的用户，无需分享自己的信息，系统会为每个用户生成唯一的标识，session会保持到回话结束。
Weibo	     | 使用weibo账户认证，只需要添加客户端代码。



# 启动Providers

 [1] :进入【控制面板】
 [2] :选择自己Wilddog App。
 [3]  :点击【终端用户认证】。
 [4] :点击一个认证方式。
 [5]:  选择以各种认证方式，并启用。
 [6]: 如果你使用第三方帐号登录，比如，微博，请b把博API Key和API Secret到表单里。
  

# 用户登录

这些接口接收的参数不同，但它们都有类似的签名和接受相同的回调函数。
```


// Create a callback to handle the result of the authentication

function authHandler(error, authData) {

  if (error) {

    console.log("Login Failed!", error);

  } else {

    console.log("Authenticated successfully with payload:", authData);

  }

}

// Authenticate users with a custom Wilddog token

ref.authWithCustomToken("<token>", authHandler);

// Or with an email/password combination

ref.authWithPassword({

  email    : 'Loki@asgard.com',

  password : 'dwadwadc'

}, authHandler);

// Or via popular OAuth providers ("weibo")

ref.authWithOAuthPopup("<provider>", authHandler);

ref.authWithOAuthRedirect("<provider>", authHandler);

```
----

# 用户登出

unauth()方法的作用是让用户的token无效




```
ref.unauth();

```


# 携带自定义数据

Wilddog 生成JSON Web Tokens(JWTs)通过调用Wilddog.authWithCustomToken()可以携带他们自己的token。每个用户分配一个UID（唯一的ID），保证在同一个provider是唯一的， 无需为特别用户做任何修改。

它不存储你的用户配置文件或用户状态信息。需要存储用户数据，你必须将token保存到你的Wilddog里。回调函数将返回一个包含验证用户的对象。

下面的代码示例中，我们对用户进行身份验证，然后存储用户数据路径中的 `https://<appId>.wilddog.com/users/<uid>`。

下面的代码用于保存用户的认证信息，使用用户的uid作为存储的key。

``` js

// we would probably save a profile when we register new users on our site

// we could also read the profile to see if it's null

// here we will just simulate this with an isNewUser boolean

var isNewUser = true;

var ref = new Wilddog("https://<appId>.wilddogio.com");

ref.onAuth(function(authData) {

  if (authData && isNewUser) {

    // save the user's profile into Wilddog we can list users,

    // use them in Security and Wilddog Rules, and show profiles

    ref.child("users").child(authData.uid).set({

      provider: authData.provider,

      name: getName(authData)

    });

  }

});

// find a suitable name based on the meta info given by each provider

function getName(authData) {

  switch(authData.provider) {

     case 'password':

       return authData.password.email.replace(/@.*/, '');

  }

}

```

当一个用户使用上面的示例代码被保存到Wilddog中， /users/  节点的值如下：
```
{
  "users": {
    "simplelogin:213": {
      "provider": "password",
      "name": "bobtony"
    }
  }
}
 

```


# Dealing with Popups and Redirects

Wilddog的OAuth认证支持三种不同的方式，弹出pop-up、浏览器重定向、凭据登录。

大多数现代浏览器阻止非用户直接操作的弹出窗口。因此，我们应该只调用第三方认证对用户的authwithoauthpopup()方法。

注释：popups 和redirects 不是在所有浏览器都支持。
Popups 在 Chrome for iOS, iOS Preview Panes, or local, file:// URLs 不支持。
Redirects在PhoneGap / Cordova, or local, file:// URLs不支持。
建议您使用两者相结合的认证方法覆盖所有的环境。

```js

var ref = new Wilddog("https://<appId>.wilddogio.com");

// prefer pop-ups, so we don't navigate away from the page

ref.authWithOAuthPopup("weibo", function(error, authData) {

  if (error) {

    if (error.code === "TRANSPORT_UNAVAILABLE") {

      // fall-back to browser redirects, and pick up the session

      // automatically when we come back to the origin page

      ref.authWithOAuthRedirect("weibo", function(error) { /* ... */ });

    }

  } else if (authData) {

    // user authenticated with wilddog

  }

});


```
--------

# Handling Errors

当你的app调用的认证方法时，传入一个回调函数。这个函数的调用结果， 正确返回authData 对象，错误返回错误码。

所有错误消息，至少包含一个code 和消息属性。

```js
{
  code: 1001,
  msg: "参数错误",
  data: {}
}
```
电子邮件和密码认证的代码例子：


```

var ref = new Wilddog("https://<appId>.wilddogio.com");

ref.authWithPassword({

  email    : 'Loki@asgard.com',

  password : 'dwadwa'

}, function(error, authData) {

  if (error) {

    switch (error.code) {

        console.log("Error logging user in:", error);

    }

  } else {

    console.log("Authenticated successfully with payload:", authData);

  }

});

```

--------




# Full Error Listing


Error Code| Description
-------- | ---
1004| Json格式错误
.

