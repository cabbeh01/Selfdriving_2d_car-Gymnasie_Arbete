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
        default: 'matter',
        matter: {
            gravity: {
                y: 0
            }
            //debug: true
        }
    }
}

var fps ={
    lag:0,
    fps: 60,
    frameduration: (1000/ 60)
}

let game = new Phaser.Game(config);
let rotate = 0;
let nCar = new Car(500,153);



function preload ()
{
    //Load graphics
    this.load.image("car", "./Graphics/car.png");
    this.load.image("road", "./Graphics/road.png");

    //Load collision shape
    this.load.json('shapes', './Graphics/shapes.json');

}

function create ()
{

    var shapes = this.cache.json.get('shapes');

    road = this.matter.add.sprite(800, 400, 'road',"road",{shape: shapes.road});
    //car = this.matter.add.image(nCar.x, nCar.y, 'car');

    
    
    nCar.car = this.matter.add.sprite(nCar.x, nCar.y, 'car',"car",{shape: shapes.car});
    //car = this.matter.add.sprite(nCar.x, nCar.y, 'car',"car",{shape: shapes.car});


    cursors = this.input.keyboard.createCursorKeys();

    xText = this.add.text(16, 16, 'X: 0', { fontSize: '32px', fill: '#fff' });
    yText = this.add.text(16, 52, 'Y: 0', { fontSize: '32px', fill: '#fff' });
    rText = this.add.text(16, 88, '0°', { fontSize: '32px', fill: '#fff' });
    fpsText = this.add.text(1130, 16, 'FPS: ', { fontSize: '32px', fill: '#fff' });
    fps2Text = this.add.text(1130, 52, 'FPS: ', { fontSize: '32px', fill: '#fff' });


    //Collision detection between car and road
    this.matter.world.on('collisionstart', function (event, bodyA, bodyB) {
        console.log(bodyA.parent.label);
        if(bodyA.parent.label === "road" || bodyB.parent.label === "road"){
            nCar.ResetCar(nCar.car.x,nCar.car.y,nCar.car.rotation);
        }
    });
}

function update (timestamp, elapsed)
{
    fps.lag += elapsed;
    while(fps.lag >= fps.frameduration){
        physicsRend(fps.frameduration);
        fps.lag -= fps.frameduration;
    }
    renderGrapichs();
}


function physicsRend(currentframe) {
    //phys checks and server IO events update state of entities here
    nCar.Update();
    if(cursors.down.isDown){
        nCar.MoveBackwards(nCar.car.rotation);
    }
    if(cursors.up.isDown){
        nCar.MoveForward(nCar.car.rotation);
    }
    if(cursors.left.isDown && cursors.up.isDown){
        nCar.Steer(-1);
    }
    if(cursors.right.isDown && cursors.up.isDown){
        nCar.Steer(1);
    }

    
}
function renderGrapichs(){
    //rendering stuff here
    xText.setText("X: "+ Math.round(nCar.car.x));
    yText.setText("Y: "+ Math.round(nCar.car.y));
    rText.setText(Math.round(nCar.car.rotation*(180/Math.PI)) +"°");
    fpsText.setText("FPS Rend: " + Math.round(game.loop.actualFps));
    fps2Text.setText("FPS Phys: " + Math.round(fps.fps));

    
}

