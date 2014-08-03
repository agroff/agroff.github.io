
RDD.controllers = {};

RDD.controllers.basicCalculator = function(){

    RDD.BasicCalculatorView.bind();

    RDD.BasicCalculatorView.setValidNumberCallback(function (initialRedd) {
        var annual, weekly, daily;

        RDD.BasicCalculator.calculate(initialRedd);

        annual = RDD.BasicCalculator.getAnnual();
        weekly = RDD.BasicCalculator.getWeekly();
        daily = RDD.BasicCalculator.getDaily();

        RDD.BasicCalculatorView.renderResultRow("Annual", annual);
        RDD.BasicCalculatorView.renderResultRow("Weekly", weekly);
        RDD.BasicCalculatorView.renderResultRow("Daily", daily);
    });
};

RDD.controllers.weightChart = function(){


    RDD.WeightChartView.initialize();

    RDD.WeightChartView.setDayCallback(function(days){
        var dataset = RDD.CoinWeight.getDataSet(1, days, 20);
        RDD.WeightChartView.render(dataset);
    });

    $("#weightGraphAge").val("90").trigger("change");

};



$(function () {

    RDD.controllers.basicCalculator();
    RDD.controllers.weightChart();

});
