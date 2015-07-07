 var title1 = "第一步, 安装WildDog实时API";
 var title2 = "第二步, 新建一个实时云端数据库的访问链接";
 var title3 = "第三步, 我们来写入一条数据到云端";
 var title4 = "第四步, 我们来写入一个对象到云端";
 var title5 = "第五步, 我们来写入一个数据列表到云端";
 var title6 = "第六步, 我们来从云端读取数据";
 var title7 = "第七步, 我们来监听云端数据的变化";

 var info2 = "<p style='font-size:20px;font-color:black'>在访问数据之前，需要在你的代码里创建一个Wilddog本地实例。</p><p>我们已经创建好了一个WildDog的云端数据库。它的网址是： https:/ / demochat.wilddogio.com / </p><p>为了完成这一步, 请在App中创建一个Wilddog实例： </p>";
 var info3 = "<p style='font-size:20px;font-color:black'>让我们发一个聊天消息吧。</p><p>你能够使用刚刚创建的reference通过set()方法写数据到野狗App。为了简单起见，我们通过text文本框来写消息， 通过回车键触发发送消息。为了完成这一步，使用set()方法来写消息， 代码如下：</p>";
 var info4 = "<p style='font-size:20px;font-color:black'>set()方法也能用于写数据object。</p><p>请修改你的代码，写一个带有text and name属性的数据object：</p>";
 var info5 = "<p style='font-size:20px;font-color:black'>野狗支持数据列表。</p><p>你已经学会在野狗App指定路径里写数据。假如你的聊天App需要list消息。 野狗提供一个帮助方法push()。修改你的代码，使用push()代替set() ,这样聊天App支持list消息：</p>";
 var info6 = "<p style='font-size:20px;font-color:black'>现在开始接收聊天消息。</p><p>当消息达到的时，野狗会主动通知我们。我们使用on()在消息上添加回调方法。代码如下：</p>";
 var info7 = "<p style='font-size:20px;font-color:black'>你只需要把聊天信息放到页面上。</p><p>对于每条聊天消息，野狗在回调函数中提供一个snapshot快照方法。获取消息数据时只需要调用snapshot的val()方法，并赋值给一个变量。然后，调用displayChatMessage()把消息显示出来：</p>";

 //需要填入的代码
 var codeline1 = '<script src=\"https://cdn.wilddog.com/js/client/current/wilddog.js\"></scr' + 'ipt>';
 var codeline2 = "var myDataRef = new Wilddog('https://demochat.wilddogio.com/')";
 var codeline3 = "myDataRef.set('User ' + name + ' says ' + text);";
 var codeline4 = "myDataRef.set({name: name, text: text});";
 var codeline5 = "myDataRef.push({name: name, text: text});";
 var codeline6 = "myDataRef.on(\"child_added\", function(snapshot) {//我们稍后填上这部分代码. })";
 //['myDataRef.on("child_added", function(snapshot) {', '//We"ll fill this in later.', '});'].join('\r\n');
 var codeline7 = "var message = snapshot.val();displayChatMessage(message.name, message.text);";

 var codelinestyle2 = "<span class=\"kwd\">var</span><span class=\"pln\"> myDataRef </span><span class=\"pun\">=</span><span class=\"pln\"> </span><span class=\"kwd\">new</span><span class=\"pln\"> </span><span class=\"typ\">Wilddog</span><span class=\"pun\">(</span><span class=\"str\">'https://demochat.wilddogio.com/'</span><span class=\"pun\">);</span>";

 var codelinestyle3 = "<span class=\"pln\">myDataRef</span><span class=\"pun\">.</span><span class=\"kwd\">set</span><span class=\"pun\">(</span><span class=\"str\">'User '</span><span class=\"pln\"> </span><span class=\"pun\">+</span><span class=\"pln\"> name </span><span class=\"pun\">+</span><span class=\"pln\"> </span><span class=\"str\">' says '</span><span class=\"pln\"> </span><span class=\"pun\">+</span><span class=\"pln\"> text</span><span class=\"pun\">);</span>";

 var codelinestyle4 = "<span class=\"pln\">myDataRef</span><span class=\"pun\">.</span><span class=\"kwd\">set</span><span class=\"pun\">({</span><span class=\"pln\">name</span><span class=\"pun\">:</span><span class=\pln\"> name</span><span class=\"pun\">,</span><span class=\"pln\"> text</span><span class=\"pun\">:</span><span class=\"pln\"> text</span><span class=\"pun\">});</span>";

 var codelinestyle5 = "<span class=\"pln\">myDataRef</span><span class=\"pun\">.</span><span class=\"pln\">push</span><span class=\"pun\">({</span><span class=\"pln\">name</span><span class=\"pun\">:</span><span class=\"pln\"> name</span><span class=\"pun\">,</span><span class=\"pln\"> text</span><span class=\"pun\">:</span><span class=\"pln\"> text</span><span class=\"pun\">});</span>";

 var codelinestyle6 = "<span class=\"pln\">myDataRef</span><span class=\"pun\">.</span><span class=\"pln\">on</span><span class=\"pun\">(</span><span class=\"str\">'child_added'</span><span class=\"pun\">,</span><span class=\"pln\"> </span><span class=\"kwd\">function</span><span class=\"pun\">(</span><span class=\"pln\">snapshot</span><span class=\"pun\">)</span><span class=\"pln\"> </span><span class=\"pun\">{</span><span class=\"pln\"></span><span class=\"com\">//我们稍后填上这部分代码. </span><span class=\"pun\">});</span>";

 var codelinestyle7 = "<span class=\"kwd\">var</span><span class=\"pln\"> message </span><span class=\"pun\">=</span><span class=\"pln\"> snapshot</span><span class=\"pun\">.</span><span class=\"pln\">val</span><span class=\"pun\">();</span><span class=\"pln\">displayChatMessage</span><span class=\"pun\">(</span><span class=\"pln\">message</span><span class=\"pun\">.</span><span class=\"pln\">name</span><span class=\"pun\">,</span><span class=\"pln\"> message</span><span class=\"pun\">.</span><span class=\"pln\">text</span><span class=\"pun\">);</span>";



 //编辑框代码
 var html1 = [' <html>', '<head>', "[ 请将野狗示例代码粘贴在这 ]", '</head>', '<body>', '</body>', '</html>'].join('\r\n');
 var html2 = [' <html>', '<head>', '   <script src=\"https://cdn.wilddog.com/js/client/current/wilddog.js\"><\/script>',
     '   </head>', '  <body>', '  <script>', '[ 请将野狗示例代码粘贴在这 ]', ' <\/script>', ' <\/body>', '</html > '
 ].join('\r\n');

 var html3 = [
     '<html>',
     '<head>',
     '  <script src="https://cdn.wilddog.com/js/client/current/wilddog.js"></scr' + 'ipt>',
     '  <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></scr' + 'ipt>',
     '</head>',
     '<body>',
     '  <input type="text" id="nameInput" placeholder="Name">',
     '  <input type="text" id="messageInput" placeholder="Message">',
     '  <script>',
     '    var myDataRef = new Wilddog("https://demochat.wilddogio.com/");',
     '    $("#messageInput").keypress(function (e) {',
     '      if (e.keyCode == 13) {',
     '        var name = $("#nameInput").val();',
     '        var text = $("#messageInput").val();',
     '        [ 请将野狗示例代码粘贴在这 ]',
     '        $("#messageInput").val("");',
     '      }',
     '    });',
     '  </scr' + 'ipt>',
     '</body>',
     '</html>'
 ].join('\r\n');

 var html4 = [
     '<html>',
     '<head>',
     '  <script src="https://cdn.wilddog.com/js/client/current/wilddog.js"></scr' + 'ipt>',
     '  <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></scr' + 'ipt>',
     '</head>',
     '<body>',
     '  <input type="text" id="nameInput" placeholder="Name">',
     '  <input type="text" id="messageInput" placeholder="Message">',
     '  <script>',
     '    var myDataRef = new Wilddog("https://demochat.wilddogio.com/");',
     '    $("#messageInput").keypress(function (e) {',
     '      if (e.keyCode == 13) {',
     '        var name = $("#nameInput").val();',
     '        var text = $("#messageInput").val();',
     '        [ 请将野狗示例代码粘贴在这 myDataRef.set("User " + name + " says " + text);]',
     '        $("#messageInput").val("");',
     '      }',
     '    });',
     '  </scr' + 'ipt>',
     '</body>',
     '</html>'
 ].join('\r\n');


 var html5 = [
     '<html>',
     '<head>',
     '  <script src="https://cdn.wilddog.com/js/client/current/wilddog.js"></scr' + 'ipt>',
     '  <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></scr' + 'ipt>',
     '</head>',
     '<body>',
     '  <input type="text" id="nameInput" placeholder="Name">',
     '  <input type="text" id="messageInput" placeholder="Message">',
     '  <script>',
     '    var myDataRef = new Wilddog("https://demochat.wilddogio.com/");',
     '    $("#messageInput").keypress(function (e) {',
     '      if (e.keyCode == 13) {',
     '        var name = $("#nameInput").val();',
     '        var text = $("#messageInput").val();',
     '        [ myDataRef.set({name: name, text: text}); //请将野狗示例代码粘贴在这。]',
     '        $("#messageInput").val("");',
     '      }',
     '    });',
     '  </scr' + 'ipt>',
     '</body>',
     '</html>'
 ].join('\r\n');

 var html6 = [
     '<html>',
     '<head>',
     '  <script src="https://cdn.wilddog.com/js/client/current/wilddog.js"></scr' + 'ipt>',
     '  <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></scr' + 'ipt>',
     '</head>',
     '<body>',
     '  <input type="text" id="nameInput" placeholder="Name">',
     '  <input type="text" id="messageInput" placeholder="Message">',
     '  <script>',
     '    var myDataRef = new Wilddog("https://demochat.wilddogio.com/");',
     '    $("#messageInput").keypress(function (e) {',
     '      if (e.keyCode == 13) {',
     '        var name = $("#nameInput").val();',
     '        var text = $("#messageInput").val();',
     '        myDataRef.push({name: name, text: text});',
     '        $("#messageInput").val("");',
     '      }',
     '    });',
     '    [ 请将野狗示例代码粘贴在这 ] .',
     '  </scr' + 'ipt>',
     '</body>',
     '</html>'
 ].join('\r\n');


 var html7 = [
     '<html>',
     '<head>',
     '  <script src="https://cdn.wilddog.com/js/client/current/wilddog.js"></scr' + 'ipt>',
     '  <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></scr' + 'ipt>',
     '</head>',
     '<body>',
     '  <div id="messagesDiv"></div>',
     '  <input type="text" id="nameInput" placeholder="Name">',
     '  <input type="text" id="messageInput" placeholder="Message">',
     '  <script>',
     '    var myDataRef = new Wilddog("https://demochat.wilddogio.com/");',
     '    $("#messageInput").keypress(function (e) {',
     '      if (e.keyCode == 13) {',
     '        var name = $("#nameInput").val();',
     '        var text = $("#messageInput").val();',
     '        myDataRef.push({name: name, text: text});',
     '        $("#messageInput").val("");',
     '      }',
     '    });',
     '    myDataRef.on("child_added", function(snapshot) {',
     '      [ 请将回调函数放在这 ]',
     '    });',
     '    function displayChatMessage(name, text) {',
     '      $("<div/>").text(text).prepend($("<em/>").text(name+": ")).appendTo($("#messagesDiv"));',
     '      $("#messagesDiv")[0].scrollTop = $("#messagesDiv")[0].scrollHeight;',
     '    };',
     '  </scr' + 'ipt>',
     '</body>',
     '</html>'
 ].join('\r\n');



 // 成功文章
 var success1 = "<p style='font-size:20px;font-color:black'>你已经成功安装野狗!</p><p>你现在能够访问一个实时可靠的后端服务。这么容易?</p>";
 var success2 = "<p style='font-size:20px;font-color:black'>加油!</p><p>myDataRef 已经能够访问野狗App数据，通过URL https://demochat.wilddogio.com/</p> <p>野狗的核心理念是 每一条数据都有自己的URL。</p>";
 var success3 = "<p style='font-size:20px;font-color:black'>非常棒!</p><p>通过Wilddog实例调用 set()方法， 写数据变得很简单。</p><p>野狗支持number, boolean, and string数据类型， 类似JavaScript 对象。</p>";
 var success4 = "<p style='font-size:20px;font-color:black'>干得不错!</p><p>野狗能处理非常复杂的数据object，必须是JSON object。</p><p>数据对象被写到野狗实时云，数据object将被映射到野狗的URL的路径里。</p><p>在此例子中， {name: name}被映射到 myDataRef的子路径https://demochat.wilddogio.com/name。</p>";
 var success5 = "<p style='font-size:20px;font-color:black'>你已经支持list!</p><p>野狗lists对象的key，是时间排序、全球唯一（UUID）的。</p><p>客户端同时添加list， 也不会冲突。</p>";
 var success6 = "<p style='font-size:20px;font-color:black'>现在我们能使用野狗实时云读写数据了。</p><p>注意，当启动App的时候，callback方法将被野狗调用；</p><p>同样，当新数据到达时， callback方法也会被野狗调用。对新数据和老数据处理是没有区别的。 </p><p>优势在于我们只需要关心数据自身的逻辑，而不用关心传输逻辑。</p><p>Tip: 增量消息'child_added' 事件。</p>";
 var success7 = "恭喜!你已经完成5分钟快速入门。</p><p>下一步，去看看知识库中别的内容吧！";



 var wd = wd || {};

 wd.tutorial = wd.tutorial || {};

 var step = 1;
 var stepfinish = false;
 wd.tutorial.init = function() {

     var editor = ace.edit("editor");
     editor.setTheme("ace/theme/eclipse");
     editor.getSession().setMode("ace/mode/html");
     editor.getSession().setUseWorker(false);
     editor.setFontSize('16px');
     editor.setOptions({
         maxLines: Infinity
     });
     editor.find('function', {
         backwards: false,
         wrap: false,
         caseSensitive: false,
         wholeWord: false,
         regExp: false
     });
     wd.tutorial.editor = editor;

     $("#advanceButton").click(function(e) {
         if (step > 7) {
             window.location.href = "https://z.wilddog.com";
         }
         $("#errorText").css("visibility", "hidden");
         if (wd.tutorial._doContinue_isok() && !stepfinish) {
             $("#editor").hide();
             console.log("write ok");
             $("#step-info").html(eval("success" + step));
             $(".prettyprint").hide();
             step++;
             stepfinish = true;
         } else if (stepfinish) {
             wd.tutorial.setCodeLines(eval("codeline" + step));
             $(".prettyprint").html(eval("codelinestyle" + step)).show();;
             wd.tutorial.setEditorValue(eval("html" + step));
             $("#step-info").html(eval("info" + step));
             wd.tutorial.editor.gotoLine(1);
             $("#headertext").text(eval("title" + step));
             $(".steps .item").eq((step - 1)).addClass("scale-current").siblings().removeClass("scale-current");
             $("#editor").show();
             stepfinish = false;
         } else {
             console.log("write wrong");
             $("#errorText").css("visibility", "visible");
         }
     });

     $(".steps").find('.item').click(function() {
         step = $(this).index();
         if (step == 1) {
             window.location.href = "/5m";
         }
         wd.tutorial.setCodeLines(eval("codeline" + step));
         $(".prettyprint").html(eval("codelinestyle" + step)).show();
         wd.tutorial.setEditorValue(eval("html" + step));
         $("#step-info").html(eval("info" + step));
         wd.tutorial.editor.gotoLine(1);
         $("#headertext").text(eval("title" + step));
         $(this).addClass("scale-current").siblings().removeClass("scale-current");
         $("#editor").show();
     })

     $("#editor").fadeIn("fast");
 }

 wd.tutorial.setEditorValue = function(value) {
     wd.tutorial.editor.setValue(value);
 }

 wd.tutorial.setCodeLines = function(codelines) {
     wd.tutorial.codelines = codelines;
 }

 wd.tutorial.doContinue = function(e) {
     if (wd.tutorial._doContinue_isok()) {
         wd.tutorial._doContinue_showsuccess();
         return;
     }
     wd.tutorial._doContinue_showerror();
     return;
 }

 wd.tutorial._doContinue_isok = function() {
     var htmlValue = wd.tutorial.editor.getValue();
     if (!htmlValue || !wd.tutorial.codelines) {
         return false;
     }

     var hv = htmlValue.replace(/\s{2,}/g, ' ').replace(/'/g, '"');
     var cls = wd.tutorial.codelines.replace(/\s{2,}/g, ' ').replace(/'/g, '"');
     console.log("hv : " + hv);
     console.log("cls :" + cls);
     if (hv.indexOf(cls) < 0) {
         return false;
     }
     return true;
 }

 wd.tutorial._doContinue_showerror = function() {
     // $("#fadeOutArea-1 #errorText").show();
     $("#errorText").css('visibility', 'visible')

     $("#fadeOutArea-2").hide();
 }

 wd.tutorial._doContinue_showsuccess = function() {
     $("#errorText").css('visibility', 'hidden');
     alert(1);
     $("#fadeOutArea-1").hide();

     $("#fadeOutArea-2").show();
     $("#advanceDiv").removeClass("hide");
     wd.tutorial.editor.setReadOnly(true);
 }

 wd.tutorial.doNext = function() {
     var step = parseInt($("li.active").text().trim());
     if (step < 0 || step > 7) {
         return;
     }
     if (step == 7) {
         window.location.href = "/account/signup";
         return;
     }
     var paths = window.location.href.split("/");
     paths[paths.length - 1] = ++step;
     var nextPath = paths.join("/");

     // jump
     window.location.href = nextPath;
 }