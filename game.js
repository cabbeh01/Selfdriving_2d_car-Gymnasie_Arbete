
let config = {
    type: Phaser.AUTO,
    width: 1400,
    height: 800,
    parent: "game",
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
    },

    plugins: {
        scene: [
          {
            plugin: PhaserMatterCollisionPlugin, // The plugin class
            key: "matterCollision", // Where to store in Scene.Systems, e.g. scene.sys.matterCollision
            mapping: "matterCollision" // Where to store in the Scene, e.g. scene.matterCollision
          }
        ]
      }
}

let fps ={
    lag:0,
    fps: 60,
    frameduration: (1000/ 60)
}

let game = new Phaser.Game(config);
let nCar = new Car(685,153,this);

let Nsens1 = 0;
let Nsens2 = 0;
let Nsens3 = 0;


const COLORLINE = 0x00ffff;

const opt ={
    isSensor: true,
    label: "tracker"
}
const SensorSetting ={
    isSensor: true,
    type: "rectangle",
    height:2,
    width:nCar.lenghtsensors
}


function preload ()
{
    //Load graphics
    this.load.image("ground", "./Graphics/background2.png");
    this.load.image("car", "./Graphics/car.png");
    this.load.image("road", "./Graphics/road.png");

    //Load collision shape
    this.load.json("shapes", "./Graphics/shapes.json");
    
}

function create ()
{
    let shapes = this.cache.json.get("shapes");
    this.add.image(700, 400, "ground");
    road = this.matter.add.sprite(800, 400, "road","road", {shape: shapes.road});

    nCar.car = this.matter.add.sprite(nCar.car.x, nCar.car.y, "car","car",{shape: shapes.car});

    sensor1 = this.add.rectangle(0, 0, nCar.lenghtsensors, 2, 0x00ff00);
    sensor2 = this.add.rectangle(0, 0, nCar.lenghtsensors, 2, 0x00ff00);
    sensor3 = this.add.rectangle(0, 0, 100, 2, 0x00ff00);

    //Intial matter sensors
    for(let i = 0;i<3;i++){
        //nCar.sensor[i] = this.matter.add.rectangle(nCar.car.x, nCar.car.y, nCar.lenghtsensors, 2, SensorSetting);
        if(i== 2){
            nCar.sensor[i] = this.matter.add.sprite(nCar.car.x + 50, nCar.car.y + 50).setBody({
                isSensor: true,
                type: "rectangle",
                height:2,
                width:100
            });
        }
        else{
            nCar.sensor[i] = this.matter.add.sprite(nCar.car.x + 50, nCar.car.y + 50).setBody(SensorSetting);
        }
        
        nCar.sensor[i].body.label = "Sensor " + (i+1);
    }

    //Gör så att inte bilen och sensorerna kolliderar med varandra
    nCar.sensor[0].setCollisionGroup(-1);
    nCar.sensor[1].setCollisionGroup(-1);
    nCar.sensor[2].setCollisionGroup(-1);
    nCar.car.setCollisionGroup(-1);
    
    cursors = this.input.keyboard.createCursorKeys();
    keyD = this.input.keyboard.addKey("D");

    createTextObject(this);
    setPositionOnSensors(this);

    
    startTimer();

    this.matterCollision.addOnCollideStart({
        objectA: nCar.car,
        objectB: road,
        callback: eventData => {
            nCar.ResetCar();
        }
      });

    this.matterCollision.addOnCollideStart({
        objectA: nCar.car,
        objectB: trackerMatter,
        callback: eventData => {
            nCar.countTracks++;
        }
    });

    this.matterCollision.addOnCollideActive({
        objectA: nCar.sensor,
        objectB: road,
        callback: eventData => {
            
            if(eventData.gameObjectA.body.label === "Sensor 1"){
                Nsens1 = eventData.pair.collision.depth*10;
            }
            if(eventData.gameObjectA.body.label === "Sensor 2"){
                Nsens2 = eventData.pair.collision.depth*10;
            }
            if(eventData.gameObjectA.body.label === "Sensor 3"){
                Nsens3 = eventData.pair.collision.depth*10;
            }
            
        }
    });
    
    this.matterCollision.addOnCollideEnd({
        objectA: nCar.sensor,
        objectB: road,
        callback: eventData => {
            if(eventData.gameObjectA.body.label === "Sensor 1"){
                Nsens1 = 0;
            }
            if(eventData.gameObjectA.body.label === "Sensor 2"){
                Nsens2 = 0;
            }
            if(eventData.gameObjectA.body.label === "Sensor 3"){
                Nsens3 = 0;
            }
            //nCar.countTracks++;
        }
    });

    //debugMode(this);
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
    //Phys checks and server IO events update state of entities here
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

    //console.log([Nsens1,Nsens2,Nsens3]);
    if(activate([Nsens1,Nsens2,Nsens3]) > 0.5){
        nCar.Steer(-1);
        nCar.MoveForward();
    }
    else if(activate([Nsens1,Nsens2,Nsens3]) < 0.5){
        nCar.Steer(1);
        nCar.MoveForward();
    }
    
    nCar.MoveForward();
}
    
function renderGrapichs(){
    //Rendering graphics related stuff here
    xText.setText("X: "+ Math.round(nCar.car.x));
    yText.setText("Y: "+ Math.round(nCar.car.y));
    rText.setText(Math.round(nCar.car.rotation*(180/Math.PI)) +"°");
    rText.setText("Travel: " + nCar.countTracks);
    fpsText.setText("FPS Rend: " + Math.round(game.loop.actualFps));
    fps2Text.setText("FPS Phys: " + Math.round(fps.fps));

    stopwatch.setText("Time: " +s+"s "+ ms+"hs", { fontSize: "32px", fill: "#fff" });

    //Neural network

    sens1.setText("Sens 1: " + Nsens1);
    sens2.setText("Sens 2: " + Nsens2);
    sens3.setText("Sens 3: " + Nsens3);

    velocityX.setText("VelocityX: " + Math.round(nCar.velocityX));
    velocityY.setText("VelocityY: " + Math.round(nCar.velocityY));

    generationT.setText("Gen: " + generation);

    output.setText("Output: " + activate([Nsens1,Nsens2,Nsens3]));

    //nCar.sensor[0].position = {x:nCar.car.x + Math.cos(nCar.car.rotation + Math.PI/4)*nCar.lenghtsensors/2,y:nCar.car.y + Math.sin(nCar.car.rotation + Math.PI/4)*nCar.lenghtsensors/2};
    //sensor[0].position.x = nCar.car.x + Math.cos(nCar.car.rotation + Math.PI/4)*lenghtsensors/2;
    //sensor[0].position.y = nCar.car.y + Math.sin(nCar.car.rotation + Math.PI/4)*lenghtsensors/2;

    nCar.sensor[0].angle = (nCar.car.rotation + Math.PI/4)*(180/Math.PI);
    nCar.sensor[0].setPosition(nCar.car.x + Math.cos(nCar.car.rotation + Math.PI/4)*nCar.lenghtsensors/2, nCar.car.y + Math.sin(nCar.car.rotation + Math.PI/4)*nCar.lenghtsensors/2);
    sensor1.setPosition(nCar.car.x + Math.cos(nCar.car.rotation + Math.PI/4)*nCar.lenghtsensors/2, nCar.car.y + Math.sin(nCar.car.rotation + Math.PI/4)*nCar.lenghtsensors/2);
    sensor1.setRotation(nCar.car.rotation + Math.PI/4);



    //nCar.sensor[1].position ={x:nCar.car.x + Math.cos(nCar.car.rotation + -Math.PI/4)*nCar.lenghtsensors/2,y:nCar.car.y + Math.sin(nCar.car.rotation + -Math.PI/4)*nCar.lenghtsensors/2};
    nCar.sensor[1].angle = (nCar.car.rotation - Math.PI/4)*(180/Math.PI);
    nCar.sensor[1].setPosition(nCar.car.x + Math.cos(nCar.car.rotation + -Math.PI/4)*nCar.lenghtsensors/2, nCar.car.y + Math.sin(nCar.car.rotation + -Math.PI/4)*nCar.lenghtsensors/2);
    sensor2.setPosition(nCar.car.x + Math.cos(nCar.car.rotation + -Math.PI/4)*nCar.lenghtsensors/2, nCar.car.y + Math.sin(nCar.car.rotation + -Math.PI/4)*nCar.lenghtsensors/2);
    sensor2.setRotation(nCar.car.rotation - Math.PI/4);

    
    //nCar.sensor[2].position = {x:nCar.car.x + Math.cos(nCar.car.rotation)*nCar.lenghtsensors/2,y:nCar.car.y + Math.sin(nCar.car.rotation)*nCar.lenghtsensors/2};
    nCar.sensor[2].angle = nCar.car.rotation*(180/Math.PI);
    nCar.sensor[2].setPosition(nCar.car.x + Math.cos(nCar.car.rotation)*100/2, nCar.car.y + Math.sin(nCar.car.rotation)*100/2);
    sensor3.setPosition(nCar.car.x + Math.cos(nCar.car.rotation)*100/2, nCar.car.y + Math.sin(nCar.car.rotation)*100/2);
    sensor3.setRotation(nCar.car.rotation);



   
}

//  **********  Create Text objects  ********** 
function createTextObject(g){
    xText = g.add.text(16, 16, "X: 0", { fontSize: "32px", fill: "#fff" });
    yText = g.add.text(16, 52, "Y: 0", { fontSize: "32px", fill: "#fff" });
    rText = g.add.text(16, 88, "0°", { fontSize: "32px", fill: "#fff" });
    travelText = g.add.text(16, 88, "Travel: ", { fontSize: "32px", fill: "#fff" });

    fpsText = g.add.text(1130, 16, "FPS: ", { fontSize: "32px", fill: "#fff" });
    fps2Text = g.add.text(1130, 52, "FPS: ", { fontSize: "32px", fill: "#fff" });

    stopwatch = g.add.text(1130, 122, "Stopwatch: ", { fontSize: "32px", fill: "#fff" });
    bestTime = g.add.text(1035, 152, "Best Time: ", { fontSize: "32px", fill: "#fff" });

    generationT = g.add.text(1130, 212, "Gen: ", { fontSize: "32px", fill: "#fff" });


    //Text neural network

    sens1 = g.add.text(16, 160, "Sen1: 0", { fontSize: "32px", fill: "#fff" });
    sens2 = g.add.text(16, 196, "Sen2: 0", { fontSize: "32px", fill: "#fff" });
    sens3 = g.add.text(16, 232, "Sen3: 0", { fontSize: "32px", fill: "#fff" });

    velocityX = g.add.text(16, 338, "VelocityX: 0", { fontSize: "32px", fill: "#fff" });
    velocityY = g.add.text(16, 372, "VelocityY: 0", { fontSize: "32px", fill: "#fff" });
    //nCar.velocityX
    //nCar.velocityY


    output = g.add.text(16, 268, "Out: 0.90990", { fontSize: "32px", fill: "#fff" });
}




//  **********  Debug mode  ********** 
function debugMode(g){
    //Debug kod så man ser kollitionsområdena
    g.matter.world.createDebugGraphic();
}







//  **********  Set positions on all the sensors  ********** 
function setPositionOnSensors(g){
    //Trackers in scene
    tracker = [];
    trackerMatter = [];
    for(let i = 0; i<30;i++){
        if(i<5 || 7<i && i<10 || 11<i && i<17 || 17<i && i<21 || 23<i && i<27 || 27<i && i<30){
            tracker[i] = g.add.rectangle(0, 0, 4, 80, COLORLINE);
        }
        else if(4<i && i<8 || 9<i && i<12 || i == 17 || i == 27 || 20<i && i<24){
            tracker[i] = g.add.rectangle(0, 0, 80, 4, COLORLINE); //
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

    trackerMatter[0] = g.matter.add.rectangle(560, 154, 4, 80, opt);
    trackerMatter[1] = g.matter.add.rectangle(650, 154, 4, 80, opt);
    trackerMatter[2] = g.matter.add.rectangle(740, 154, 4, 80, opt);
    trackerMatter[3] = g.matter.add.rectangle(830, 154, 4, 80, opt);
    trackerMatter[4] = g.matter.add.rectangle(930, 154, 4, 80, opt);
    trackerMatter[5] = g.matter.add.rectangle(982, 206, 80, 4, opt);
    trackerMatter[6] = g.matter.add.rectangle(982, 296, 80, 4, opt);
    trackerMatter[7] = g.matter.add.rectangle(982, 386, 80, 4, opt);
    trackerMatter[8] = g.matter.add.rectangle(930, 460, 4, 80, opt);
    trackerMatter[9] = g.matter.add.rectangle(850, 460, 4, 80, opt);
    trackerMatter[10] = g.matter.add.rectangle(794, 510, 80, 4, opt);
    trackerMatter[11] = g.matter.add.rectangle(794, 602, 80, 4, opt);
    trackerMatter[12] = g.matter.add.rectangle(740, 659, 4, 80, opt);
    trackerMatter[13] = g.matter.add.rectangle(650, 660, 4, 80, opt);
    trackerMatter[14] = g.matter.add.rectangle(560, 660, 4, 80, opt);
    trackerMatter[15] = g.matter.add.rectangle(470, 660, 4, 80, opt);
    trackerMatter[16] = g.matter.add.rectangle(380, 660, 4, 80, opt);
    trackerMatter[17] = g.matter.add.rectangle(325, 605, 80, 4, opt);
    trackerMatter[18] = g.matter.add.rectangle(380, 552, 4, 80, opt);
    trackerMatter[19] = g.matter.add.rectangle(470, 552, 4, 80, opt);
    trackerMatter[20] = g.matter.add.rectangle(560, 552, 4, 80, opt);
    trackerMatter[21] = g.matter.add.rectangle(613, 500, 80, 4, opt);
    trackerMatter[22] = g.matter.add.rectangle(613, 404, 80, 4, opt);
    trackerMatter[23] = g.matter.add.rectangle(613, 314, 80, 4, opt);
    trackerMatter[24] = g.matter.add.rectangle(560, 261, 4, 80, opt);
    trackerMatter[25] = g.matter.add.rectangle(470, 261, 4, 80, opt);
    trackerMatter[26] = g.matter.add.rectangle(380, 261, 4, 80, opt);
    trackerMatter[27] = g.matter.add.rectangle(325, 208, 80, 4, opt);
    trackerMatter[28] = g.matter.add.rectangle(470, 154, 4, 80, opt);
    trackerMatter[29] = g.matter.add.rectangle(380, 154, 4, 80, opt);

}




//Collision detection between car and road
    /*this.matter.world.on("collisionstart", function (event, bodyA, bodyB) {
        //console.log(bodyA.area + "  " + bodyA.parent.label);
        //console.log(bodyB.area + "  " + bodyB.parent.label);
        //console.log(event.separation);

        Nsens1 = 0;
        Nsens2 = 0;
        Nsens3 = 0;
        if(bodyA.parent.label === "road" && bodyB.parent.label === "car"){
            nCar.ResetCar();
        }
        if(bodyA.parent.label === "car" && bodyB.parent.label === "tracker"){
            nCar.countTracks++;
        }
        if(bodyA.parent.label === "road"){
            for(let i = 0; i<3; i++){
                if(event.source.pairs.collisionActive[i]){
                    console.log(event.source.pairs.collisionActive[i].separation);
                }
                if(event.source.pairs.collisionActive[i].bodyB.label === "Sensor 2"){
                    console.log(event.source.pairs.collisionActive[i].separation);
                }
                if(event.source.pairs.collisionActive[i].bodyB.label === "Sensor 3"){
                    console.log(event.source.pairs.collisionActive[i].separation);
                }
            }
        }
        
        

//  .collision.separation
        if(bodyA.parent.label === "road" && bodyB.parent.label === "Sensor 1"){
            Nsens1 = 1;
            console.log(event.source.pairs.collisionActive[0]);
            console.log(bodyA.area + "  " + bodyA.parent.label);
            console.log(bodyB.area + "  " + bodyB.parent.label);
        }

        if(bodyA.parent.label === "road" && bodyB.parent.label === "Sensor 2"){
            Nsens2 = 1;
            console.log(bodyA.area + "  " + bodyA.parent.label);
            console.log(bodyB.area + "  " + bodyB.parent.label);
        }

        if(bodyA.parent.label === "road" && bodyB.parent.label === "Sensor 3"){
            Nsens3 = 1;
            console.log(bodyA.area + "  " + bodyA.parent.label);
            console.log(bodyB.area + "  " + bodyB.parent.label);
        }

    });*/