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

const COLORLINE = 0x00ffff;
var tracker1;
var tracker2;

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

    sensor1 = this.add.rectangle(0, 0, 40, 4, 0x00ff00);
    sensor2 = this.add.rectangle(0, 0, 40, 4, 0xff0000);
    
    cursors = this.input.keyboard.createCursorKeys();

    xText = this.add.text(16, 16, 'X: 0', { fontSize: '32px', fill: '#fff' });
    yText = this.add.text(16, 52, 'Y: 0', { fontSize: '32px', fill: '#fff' });
    rText = this.add.text(16, 88, '0°', { fontSize: '32px', fill: '#fff' });
    fpsText = this.add.text(1130, 16, 'FPS: ', { fontSize: '32px', fill: '#fff' });
    fps2Text = this.add.text(1130, 52, 'FPS: ', { fontSize: '32px', fill: '#fff' });





    //
    //Trackers in scene
    //Vertical lines
    tracker1 = this.add.rectangle(0, 0, 4, 80, COLORLINE);
    tracker2 = this.add.rectangle(0, 0, 4, 80, COLORLINE);
    tracker3 = this.add.rectangle(0, 0, 4, 80, COLORLINE);
    tracker4 = this.add.rectangle(0, 0, 4, 80, COLORLINE);
    tracker5 = this.add.rectangle(0, 0, 4, 80, COLORLINE);
    tracker9 = this.add.rectangle(0, 0, 4, 80, COLORLINE);
    tracker10 = this.add.rectangle(0, 0, 4, 80, COLORLINE);

    //Horizontell lines
    tracker6 = this.add.rectangle(0, 0, 80, 4, COLORLINE);
    tracker7 = this.add.rectangle(0, 0, 80, 4, COLORLINE);
    tracker8 = this.add.rectangle(0, 0, 80, 4, COLORLINE);
    tracker11 = this.add.rectangle(0, 0, 80, 4, COLORLINE);
    tracker12 = this.add.rectangle(0, 0, 80, 4, COLORLINE);
    
    
    tracker13 = this.add.rectangle(0, 0, 4, 80, COLORLINE);
    tracker14 = this.add.rectangle(0, 0, 4, 80, COLORLINE);
    tracker15 = this.add.rectangle(0, 0, 4, 80, COLORLINE);
    tracker16 = this.add.rectangle(0, 0, 4, 80, COLORLINE);
    tracker17 = this.add.rectangle(0, 0, 4, 80, COLORLINE);
    tracker18 = this.add.rectangle(0, 0, 4, 80, COLORLINE);


    tracker19 = this.add.rectangle(0, 0, 4, 80, COLORLINE);



    tracker20 = this.add.rectangle(0, 0, 40, 4, COLORLINE);
    tracker21 = this.add.rectangle(0, 0, 40, 4, COLORLINE);
    tracker22 = this.add.rectangle(0, 0, 40, 4, COLORLINE);
    tracker23 = this.add.rectangle(0, 0, 40, 4, COLORLINE);
    tracker24 = this.add.rectangle(0, 0, 40, 4, COLORLINE);
    tracker25 = this.add.rectangle(0, 0, 40, 4, COLORLINE);
    tracker26 = this.add.rectangle(0, 0, 40, 4, COLORLINE);
    tracker27 = this.add.rectangle(0, 0, 40, 4, COLORLINE);
    tracker28 = this.add.rectangle(0, 0, 40, 4, COLORLINE);
    tracker29 = this.add.rectangle(0, 0, 40, 4, COLORLINE);
    tracker30 = this.add.rectangle(0, 0, 40, 4, COLORLINE);


    tracker1.setPosition(560, 154);
    tracker2.setPosition(650, 154);
    tracker3.setPosition(740, 154);
    tracker4.setPosition(830, 154);
    tracker5.setPosition(930, 154);
    tracker6.setPosition(982, 206);
    tracker7.setPosition(982, 296);
    tracker8.setPosition(982, 386);
    tracker9.setPosition(930, 460);
    tracker10.setPosition(850, 460);
    tracker11.setPosition(794, 510);
    tracker12.setPosition(794, 602);
    tracker13.setPosition(740,659);
    tracker14.setPosition(650,660);
    tracker15.setPosition(560,660);
    tracker16.setPosition(470,660);
    tracker17.setPosition(380,660);


    //





    //Collision detection between car and road
    this.matter.world.on('collisionstart', function (event, bodyA, bodyB) {
        console.log(bodyA.parent.label);
        console.log(bodyB.parent.label);
        if(bodyA.parent.label === "road" || bodyB.parent.label === "road"){
            nCar.ResetCar(nCar.car.x,nCar.car.y,nCar.car.rotation);
        }
    });

    
}

function update (timestamp, elapsed)
{
    //Counts to correct frame then runs physicsRend
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

    var point1 = nCar.car.getTopCenter();
    var point2 = nCar.car.getBottomCenter();

    sensor1.setPosition(point1.x, point1.y);
    sensor2.setPosition(point2.x, point2.y);
}


