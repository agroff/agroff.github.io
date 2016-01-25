var APP = {

    playAudio : function(){
        var myAudio = new Audio('/canvas-demo/audio/first.mp3');
        myAudio.addEventListener('ended', function() {
            this.currentTime = 0;
            this.play();
        }, false);
        myAudio.play();
    },

    init: function(){
        this.playAudio();
    }
};