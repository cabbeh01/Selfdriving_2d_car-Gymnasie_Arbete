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
        default: "arcade",
        /*matter: {
            gravity: {
                y: 0
            }
            //debug: true
        }*/
    }
}

var game = new Phaser.Game(config);
let rotate = 0;

let nCar = new Car(500,300);
function preload ()
{

    //Load graphics
    this.load.image("car", "./Graphics/car.png");
    this.load.image("road", "./Graphics/road.png");

}

function create ()
{
    road = this.physics.add.sprite(600, 400, 'road');
    //car = this.matter.add.image(nCar.x, nCar.y, 'car');
    car = this.physics.add.sprite(nCar.x, nCar.y, 'car');

    cursors = this.input.keyboard.createCursorKeys();

    xText = this.add.text(16, 16, 'X: 0', { fontSize: '32px', fill: '#fff' });
    yText = this.add.text(16, 52, 'Y: 0', { fontSize: '32px', fill: '#fff' });
    
}

function update ()
{
    xText.setText("X: "+ Math.round(car.x));
    yText.setText("Y: "+ Math.round(car.y));

    nCar.Update();
    if(cursors.down.isDown){
        nCar.MoveBackwards(car.rotation);
    }
    if(cursors.up.isDown){
        nCar.MoveForward(car.rotation);
    }
    if(cursors.left.isDown){
        nCar.Steer(-1);
    }
    if(cursors.right.isDown){
        nCar.Steer(1);
    }
    
}


