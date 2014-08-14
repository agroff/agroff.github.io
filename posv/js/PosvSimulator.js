/**
 * RDD.PosvSimulator
 */
(function (exports) {
    var pri = {
            $output : false,
            minuteGoal : (60 * 24 * 365),
//            minuteGoal : (60 * 24 * 24),
            minutesElapsed : -1,
            staking : {
                count : 0,
                totalAgeConsumed : 0,
                networkWeight : 0,
                initialRdd : 0,
                currentRdd : 0,
                currentAge  : -1,
                currentWeight : 0
            }
        },
        pub = {};

    pri.updateSidebar = function(){
        var d = pri.staking,
            rddGained = d.currentRdd - d.initialRdd,
            effectiveInterest = (rddGained / pri.staking.initialRdd) *100,
            daysElapsed = Math.floor(pri.minutesElapsed / 60 / 24),
            averageStakeAge = d.totalAgeConsumed / d.count;

        if(isNaN(effectiveInterest)){
            effectiveInterest = 0;
        }
        if(isNaN(averageStakeAge)){
            averageStakeAge = 0;
        }
        if(daysElapsed < 0){
            daysElapsed = 0;
        }

        $("#currentRdd").html(d.currentRdd);
        $("#timesStaked").html(d.count);
        $("#rddGained").html(rddGained);
        $("#effectiveInterest").html(effectiveInterest.toFixed(2));
        $("#averageStakeAge").html(averageStakeAge.toFixed(2));
        $("#daysElapsed").html(daysElapsed);
    }

    pri.outputState = function(){
        var html = '',
            d = pri.staking,
            dayAge = (d.currentAge / 60 / 24).toFixed(2);

        html += '<p>Age: '+ dayAge +' Days</p>';
        html += '<p>Weight: '+ d.currentWeight.toFixed(2)+' Weighted Days</p>';
        html += '<p>RDD: '+ d.currentRdd+'</p>';
        html += '<hr>';

        pri.updateSidebar();
        pri.$output.prepend(html);
    }

    pri.attemptToStake = function(){
        var d = pri.staking,
            calendarAge = 0,
            weightedAge = 0,
            interestForYear = 0,
            interestGained= 0,
            html = '',
            rand = exports.helpers.randomNumber(1, pri.staking.networkWeight);
        if(rand > pri.staking.currentWeight){
            //we didn't stake
            return false;
        }



        calendarAge = (d.currentAge / 60 / 24).toFixed(2);

        pri.staking.totalAgeConsumed += (calendarAge * 1);

        weightedAge = exports.helpers.posvHoursToWeightedDays(d.currentAge / 60).toFixed(2);
        interestForYear = d.currentRdd * 0.05;
        interestGained = interestForYear / (365 / weightedAge);
        interestGained = Math.floor(interestGained)

        html += ("STAKING!!! <br />");
        html += ("Calendar age at stake: " + calendarAge + " Days <br/>");
        html += ("Paying Interest on : " + weightedAge + " Days <br/>");
        html += ("Paid: " + interestGained + " RDD");
        html += ("<hr>");

        pri.$output.prepend(html);

        pri.staking.currentAge = 0;
        pri.staking.currentWeight = 0;
        pri.staking.currentRdd += interestGained;
        pri.staking.count++;

        return true;
    };

    pri.simulateMinute = function(){
        var d = pri.staking,
            h = exports.helpers;

        //increment all minutes
        pri.staking.currentAge++;
        pri.minutesElapsed++;

        //we've had enough minutes. Stop recursion.
        if(pri.minutesElapsed >= pri.minuteGoal){
            pri.updateSidebar();
            return true;
        }


        d.currentWeight = h.posvHoursToWeightedDays(d.currentAge / 60) * d.currentRdd;

        pri.attemptToStake();

        if(pri.staking.currentAge % 2880 === 0){
            pri.outputState();
            pri.updateSidebar();


            setTimeout(function(){
                pri.simulateMinute();
            }, 15);
            return true;
        }

        pri.simulateMinute();
    }

    pri.beginSimulation = function(networkWeight, totalRdd){
        pri.$output = $("#stakingOutput");

        pri.$output.html("");

        //reset all variables.
        pri.staking.networkWeight = networkWeight;
        pri.staking.initialRdd = totalRdd;
        pri.staking.currentRdd = totalRdd;
        pri.staking.currentAge = -1;
        pri.staking.currentWeight = 0;
        pri.staking.totalAgeConsumed = 0;
        pri.staking.count = 0;

        pri.minutesElapsed = -1;

        pri.updateSidebar();

        pri.simulateMinute();

    };

    pri.handleSimulationClicked = function(){
        var toNum = exports.helpers.toNumber,
            validate = exports.helpers.requireNumbers,
            $error = $("#simulatorMessage"),
            networkWeight = toNum($("#constantNetworkWeight").val()),
            totalRdd = toNum( $("#totalCoins").val() );

        $error.hide();
        if(!validate("#constantNetworkWeight", "#totalCoins")){
            $error.slideDown();
            return false;
        }

        pri.beginSimulation(networkWeight, totalRdd);
        return true;
    };

    pub.bind = function (){
        pri.updateSidebar()
        $("#simulateStaking").click(pri.handleSimulationClicked);
    };

    //publish this module.
    exports.PosvSimulator = pub;
})(exports);