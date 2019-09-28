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
const opt ={
    isSensor: true,
    label: "tracker"
}

var tracker1;
var tracker2;

function preload ()
{
    this.load.image("ground", "./Graphics/background2.png");
    //Load graphics
    this.load.image("car", "./Graphics/car.png");
    this.load.image("road", "./Graphics/road.png");

    //Load collision shape
    this.load.json('shapes', './Graphics/shapes.json');

}

function create ()
{

    var shapes = this.cache.json.get('shapes');
    this.add.image(700, 400, 'ground');
    road = this.matter.add.sprite(800, 400, 'road',"road",{shape: shapes.road});
    //car = this.matter.add.image(nCar.x, nCar.y, 'car');

    
    

    nCar.car = this.matter.add.sprite(nCar.x, nCar.y, 'car',"car",{shape: shapes.car});
    //car = this.matter.add.sprite(nCar.x, nCar.y, 'car',"car",{shape: shapes.car});

    sensor1 = this.add.rectangle(0, 0, 40, 4, 0x00ff00);
    sensor2 = this.add.rectangle(0, 0, 40, 4, 0x00ff00);
    
    cursors = this.input.keyboard.createCursorKeys();

    xText = this.add.text(16, 16, 'X: 0', { fontSize: '32px', fill: '#fff' });
    yText = this.add.text(16, 52, 'Y: 0', { fontSize: '32px', fill: '#fff' });
    rText = this.add.text(16, 88, '0°', { fontSize: '32px', fill: '#fff' });
    travelText = this.add.text(16, 88, 'Travel: ', { fontSize: '32px', fill: '#fff' });

    fpsText = this.add.text(1130, 16, 'FPS: ', { fontSize: '32px', fill: '#fff' });
    fps2Text = this.add.text(1130, 52, 'FPS: ', { fontSize: '32px', fill: '#fff' });



    //Trackers in scene
    tracker = [];
    trackerMatter = [];
    for(let i = 0; i<30;i++){
        if(i<5 || 7<i && i<10 || 11<i && i<17 || 17<i && i<21 || 23<i && i<27 || 27<i && i<30){
            tracker[i] = this.add.rectangle(0, 0, 4, 80, COLORLINE);
        }
        else if(4<i && i<8 || 9<i && i<12 || i == 17 || i == 27 || 20<i && i<24){
            tracker[i] = this.add.rectangle(0, 0, 80, 4, COLORLINE); //
        }
    }

    //Set position of visible tracker
    tracker[0].setPosition(560, 154);
    tracker[1].setPosition(650, 154);
    tracker[2].setPosition(740, 154);
    tracker[3].setPosition(830, 154);
    tracker[4].setPosition(930, 154);
    tracker[5].setPosition(982, 206);
    tracker[6].setPosition(982, 296);
    tracker[7].setPosition(982, 386);
    tracker[8].setPosition(930, 460);
    tracker[9].setPosition(850, 460);
    tracker[10].setPosition(794, 510);
    tracker[11].setPosition(794, 602);
    tracker[12].setPosition(740,659);
    tracker[13].setPosition(650,660);
    tracker[14].setPosition(560,660);
    tracker[15].setPosition(470,660);
    tracker[16].setPosition(380,660);
    tracker[17].setPosition(325,605);
    tracker[18].setPosition(380,552);
    tracker[19].setPosition(470,552);
    tracker[20].setPosition(560,552);
    tracker[21].setPosition(613,500);
    tracker[22].setPosition(613,404);
    tracker[23].setPosition(613,314);
    tracker[24].setPosition(560,261);
    tracker[25].setPosition(470,261);
    tracker[26].setPosition(380,261);
    tracker[27].setPosition(325,208);
    tracker[28].setPosition(470,154);
    tracker[29].setPosition(380,154);

    //Physical sensors that can feel the car!

    trackerMatter[0] = this.matter.add.rectangle(560, 154, 4, 80, opt);
    trackerMatter[1] = this.matter.add.rectangle(650, 154, 4, 80, opt);
    trackerMatter[2] = this.matter.add.rectangle(740, 154, 4, 80, opt);
    trackerMatter[3] = this.matter.add.rectangle(830, 154, 4, 80, opt);
    trackerMatter[4] = this.matter.add.rectangle(930, 154, 4, 80, opt);
    trackerMatter[5] = this.matter.add.rectangle(982, 206, 80, 4, opt);
    trackerMatter[6] = this.matter.add.rectangle(982, 296, 80, 4, opt);
    trackerMatter[7] = this.matter.add.rectangle(982, 386, 80, 4, opt);
    trackerMatter[8] = this.matter.add.rectangle(930, 460, 4, 80, opt);
    trackerMatter[9] = this.matter.add.rectangle(850, 460, 4, 80, opt);
    trackerMatter[10] = this.matter.add.rectangle(794, 510, 80, 4, opt);
    trackerMatter[11] = this.matter.add.rectangle(794, 602, 80, 4, opt);
    trackerMatter[12] = this.matter.add.rectangle(740, 659, 4, 80, opt);
    trackerMatter[13] = this.matter.add.rectangle(650, 660, 4, 80, opt);
    trackerMatter[14] = this.matter.add.rectangle(560, 660, 4, 80, opt);
    trackerMatter[15] = this.matter.add.rectangle(470, 660, 4, 80, opt);
    trackerMatter[16] = this.matter.add.rectangle(380, 660, 4, 80, opt);
    trackerMatter[17] = this.matter.add.rectangle(325, 605, 80, 4, opt);
    trackerMatter[18] = this.matter.add.rectangle(380, 552, 4, 80, opt);
    trackerMatter[19] = this.matter.add.rectangle(470, 552, 4, 80, opt);
    trackerMatter[20] = this.matter.add.rectangle(560, 552, 4, 80, opt);
    trackerMatter[21] = this.matter.add.rectangle(613, 500, 80, 4, opt);
    trackerMatter[22] = this.matter.add.rectangle(613, 404, 80, 4, opt);
    trackerMatter[23] = this.matter.add.rectangle(613, 314, 80, 4, opt);
    trackerMatter[24] = this.matter.add.rectangle(560, 261, 4, 80, opt);
    trackerMatter[25] = this.matter.add.rectangle(470, 261, 4, 80, opt);
    trackerMatter[26] = this.matter.add.rectangle(380, 261, 4, 80, opt);
    trackerMatter[27] = this.matter.add.rectangle(325, 208, 80, 4, opt);
    trackerMatter[28] = this.matter.add.rectangle(470, 154, 4, 80, opt);
    trackerMatter[29] = this.matter.add.rectangle(380, 154, 4, 80, opt);
    
    //


    //Collision detection between car and road
    this.matter.world.on('collisionstart', function (event, bodyA, bodyB) {
        console.log(bodyA.parent.label);
        console.log(bodyB.parent.label);
        if(bodyA.parent.label === "road" || bodyB.parent.label === "road"){
            nCar.ResetCar();
        }
        if(bodyA.parent.label === "tracker" || bodyB.parent.label === "tracker"){
            nCar.countTracks++;
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
    rText.setText("Travel: " + nCar.countTracks);
    fpsText.setText("FPS Rend: " + Math.round(game.loop.actualFps));
    fps2Text.setText("FPS Phys: " + Math.round(fps.fps));

    var point1 = nCar.car.getTopRight();
    var point2 = nCar.car.getBottomLeft();

    sensor1.setPosition(point1.x, point1.y);
    sensor2.setPosition(point2.x, point2.y);
}


