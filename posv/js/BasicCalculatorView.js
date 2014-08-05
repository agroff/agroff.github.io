
(function (exports) {
    var pri = {
            $results: false,
            $calculateButton: false,
            $initialRdd: false,
            $errorMessage: false,
            resultRowTemplate: '',
            validNumberCallback: function () {}
        },
        pub = {};

    pri.loadDomObjects = function () {
        pri.$results = $("#results");
        pri.$calculateButton = $("#calculateButton");
        pri.$initialRdd = $("#initialRdd");
        pri.$errorMessage = $("#errorMessage");
        pri.resultRowTemplate = $("#resultRowTemplate").html();
    };

    pri.calculateClicked = function () {
        var value = pri.$initialRdd.val(),
            initialRedd = parseFloat(value.replace(/,/g, '')),
            compoundTimes = $("#compoundTimes").val();

        pri.$errorMessage.hide();
        pub.clear();

        if (isNaN(initialRedd)) {
            pri.$errorMessage.show("slow");
            return;
        }
        pri.validNumberCallback(initialRedd, compoundTimes);
    };

    pub.setValidNumberCallback = function (callback) {
        pri.validNumberCallback = callback;
    };

    pub.clear = function () {
        pri.$results.empty();
    };

    pub.renderResultRow = function (label, amount) {
        var template = pri.resultRowTemplate,
            html = template.replace('${label}', label).replace('${amount}', amount);
        pri.$results.append(html);
    };

    pub.bind = function () {
        pri.loadDomObjects();
        pri.$calculateButton.click(pri.calculateClicked);
    };

    exports.BasicCalculatorView = pub;
}(exports));
