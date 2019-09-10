var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game',
    backgroundColor: 0x0ecf8f,
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    physics:{
        default: "matter",
        matter: {
            gravity: {
                y: 0
            }
            //debug: true
        }
    }


}

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image("car", "car.png");
}

function create ()
{
    car = this.matter.add.image(100, 450, 'car');
    cursors = this.input.keyboard.createCursorKeys();
}

function update ()
{
    if(cursors.down.JustDown){
        car.setVelocityY(10);
    }
    else if(){
        
    }
}