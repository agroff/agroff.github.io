

(function (exports) {
    var pri = {
            dayChangedCallback : function(value){},
            context : false,
            chartInstance : false,
            Chart : false
        },
        pub = {};

    pri.getData = function(dataset){
        return {
            labels: dataset.labels,
            datasets: [
                {
                    label: "PoS Weights",
                    fillColor: "rgba(151,187,205,0.2)",
                    strokeColor: "#97BBCD",
                    pointColor: "#97BBCD",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "#97BBCD",
                    data: dataset.posWeights
                },
                {
                    label: "PoSV Weights",
                    fillColor: "rgba(151,187,205,0.2)",
                    strokeColor: "#ff0000",
                    pointColor: "#ff0000",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "#ff0000",
                    data: dataset.weights
                }              
            ]
        };
    };

    pri.getOptions = function(){
        return {
            showScaleLabels: false,
            scaleOverride:false,
            scaleSteps : 20,
            scaleStepWidth : 2,
            scaleStartValue : 0
        };
    };

    pub.setDayCallback = function(callback){
        pri.dayChangedCallback = callback;
    };

    pub.render = function(dataset){
        var data = pri.getData(dataset),
            options = pri.getOptions();

        if(pri.chartInstance !== false){
            $(".line-legend").remove();
            pri.chartInstance.destroy();
        }

        pri.chartInstance = pri.Chart.Line(data, options);
        $("#weightChart").before(pri.chartInstance.generateLegend());
    };

    pub.initialize = function(){
        var ctx = $("#weightChart").get(0).getContext("2d");
        pri.context = ctx;
        pri.Chart = new Chart(ctx);

        $("#weightGraphAge").change(function(){
            var value = $(this).val();
            pri.dayChangedCallback(value);
        });
    };

exports.WeightChartView = pub;

}(exports));