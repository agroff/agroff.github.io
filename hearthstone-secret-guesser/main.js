(function($){

    var cardList = [];
    var triggers = {};
    var selectedOpponent = '';

    var buildTriggerList = function(){
        $.each(cardList, function(i, item){
            var trigger = item.trigger;

            if(trigger != ''){
                triggers[trigger] = {
                    activated : false,
                    available : true,
                    score : 0
                };
            }
        });
    };

    var renderTriggers = function(){
        var $container = $("#triggers-container");
        $container.html("");
        $.each(triggers, function(triggerName, triggerInfo){
            var cssClass = 'btn-default';
            if(triggerInfo.activated === true){
                cssClass = 'btn-success'
            }
            $container.append('<button type="button" class="btn '+cssClass+'">'+triggerName+' ('+triggerInfo.score+')</button>');
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
            newCardList;

        $available.html("");
        $.each(cardList, function(i, item){
            if(item.class !== selectedOpponent){
                return;
            }

            $available.append(getCardMarkup(item));
        });
    };

    var doBindings = function(){

        var classChanged = function(val){
            var $interface = $("#unavailable-cards, #available-cards, #trigger-interface");

            if(val === ''){
                $interface.hide();
            }
            else {
                $interface.show();
                selectedOpponent = val;
                renderCards();
            }
        };

        $("#class-select").change(function(){
            classChanged($(this).val())
        });
        classChanged('');
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
            renderTriggers();
            doBindings();
        });
    };

    $(function(){
        initialize();
    });
})(jQuery);