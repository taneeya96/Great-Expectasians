var bootState = {
  create : function() {
    game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.p2.gravity.y = 500; //larger y gravity the narrower the parabol.
    game.physics.p2.restitution = 0.2; //bounciness of the world
    game.physics.p2.setImpactEvents(true);
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.state.start('load');
  }
}
