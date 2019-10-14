class Road{
    constructor(game, object){
        object.map = game.add.tileSprite(300, 100, 800, 600, 'road');
        
        
        
        Phaser.Sprite.call(object, game, 15, 15);
        game.physics.p2.enable(object);
        object.body.static = true; 
        object.body.clearShapes(); // remove the standard hitbox
        object.body.loadPolygon('collisions', 'road');
    
    }
}