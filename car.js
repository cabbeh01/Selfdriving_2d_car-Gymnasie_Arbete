class Car {
    
    velocityX=0;
    velocityY=0;
    drag=0.92;
    angularVelocity=0.001;
    angularDrag = 0.1;
    power = 0.35;
    turnspeed = .07;

    startX;
    startY;
    car;
    
    constructor(x,y,game){
        this.x = x;
        this.startX = x;
        this.y = y;
        this.startY = y;
    }

    Update(){
        car.x += this.velocityX;
        car.y += this.velocityY;
        this.velocityX *= this.drag;
        this.velocityY *= this.drag;
        car.rotation += this.angularVelocity;
        this.angularVelocity *= this.angularDrag;
    }

    MoveBackwards(rotation){
        this.velocityX -= Math.cos(rotation) * this.power;
        this.velocityY -= Math.sin(rotation) * this.power;
    }



    MoveForward(rotation){
        this.velocityX += Math.cos(rotation) * this.power;
        this.velocityY += Math.sin(rotation) * this.power;
    }

    ResetCar(x,y,rotation){
        car.x = this.startX;
        car.y = this.startY;
        car.rotation = 0;
        this.velocityX = 0;
        this.velocityY = 0;
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