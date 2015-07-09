(function(){
		/****************************点击菜单按钮动画**************************************/
	    var animMenu = $(".menu-show-btnArea");
	    var flag = true;
	    animMenu.on({
	    	touchend : function(){
	    		if(flag){
	    			$(this).children('.menu-btn').addClass('menu-show-btn').children('.menu-show-line-m').fadeOut(300);
	    			$(".menu .active").parents(".menu,.category").fadeIn();
	    			flag = false;
	    		}
	    		else{
	    			$(this).children('.menu-btn').removeClass('menu-show-btn').children('.menu-show-line-m').fadeIn(300);
	    			$(".menu .active").parents(".menu,.category").fadeOut();
	    			flag = true;
	    		}

	    	}
	    });
	    /*菜单显示当前分类目录*/
	    var act = $(".active");
	    function actShow(){
		    $(".category-title").click(function(event) {
		        $(this).siblings('.pages').toggle();
	    	});
	    };
	    /*判断手机与PC*/
	    if($(window).width()<768){
	    	$('.category>.pages').append("<li class='page'><a href='\/'>返回知识库<\/a><\/li><li class='page'><a href='https:\/\/www.wilddog.com'>返回官网<\/a><\/li>");
		    $(".category-title2").click(function(event) {
		        $(this).siblings('.pages2').toggle();
	    	});
		    act.parents(".pages").show();
	    }
})();
