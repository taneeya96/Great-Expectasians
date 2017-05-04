

const screenwidth=1280;
const screenheight=720;
// NEW GAME OBJECT
var game = new Phaser.Game(screenwidth, screenheight, Phaser.CANVAS, 'gameDiv');

game.state.add('boot', bootState);
game.state.add('load',loadState);
game.state.add('menu',menuState);
game.state.add('instructions',instructionsState);
game.state.add('play',playState);
game.state.add('win',winState);
game.state.add('lose',loseState);

game.state.start('boot');
