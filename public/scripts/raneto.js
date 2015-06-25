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

