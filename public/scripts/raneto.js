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
(function(){
    var headingLi = $(".toc>ul>li");
    var headingLiLength = headingLi.length;
    for(var i=0; i<headingLiLength; i++){

        var smallLiArr=headingLi.eq(i);

        var smallLiArray = smallLiArr.find('li');
        if (smallLiArr.outerHeight()>220) {
            smallLiArr.parent("ul").siblings('.wd-font').show();
        };

            for(var j = 0; j<Math.ceil(smallLiArray.length/2); j++){

                 smallLiArray.eq(j).css({"float":"left"});

                 smallLiArray.eq(smallLiArray.length-j-1).css({"float":"right"});

             }

    };





    var flag = true;
    var animateHeight;
    $(".wd-font").click(function(event) {
    animateHeight = $(".toc").children('ul').outerHeight()+45;
        if (flag) {
            $(this).html("R").parent(".toc").animate({"height":animateHeight});
            flag = false;
        }
        else{
            $(this).html("4").parent(".toc").animate({"height":220});
            flag = true;
        }
    });

})();


