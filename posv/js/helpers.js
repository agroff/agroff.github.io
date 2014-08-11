/**
 * RDD.helpers
 */
(function (exports) {
    var pri = {},
        pub = {};

    pub.posvHoursToWeightedDays = function(hoursOld){
        var stakeMinAgeHours = 8,
            days = ( (hoursOld - stakeMinAgeHours) / 24),
            weight = 0,
            stakeMaxAge = 200000000;

        if (days <= 7)
        {
            weight = -0.00408163 * Math.pow(days, 3) + 0.05714286 * Math.pow(days, 2) + days;
        }
        else
        {
            weight = 8.4 * Math.log(days) - 7.94564525;
        }

        weight = Math.min(weight, stakeMaxAge);

        return Math.max(0, weight);
    };

    pub.randomNumber = function (min,max)
    {
        return Math.floor(Math.random()*(max-min+1)+min);
    }

    pub.requireNumbers = function( /* Pass in any number of jquery selectors */ ){
        var isValid = true;

        $.each(arguments, function(i, selector){
            var val = $(selector).val();

            if(pub.toNumber(val) === false){
                isValid = false;
            }
        });

        return isValid;
    };

    pub.toNumber = function(number){
        var float = parseFloat(number.replace(/,/g, ''));

        if(isNaN(float)){
            return false;
        }

        return float;
    };
    //publish this module.
    exports.helpers = pub;
})(exports);