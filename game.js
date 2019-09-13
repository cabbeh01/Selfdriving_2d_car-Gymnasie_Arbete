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

let nCar ={
    x:500,
    y:700,
    velocityX:0,
    velocityY:0,
    drag:.1,
    angularVelocity:0.00005,
    angularDrag: 0.9,
    power:1.5,
    turnspeed:.005,

}
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

    carUpdate();
    if(cursors.down.isDown){
        nCar.velocityX -= Math.cos(car.rotation) * nCar.power;
        nCar.velocityY -= Math.sin(car.rotation) * nCar.power;
    }
    if(cursors.up.isDown){
        nCar.velocityX += Math.cos(car.rotation) * nCar.power;
        nCar.velocityY += Math.sin(car.rotation) * nCar.power;
    }
    if(cursors.left.isDown){
        nCar.angularVelocity -= nCar.turnspeed;
    }
    if(cursors.right.isDown){
        nCar.angularVelocity += nCar.turnspeed;
    }
    
}


function carUpdate(){
    car.x += nCar.velocityX;
    car.y += nCar.velocityY;
    nCar.velocityX *= nCar.drag;
    nCar.velocityY *= nCar.drag;
    car.rotation += nCar.angularVelocity;
    nCar.angularVelocity *= nCar.angularDrag;
}