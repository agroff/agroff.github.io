
(function (exports) {
    var pri = {
            /********************************
             * You can update the main formula
             * settings here:
             ********************************/
            formulaSettings : {
                totalMints : 365,
                percentReturn : 5
            },
            initialRedd: 0,
            annualGain: 0
        },
        pub = {};

    pub.calculate = function (initialRedd) {
        // According to hoppi
        // Total = currentRDD * (1+(0.06/365)) ** 365
        var totalMints = pri.formulaSettings.totalMints,
            percent = (pri.formulaSettings.percentReturn / 100),
            total = initialRedd * Math.pow((1 + (percent / totalMints)), totalMints);

        pri.initialRedd = initialRedd;
        pri.annualGain = total - initialRedd;
    };

    pub.getAnnual = function () {
        return pri.annualGain.toLocaleString();
    };

    pub.getWeekly = function () {
        return (pri.annualGain / 52).toLocaleString();
    };

    pub.getDaily = function () {
        return (pri.annualGain / 365).toLocaleString();
    };

    exports.BasicCalculator = pub;
}(exports));