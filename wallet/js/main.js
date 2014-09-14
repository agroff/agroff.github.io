var ReddWallet = (function(){
    var pub = {},
        pri = {};

    pri.scrollToElement = function($element){
        $('html, body').animate({
            scrollTop: $element.offset().top - 75
        }, 500);
    }

    pri.smoothIdLinks = function(){
        $("body").on("click", "a", function(e){
            var selector = $(this).attr("href"),
                $element = $(selector);

            if($element.length > 0){
                e.preventDefault();
                pri.scrollToElement($element);
            }
        });
    };

    pri.getOs = function(){
        var operatingSystem=false;
        if (navigator.appVersion.indexOf("Win")!=-1)   operatingSystem="Windows";
        if (navigator.appVersion.indexOf("Mac")!=-1)   operatingSystem="MacOS";
        if (navigator.appVersion.indexOf("Linux")!=-1) operatingSystem="Linux";
        //if (navigator.appVersion.indexOf("X11")!=-1) operatingSystem="UNIX";

        return operatingSystem.toLowerCase();
    };

    pub.main = function(){
        var os = pri.getOs(),
            $element = $(window.location.hash);

        $(".singleOs."+os).show();

        pri.smoothIdLinks();

        if($element.length > 0){
            pri.scrollToElement($element);
        }
    };

    return pub;
}())




$(function(){
    ReddWallet.main();
});