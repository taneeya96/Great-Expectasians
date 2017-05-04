var menuState = {
  create : function() {

    var playRect = this.add.graphics(0, 0);
    // draw a rectangle
    playRect.lineStyle(2, 0x0000FF, 0.5);
    playRect.beginFill(0xFF8080, 1);
    playRect.drawRect(this.world.centerX+320, this.world.centerY + 20, 160, 160);
    playRect.endFill();
    playRect.inputEnabled = true;
    playRect.events.onInputDown.add(this.displayStartInstructions,this);
    playRect.alpha =0;

    var menu = game.add.sprite(0,0,'Menu');
    menu.alpha = 1;

    var menuButton = game.add.sprite(500,50,'MenuButton');
    menuButton.alpha = 1;
    menuButton.scale.setTo(0.1,0.1);
    menuButton.inputEnabled  = true;
    menuButton.events.onInputDown.add(this.displayStartInstructions,this);

  },
  displayStartInstructions: function()
  {
    game.state.start('instructions');
  }

}
