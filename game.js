// This is the main file for the whole project. It contains the game part and communicate with the neuralnetwork javascript file

// Configuration for Phaser api
const config = {
    type: Phaser.AUTO,
    width: 1400, // Canvas width
    height: 800, // Canvas height
    parent: "game",
    backgroundColor: 0x0ecf8f,
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    physics:{
        default: "matter",
        // Propities for the separate physics engine matter.js
        matter: {
            gravity: {
                y: 0
            }
            // debug: true
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

// Settings for the fps
const fps = {
    lag:0,
    fps: 60,
    frameduration: (1000/ 60)
}

let game = new Phaser.Game(config);
let nCar = new Car(685,153,this);

// Sensor value of distant to ground
let nSens = [0,0,0];

// Color of the diffrent sensors
const COLOR_ROADLINE = 0x00ffff;
const COLOR_SENSOR = 0x00ff00;

const opt ={
    isSensor: true,
    label: "tracker"
}
const sensorSetting ={
    isSensor: true,
    type: "rectangle",
    height:2,
    width:nCar.lenghtsensors
}

// Calls first. Loads inportant graphics or files to get accessed by the code in update and create
function preload ()
{
    // Load graphics
    this.load.image("ground", "./Graphics/background2.png");
    this.load.image("car", "./Graphics/car.png");
    this.load.image("road", "./Graphics/road.png");

    // Load collision shape
    this.load.json("shapes", "./Graphics/shapes.json");
    
}

// Function that declares every important object before changing gamedata and values
function create ()
{
    let shapes = this.cache.json.get("shapes");
    this.add.image(700, 400, "ground");
    road = this.matter.add.sprite(800, 400, "road","road", {shape: shapes.road});

    nCar.car = this.matter.add.sprite(nCar.car.x, nCar.car.y, "car","car",{shape: shapes.car});

    // The visable sensors
    sensor1 = this.add.rectangle(0, 0, nCar.lenghtsensors, 2, COLOR_SENSOR);
    sensor2 = this.add.rectangle(0, 0, nCar.lenghtsensors, 2, COLOR_SENSOR);
    sensor3 = this.add.rectangle(0, 0, 100, 2, COLOR_SENSOR);

    // Intial matter sensors
    for(let i = 0;i<3;i++){
        // nCar.sensor[i] = this.matter.add.rectangle(nCar.car.x, nCar.car.y, nCar.lenghtsensors, 2, sensorSetting);
        if(i== 2){
            nCar.sensor[i] = this.matter.add.sprite(nCar.car.x + 50, nCar.car.y + 50).setBody({
                isSensor: true,
                type: "rectangle",
                height:2,
                width:100
            });
        }
        else{
            nCar.sensor[i] = this.matter.add.sprite(nCar.car.x + 50, nCar.car.y + 50).setBody(sensorSetting);
        }
        
        nCar.sensor[i].body.label = "Sensor " + (i+1);
    }

    // Seperates car and sensors to avoid collision between each others 
    nCar.sensor[0].setCollisionGroup(-1);
    nCar.sensor[1].setCollisionGroup(-1);
    nCar.sensor[2].setCollisionGroup(-1);
    nCar.car.setCollisionGroup(-1);
    
    cursors = this.input.keyboard.createCursorKeys();
    keyD = this.input.keyboard.addKey("D");

    createTextObject(this);
    setPositionOnSensors(this);

    startTimer();


    //Collision detection
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
                nSens[0] = eventData.pair.collision.depth*10;
            }
            if(eventData.gameObjectA.body.label === "Sensor 2"){
                nSens[1] = eventData.pair.collision.depth*10;
            }
            if(eventData.gameObjectA.body.label === "Sensor 3"){
                nSens[2] = eventData.pair.collision.depth*10;
            }
            
        }
    });
    
    this.matterCollision.addOnCollideEnd({
        objectA: nCar.sensor,
        objectB: road,
        callback: eventData => {
            if(eventData.gameObjectA.body.label === "Sensor 1"){
                nSens[0] = 0;
            }
            if(eventData.gameObjectA.body.label === "Sensor 2"){
                nSens[1] = 0;
            }
            if(eventData.gameObjectA.body.label === "Sensor 3"){
                nSens[2] = 0;
            }
            // nCar.countTracks++;
        }
    });

    // debugMode(this);
}

// Update function that updates every frame
function update (timestamp, elapsed)
{
    // Counts to correct frame then runs physicsRend
    fps.lag += elapsed;
    while(fps.lag >= fps.frameduration){
        physicsRend(fps.frameduration);
        fps.lag -= fps.frameduration;
    }
    renderGrapichs();
    
}


function physicsRend(currentframe) {
    // Phys checks and server IO events update state of entities here
    nCar.Update();
    /*if(cursors.down.isDown){
        nCar.MoveBackwards(nCar.car.rotation);
        // nCar.Brake();
    }
    if(cursors.up.isDown){
        nCar.MoveForward(nCar.car.rotation);
    }
    if(cursors.left.isDown){
        nCar.Steer(-1);
    }
    if(cursors.right.isDown){
        nCar.Steer(1);
    }*/

    // console.log([nSens[0],nSens[1],nSens[1]]);
    if(activate([nSens[0],nSens[1],nSens[2]]) > 0.5){
        nCar.Steer(-1);
        nCar.MoveForward();
    }
    else if(activate([nSens[0],nSens[1],nSens[2]]) < 0.5){
        nCar.Steer(1);
        nCar.MoveForward();
    }
    
    nCar.MoveForward();
}
    
function renderGrapichs(){
    // Rendering graphics related texts here
    xText.setText("X: "+ Math.round(nCar.car.x));
    yText.setText("Y: "+ Math.round(nCar.car.y));
    rText.setText(Math.round(nCar.car.rotation*(180/Math.PI)) +"°");
    rText.setText("Travel: " + nCar.countTracks);
    fpsText.setText("FPS Rend: " + Math.round(game.loop.actualFps));
    fps2Text.setText("FPS Phys: " + Math.round(fps.fps));

    stopwatch.setText("Time: " +s+"s "+ ms+"hs", { fontSize: "32px", fill: "#fff" });
    runTime.setText("Runtime: " +totmin +":"+ +tots+":"+ totms+"", { fontSize: "32px", fill: "#fff" });

    // Neural network sensors
    sens1.setText("Sens 1: " + nSens[0]);
    sens2.setText("Sens 2: " + nSens[1]);
    sens3.setText("Sens 3: " + nSens[2]);

    velocityX.setText("VelocityX: " + Math.round(nCar.velocityX));
    velocityY.setText("VelocityY: " + Math.round(nCar.velocityY));

    generationT.setText("Generation: " + generation);
    genomeT.setText("Genome: " + genome +"/" + populationSize);
    output.setText("Output: " + activate([nSens[0],nSens[1],nSens[2]]));

    // nCar.sensor[0].position = {x:nCar.car.x + Math.cos(nCar.car.rotation + Math.PI/4)*nCar.lenghtsensors/2,y:nCar.car.y + Math.sin(nCar.car.rotation + Math.PI/4)*nCar.lenghtsensors/2};
    // sensor[0].position.x = nCar.car.x + Math.cos(nCar.car.rotation + Math.PI/4)*lenghtsensors/2;
    // sensor[0].position.y = nCar.car.y + Math.sin(nCar.car.rotation + Math.PI/4)*lenghtsensors/2;


    // Rendering the sensor graphics
    nCar.sensor[0].angle = (nCar.car.rotation + Math.PI/4)*(180/Math.PI);
    nCar.sensor[0].setPosition(nCar.car.x + Math.cos(nCar.car.rotation + Math.PI/4)*nCar.lenghtsensors/2, nCar.car.y + Math.sin(nCar.car.rotation + Math.PI/4)*nCar.lenghtsensors/2);
    sensor1.setPosition(nCar.car.x + Math.cos(nCar.car.rotation + Math.PI/4)*nCar.lenghtsensors/2, nCar.car.y + Math.sin(nCar.car.rotation + Math.PI/4)*nCar.lenghtsensors/2);
    sensor1.setRotation(nCar.car.rotation + Math.PI/4);

    // nCar.sensor[1].position ={x:nCar.car.x + Math.cos(nCar.car.rotation + -Math.PI/4)*nCar.lenghtsensors/2,y:nCar.car.y + Math.sin(nCar.car.rotation + -Math.PI/4)*nCar.lenghtsensors/2};
    nCar.sensor[1].angle = (nCar.car.rotation - Math.PI/4)*(180/Math.PI);
    nCar.sensor[1].setPosition(nCar.car.x + Math.cos(nCar.car.rotation + -Math.PI/4)*nCar.lenghtsensors/2, nCar.car.y + Math.sin(nCar.car.rotation + -Math.PI/4)*nCar.lenghtsensors/2);
    sensor2.setPosition(nCar.car.x + Math.cos(nCar.car.rotation + -Math.PI/4)*nCar.lenghtsensors/2, nCar.car.y + Math.sin(nCar.car.rotation + -Math.PI/4)*nCar.lenghtsensors/2);
    sensor2.setRotation(nCar.car.rotation - Math.PI/4);

    // nCar.sensor[2].position = {x:nCar.car.x + Math.cos(nCar.car.rotation)*nCar.lenghtsensors/2,y:nCar.car.y + Math.sin(nCar.car.rotation)*nCar.lenghtsensors/2};
    nCar.sensor[2].angle = nCar.car.rotation*(180/Math.PI);
    nCar.sensor[2].setPosition(nCar.car.x + Math.cos(nCar.car.rotation)*100/2, nCar.car.y + Math.sin(nCar.car.rotation)*100/2);
    sensor3.setPosition(nCar.car.x + Math.cos(nCar.car.rotation)*100/2, nCar.car.y + Math.sin(nCar.car.rotation)*100/2);
    sensor3.setRotation(nCar.car.rotation);

}

//  **********  Create Text objects  ********** 
function createTextObject(g){

    // Declaring textobjects into the game
    xText = g.add.text(16, 16, "X: 0", { fontSize: "32px", fill: "#fff" });
    yText = g.add.text(16, 52, "Y: 0", { fontSize: "32px", fill: "#fff" });
    rText = g.add.text(16, 88, "0°", { fontSize: "32px", fill: "#fff" });
    travelText = g.add.text(16, 88, "Travel: ", { fontSize: "32px", fill: "#fff" });

    fpsText = g.add.text(1130, 16, "FPS: ", { fontSize: "32px", fill: "#fff" });
    fps2Text = g.add.text(1130, 52, "FPS: ", { fontSize: "32px", fill: "#fff" });

    stopwatch = g.add.text(1130, 122, "Stopwatch: ", { fontSize: "32px", fill: "#fff" });
    bestTime = g.add.text(1035, 152, "Best Time: ", { fontSize: "32px", fill: "#fff" });
    runTime = g.add.text(470,720,"Runtime: ",{ fontSize: "48px", fill: "#fff" });


    generationT = g.add.text(1035, 212, "Generation: ", { fontSize: "32px", fill: "#fff" });
    genomeT = g.add.text(1110, 250, "Genome: ", { fontSize: "32px", fill: "#fff" });

    // Text neural network
    sens1 = g.add.text(16, 338, "Sen1: 0", { fontSize: "32px", fill: "#fff" });
    sens2 = g.add.text(16, 372, "Sen2: 0", { fontSize: "32px", fill: "#fff" });
    sens3 = g.add.text(16, 406, "Sen3: 0", { fontSize: "32px", fill: "#fff" });

    velocityX = g.add.text(16, 160, "VelocityX: 0", { fontSize: "32px", fill: "#fff" });
    velocityY = g.add.text(16, 196, "VelocityY: 0", { fontSize: "32px", fill: "#fff" });
    // nCar.velocityX
    // nCar.velocityY

    
    output = g.add.text(16, 444, "Out: 0.90990", { fontSize: "32px", fill: "#fff" });
}


//  **********  Debug mode  ********** 
function debugMode(g){
    // Debug code to show collision area
    g.matter.world.createDebugGraphic();

}

let debugState = true;

function debugONOFF(){

    // Debug code to switch it on or off

    if(!debugState){
        debugState = true;
        document.getElementById('debug').value = "Debug: On";
        output.visible = true;
        xText.visible = true;
        yText.visible = true;
        rText.visible = true;
        travelText.visible = true;
        fpsText.visible = true;
        fps2Text.visible = true;
        stopwatch.visible = true;
        bestTime.visible = true;
        generationT.visible = true;
        genomeT.visible = true;
        sens1.visible = true;
        sens2.visible = true;
        sens3.visible = true;
        velocityX.visible = true;
        velocityY.visible = true;
        sensor1.visible = true;
        sensor2.visible = true;
        sensor3.visible = true;
        for(let i = 0; i<30;i++){
            tracker[i].visible = true;
        }
        
    }
    else{
        debugState = false;
        document.getElementById('debug').value = "Debug: Off";
        output.visible = false;
        xText.visible = false;
        yText.visible = false;
        rText.visible = false;
        travelText.visible = false;
        fpsText.visible = false;
        fps2Text.visible = false;
        stopwatch.visible = false;
        bestTime.visible = false;
        generationT.visible = false;
        genomeT.visible = false;
        sens1.visible = false;
        sens2.visible = false;
        sens3.visible = false;
        velocityX.visible = false;
        velocityY.visible = false;
        sensor1.visible = false;
        sensor2.visible = false;
        sensor3.visible = false;
        for(let i = 0; i<30;i++){
            tracker[i].visible = false;
        }
        
    }

}





//  **********  Set positions on all the sensors  ********** 
function setPositionOnSensors(g){
    // Trackers in scene
    tracker = [];
    trackerMatter = [];
    for(let i = 0; i<30;i++){
        if(i<5 || 7<i && i<10 || 11<i && i<17 || 17<i && i<21 || 23<i && i<27 || 27<i && i<30){
            tracker[i] = g.add.rectangle(0, 0, 4, 80, COLOR_ROADLINE);
        }
        else if(4<i && i<8 || 9<i && i<12 || i == 17 || i == 27 || 20<i && i<24){
            tracker[i] = g.add.rectangle(0, 0, 80, 4, COLOR_ROADLINE); //
        }
    }

    // Set position of visible tracker
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

    // Physical sensors that can feel the car!
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