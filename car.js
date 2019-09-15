class Car{

    velocityX=0;
    velocityY=0;
    drag=.1;
    angularVelocity=0.00005;
    angularDrag = 0.9;
    power = 1.5;
    turnspeed = .005;
    
    constructor(x,y){
        this.x = x;
        this.y = y;
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

    MoveForward(){
        this.velocityX += Math.cos(car.rotation) * this.power;
        this.velocityY += Math.sin(car.rotation) * this.power;
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