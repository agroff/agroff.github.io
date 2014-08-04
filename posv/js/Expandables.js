

(function (exports) {
    var pri = {},
        pub = {};

    pri.tipIcon = '<span class="entypo light-bulb"></span>';
    pri.tipText = '<h3>' + pri.tipIcon + '</h3>';
    pri.tipLink = '<a href="#">' + pri.tipIcon + '</a> ';

    pri.infoIcon = '<span class="entypo circled-info"></span>';
    pri.infoText = '<h3>' + pri.infoIcon + '</h3>';
    pri.infoLink = '<a href="#">' + pri.infoIcon + '</a> ';

    pri.expandableClicked = function(e){
        e.preventDefault();
        var $link = $(this),
            $div = $link.next();

        if($div.is(":visible")){
            $div.slideUp("slow");
        }
        else{
            $div.slideDown("slow");
        }

    };

    pri.createExpandable = function($div, link, text, defaultTitle){
        var title = $div.prop("title"),
            $showLink = $(link);

        if(!title) {
            title = defaultTitle;
        }

        $div.prepend(text);

        $showLink.append(' <span class="title"> ' + title + '</span>');
        $showLink.click(pri.expandableClicked);
        $div.before($showLink);
    };


    pri.createTip = function($div){
        pri.createExpandable($div, pri.tipLink, pri.tipText, "View Tip");
    };

    pri.createInfo = function($div){
        pri.createExpandable($div, pri.infoLink, pri.infoText, "More Info");
    };

    pub.initialize = function(){
        $(".tip").each(function(){
            pri.createTip($(this));
        });

        $(".info").each(function(){
            pri.createInfo($(this));
        });
    };

    exports.Expandables = pub;

}(exports));

























