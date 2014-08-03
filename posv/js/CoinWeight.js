

(function (exports) {
    var pri = {},
        pub = {};

    pri.calculateWeight = function(hoursOld){
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

        return Math.round(Math.min((weight * 24 * 60 * 60), stakeMaxAge));
    };

    pri.getLabel = function(hoursOld){
        var days = hoursOld  / 24,
            weeks = days / 7,
            months = days / 30,
            result = hoursOld,
            type = "Hours";

        if(days > 1){
            type = "Days";
            result = days;
        }

        if(weeks > 1){
            type = "Weeks";
            result = weeks;
        }

        if(months > 1){
            type = "Months";
            result = months;
        }

        return result.toFixed(1) + " " + type;
    };


    pub.getDataSet = function(coinAmount, totalDays, dataPoints){
        var hours = totalDays * 24,
            dataPoints = dataPoints || 10,
            modulus = Math.round(hours / dataPoints),
            labels = [],
            weights = [],
            currentAge, weight, label, result;

        if(hours < dataPoints){
            modulus = 1;
        }

        for(currentAge = 1; currentAge <= hours; currentAge++){

            if(currentAge % modulus !== 0){
                continue;
            }

            weight = pri.calculateWeight(currentAge) * coinAmount;
            label = pri.getLabel(currentAge);

            weights.push(weight);
            labels.push(label);
        }

        result =  {
            weights: weights,
            labels : labels
        };

        console.log(result)
        return result;
    };

    exports.CoinWeight = pub;

}(exports));

























