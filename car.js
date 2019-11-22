class Car {
    
    velocityX=0;
    velocityY=0;
    drag=0.92;
    angularVelocity=0.001;
    angularDrag = 0.1;
    power = 0.35;
    turnspeed = .07;
    maxVelocity = 4;
    minVelocity = -4;

    startX;
    startY;
    countTracks = 0;

    //Sensor
    sensor = [3];
    lenghtsensors = 50;


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

    ResetCar(){
        this.car.x = this.startX;
        this.car.y = this.startY;
        this.car.rotation = 0;
        this.velocityX = 0;
        this.velocityY = 0;
        this.countTracks = 0;
    }
    //Höger är 1 och vänster -1
    Steer(a){
        if(a === -1){
            this.angularVelocity -= this.turnspeed;
        }
        else if(a === 1){
            this.angularVelocity += this.turnspeed;
        }
    }
}