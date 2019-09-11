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
                y: 0
            }
            //debug: true
        }
    }
}

var game = new Phaser.Game(config);
let rotate = 0;

function preload ()
{
    this.load.image("car", "car.png");
    this.load.image("road", "road1.png");
}

function create ()
{
    road = this.matter.add.image(500, 150, 'road');
    car = this.matter.add.image(500, 150, 'car');
    cursors = this.input.keyboard.createCursorKeys();
    xText = this.add.text(16, 16, 'X: 0', { fontSize: '32px', fill: '#fff' });
    yText = this.add.text(16, 52, 'Y: 0', { fontSize: '32px', fill: '#fff' });
    car.setFriction(0.8);
    car.setFriction(0.8);
    
}

function update ()
{
    
    xText.setText("X: "+ Math.round(car.x));
    yText.setText("Y: "+ Math.round(car.y));

    
    if(cursors.down.isDown){
        car.thrustBack(0.0001);
    }
    if(cursors.up.isDown){
        car.thrust(0.0001);
    }
    if(cursors.left.isDown){
        rotate-=.02;
    }
    if(cursors.right.isDown){
        rotate+=.02;
    }

    car.rotation = rotate;
}