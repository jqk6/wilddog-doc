(function($, hljs){

    $(document).ready(function(){

        if($('.content').length){

            // Syntax highlighting
            hljs.initHighlightingOnLoad();

            // Add Bootstrap styling to tables
            $('.content table').addClass('table');

            // FitVids
            $('.content').fitVids();

        }

        if($('.home-categories').length){
            $('.home-categories').masonry({
                columnWidth: '.col',
                itemSelector: '.col',
                transitionDuration: 0
            });
        }
    });

})(jQuery, hljs);

function loadOver(){
    var init = function(){
        $(".api-content .toc,.quickstart-content .toc").slideDown(300);
        var headingLi = $(".toc>ul>li");

        if(!headingLi.find("ul").length){
            headingLi.css({"padding-bottom":0});
        }

        var headingLiLength = headingLi.length;

        for(var i=0; i<headingLiLength; i++){

            var smallLiArr=headingLi.eq(i);

            var smallLiArray = smallLiArr.find('li');

            if (smallLiArr.parent("ul").outerHeight()<230) {

                smallLiArr.parent("ul").siblings('.wd-font').hide();
            };

                // for(var j = 0; j<Math.ceil(smallLiArray.length/2); j++){

                //      smallLiArray.eq(j).css({"float":"left"});

                //      smallLiArray.eq(smallLiArray.length-j-1).css({"float":"right"});

                //  }
        };
    }
    setTimeout(init,500);

    var flag = true;
    var animateHeight;
    $(".toc .wd-font").click(function(event) {
    animateHeight = $(".toc").children('ul').outerHeight()+45;
        if (flag) {
            $(this).html("R").parent(".toc").animate({"height":animateHeight});
            flag = false;
        }
        else{
            $(this).html("4").parent(".toc").animate({"height":230});
            flag = true;
        }
    });

    var backTop = $(".back-top");
    var windHeight = $(window).height();
    var scrollT;
    $(window).scroll(function(event) {
        scrollT = $(window).scrollTop();
         if (scrollT>windHeight) {
            backTop.fadeIn(300);
         }
         else{
            backTop.fadeOut(300);
         }
    });
    backTop.click(function(event) {
        $(window).scrollTop(0);
    });
};


