var game;

var screenwidth=1280;
var screenheight=720;

var app = {
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    onDeviceReady: function() {
        // NEW GAME OBJECT
        game = new Phaser.Game(screenwidth, screenheight, Phaser.CANVAS, 'gameDiv');

        //states
        game.state.add('boot', bootState);
        game.state.add('load', loadState);
        game.state.add('menu', menuState);
        game.state.add('instructions', instructionsState);
        game.state.add('play', playState);
        game.state.add('win', winState);
        game.state.add('lose', loseState);

        game.state.start('boot');

    },
};

app.initialize();
