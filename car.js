//This is the car class and it handles all the values of the car

class Car {
    
    velocityX=0;
    velocityY=0;
    drag=0.82;
    angularVelocity=0.001;
    angularDrag = 0.1;
    power = 0.35;
    turnspeed = .09;
    maxVelocity = 3;
    minVelocity = -3;

    startX;
    startY;
    countTracks = 0;

    //Sensor
    sensor = [3];
    lenghtsensors = 90;
    loadedmodel = false;

    car = new Object;
    
    constructor(x,y){
        this.car.x = x;
        this.startX = x;
        this.car.y = y;
        this.startY = y;
    }

    Update(){
        this.car.x += this.velocityX;
        this.car.y += this.velocityY;
        this.velocityX *= this.drag;
        this.velocityY *= this.drag;
        this.car.rotation += this.angularVelocity;
        this.angularVelocity *= this.angularDrag;
    }

    MoveBackwards(){
        this.velocityX -= Math.cos(this.car.rotation) * this.power;
        this.velocityY -= Math.sin(this.car.rotation) * this.power;
    }

    GettotalVelocity(){
        return velocityX + velocityY;
    }

    MoveForward(){
        if(this.velocityX < this.maxVelocity && this.velocityY < this.maxVelocity && this.velocityX > this.minVelocity && this.velocityY > this.minVelocity){
            this.velocityX += Math.cos(this.car.rotation) * this.power;
            this.velocityY += Math.sin(this.car.rotation) * this.power;
        }
    }

    Brake(){
        if(this.velocityX > 0 && this.velocityY >0){
            this.velocityX -= Math.cos(this.car.rotation) * this.power;
            this.velocityY -= Math.sin(this.car.rotation) * this.power;
        }
    }

    ResetCar(loadedmodel = false){
        if(!loadedmodel){
            let fitness = parseFloat(this.countTracks)*10 + parseFloat(stopTimer());
            //console.log(this.countTracks);
            //console.log(stop);
            advanceGenome(fitness);
            
            this.car.x = this.startX;
            this.car.y = this.startY;
            this.car.rotation = 0;
            this.velocityX = 0;
            this.velocityY = 0;
            this.countTracks = 0;
            startTimer();
        }
        else{
            stopTimer();
            this.car.x = this.startX;
            this.car.y = this.startY;
            this.car.rotation = 0;
            this.velocityX = 0;
            this.velocityY = 0;
            this.countTracks = 0;
            startTimer();
        }
    }

    //Right is 1 and Left is -1
    Steer(a){
        if(a === -1){
            this.angularVelocity -= this.turnspeed;
        }
        else if(a === 1){
            this.angularVelocity += this.turnspeed;
        }
    }
}