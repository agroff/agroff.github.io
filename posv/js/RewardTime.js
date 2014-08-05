(function (exports) {
    var pri = {},
        pub = {};

    pri.toFloat= function(inputId){
        var value = $("#" + inputId).val()
            value = parseFloat(value.replace(/,/g, ''));

        if(isNaN(value)){
            return false;
        }

        return value;
    };

    pri.renderResults = function(){
        var totalWeight = pri.toFloat("totalWeight"),
            networkWeight = pri.toFloat("networkWeight"),
            $error = $("#timeErrorMessage"),
            minutes, hours, days;

        $error.hide();
        if(totalWeight === false || networkWeight === false){
            $error.slideDown();
            return;
        }

        minutes = (networkWeight / totalWeight).toFixed(2);
        hours = (minutes / 60).toFixed(2);
        days = (hours / 24).toFixed(2);

        $("#rewardMinutes").text(minutes);
        $("#rewardHours").text(hours);
        $("#rewardDays").text(days);

    };

    pub.bind = function(){
        var $button = $("#calculateRewardTime");

        $button.click(pri.renderResults);

        $button.trigger("click");
    };

    exports.RewardTime = pub;

}(exports));
