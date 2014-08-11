

(function (exports) {
    var pri = {},
        pub = {};

    pri.calculateWeight = function(hoursOld){
        return exports.helpers.posvHoursToWeightedDays(hoursOld);
    };
    
    pri.calculatePOSWeight = function(hoursOld){
        var stakeMinAgeHours = 8,
            days = ( (hoursOld - stakeMinAgeHours) / 24),
            weight = days;

        //weight = (weight * 24 * 60 * 60);
        //weight = weight.toFixed(2);

        return Math.max(0, weight);
    };  

    pri.calculatePOSVWeightTheta = function(hoursOld){
        var stakeMinAgeHours = 8,
            days = ( (hoursOld - stakeMinAgeHours) / 24),
            theta = 0,
            stakeMaxAge = 200000000;

        //this is the formula for the derivative of POSV with respect to the number of staking days
        if (days <= 7)
        {
        	theta = -0.00408163 * 3 * Math.pow(days, 2) + 0.05714286 * 2 * days + 1;
        }
        else
        {
        	theta = 8.4 / days;
        }

        if(days < 0 || days > stakeMaxAge) {
        	theta = 0;
        }	
        
        //actually we are more interested in the simple ratio POSV/POS so we don't use the derivative
        return pri.calculateWeight(hoursOld)/pri.calculatePOSWeight(hoursOld);
    };
    
    pri.calculatePOSWeightTheta = function(hoursOld){
        var stakeMinAgeHours = 8,
            days = ( (hoursOld - stakeMinAgeHours) / 24), theta = 0;
        if(days > 0) {
        	theta = 1.0;
        }
        return theta;
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

//        if(weeks > 1){
//            type = "Weeks";
//            result = weeks;
//        }
//
//        if(months > 1){
//            type = "Months";
//            result = months;
//        }

        return result.toFixed(1) + " " + type;
    };


    pub.getDataSet = function(coinAmount, totalDays, dataPoints){
        var hours = totalDays * 24,
            dataPoints = dataPoints || 10,
            modulus = Math.round(hours / dataPoints),
            labels = [],
            weights = [],
            posvThetas = [],
            posWeights = [],
            posThetas = [],
            currentAge, weight, posWeight, posvTheta, posTheta, label, result;

        if(hours < dataPoints){
            modulus = 1;
        }

        for(currentAge = 1; currentAge <= hours; currentAge++){

            if(currentAge % modulus !== 0){
                continue;
            }

            weight = pri.calculateWeight(currentAge) * coinAmount;
            posWeight = pri.calculatePOSWeight(currentAge) * coinAmount;
            posvTheta = pri.calculatePOSVWeightTheta(currentAge) * coinAmount;
            posTheta = pri.calculatePOSWeightTheta(currentAge) * coinAmount;
            label = pri.getLabel(currentAge);

            weights.push(weight.toFixed(2));
            posWeights.push(posWeight.toFixed(2));
            posvThetas.push(posvTheta);
            posThetas.push(posTheta);
            labels.push(label);
        }

        result =  {
            weights: weights,
            posWeights: posWeights,
            posvThetas: posvThetas,
            posThetas: posThetas,
            labels : labels
        };

        console.log(result);
        return result;
    };

    exports.CoinWeight = pub;

}(exports));

























