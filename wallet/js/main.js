var ReddWallet = (function(){
    var pub = {},
        pri = {};

    pri.getOs = function(){
        var operatingSystem=false;
        if (navigator.appVersion.indexOf("Win")!=-1)   operatingSystem="Windows";
        if (navigator.appVersion.indexOf("Mac")!=-1)   operatingSystem="MacOS";
        if (navigator.appVersion.indexOf("Linux")!=-1) operatingSystem="Linux";
        //if (navigator.appVersion.indexOf("X11")!=-1) operatingSystem="UNIX";

        return operatingSystem.toLowerCase();
    };

    pub.main = function(){
        //alert(pri.getOs());
    };

    return pub;
}())




$(function(){
    ReddWallet.main();
});