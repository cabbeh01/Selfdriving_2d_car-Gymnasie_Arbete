var config = {
    type: Phaser.AUTO,
    width: 1400,
    height: 800,
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
                y: 1
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
    car = this.matter.add.image(100, 150, 'car');
    cursors = this.input.keyboard.createCursorKeys();
}

function update ()
{
    if(cursors.down.isDown){
        car.setVelocityY(10);
    }
    else if(cursors.up.isDown){
        car.setVelocityY(-10);
    }
    else if(cursors.left.isDown){
        car.setVelocityX(-10);
    }
    else if(cursors.right.isDown){
        car.setVelocityX(10);
    }
    else if(cursors.space.isDown){
        car.setVelocityY(0);
        car.setVelocityX(0);
    }
}