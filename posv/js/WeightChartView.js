

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
                    label: "My Second dataset",
                    fillColor: "rgba(151,187,205,0.2)",
                    strokeColor: "rgba(151,187,205,1)",
                    pointColor: "rgba(151,187,205,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(151,187,205,1)",
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
            pri.chartInstance.destroy();
        }

        pri.chartInstance = pri.Chart.Line(data, options);
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