var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game',
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    physics:{
        default: "matter",
        matter: {
            // debug: true
        }
    }


}

var game = new Phaser.Game(config);

function preload ()
{
    
}

function create ()
{

}

function update ()
{

}