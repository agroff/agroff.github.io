(function($){

    var cardList = [];
    var triggers = {};
    var triggered = {};
    var selectedOpponent = '';

    var buildTriggerList = function(){
//        $.each(cardList, function(i, item){
//            var trigger = item.trigger;
//
//            if(trigger != ''){
//                triggers[trigger] = {
//                    activated : false,
//                    available : true,
//                    score : 0
//                };
//            }
//        });
    };

    var renderTriggers = function(){
        var $container = $("#triggers-container"),
            $usedContainer = $("#triggered-container"),
            keysSorted = Object.keys(triggers).sort(function(a,b){
                return triggers[b]-triggers[a]
            });
        $container.html("");
        $usedContainer.html("");
        $.each(keysSorted, function(i, triggerName) {
            var cssClass = 'btn-primary',
                triggerValue = triggers[triggerName],
                button = '<button type="button" data-trigger="'
                    +triggerName
                    +'" class="btn '
                    +cssClass
                    +'">'
                    +triggerName+' ('+triggerValue
                    +')</button>';

            if(triggered.hasOwnProperty(triggerName)){
                $usedContainer.append(button);
            }
            else {
                $container.append(button);
            }

        });
    };

    var getCardMarkup = function(item){
        var html = '<div class="card">';
        html += '<img class="card-image" src="'+item.image+'" alt="'+item.name+'">';
        html += '<div class="card-info">';
        html += '<h4>Usage:</h4> <p>'+item.usage+'% of decks</p>';
        html += '<h4>Trigger:</h4> <p>'+item.trigger+'</p>';
        html  += '</div>';
        html  += '</div>';

        return html;
    };

    var renderCards = function(){
        var $available = $("#available-cards"),
            isStandard = $("#mode-select").val() === 'standard',
            newCardList;

        $available.html("");
        triggers = {};
        $.each(cardList, function(i, item){
            var trigger = item.trigger;
            if(item.class !== selectedOpponent){
                return;
            }
            if(isStandard && item.wild === true){
                return;
            }

            if(!triggers.hasOwnProperty(trigger)){
                triggers[trigger] = 0;
            }
            triggers[trigger] += Math.floor(item.usage);

            if(!triggered.hasOwnProperty(trigger)){
                $available.append(getCardMarkup(item));
            }

        });

        console.log(triggers);

        renderTriggers();
    };

    var reset = function(){
        triggered = {};
        renderCards();
    };

    var doBindings = function(){

        var classChanged = function(val){
            var $interface = $("#unavailable-cards, #available-cards, #trigger-interface, #mode-select");

            if(val === ''){
                $interface.hide();
                reset();
            }
            else {
                $interface.show();
                selectedOpponent = val;
                reset();
            }

        };

        $("#class-select").change(function(){
            classChanged($(this).val())
        });
        classChanged('');

        $("#triggers-container").on('click', 'button', function(){
            triggered[$(this).attr('data-trigger')] = 1;
            renderCards();
        });
        $("#triggered-container").on('click', 'button', function(){
            delete triggered[$(this).attr('data-trigger')];
            renderCards();
        });

        $("#mode-select").change(function(){
            renderCards();
        });
        $("#resetButton").click(function(){
            reset();
        });
    };

    var initialize = function(){
        $.getJSON('/hearthstone-secret-guesser/secrets.json', function(data){
            cardList = data;

            cardList.sort(function(a,b){
                if(a.usage < b.usage){
                    return 1;
                }
                if(a.usage > b.usage){
                    return -1;
                }
                return 0;
            });

            buildTriggerList();
            renderCards();
            doBindings();
        });
    };

    $(function(){
        initialize();
    });
})(jQuery);