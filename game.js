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
        default: "matter",
        matter: {
            gravity: {
                y: 0
            }
            //debug: true
        }
    }


}

var game = new Phaser.Game(config);
let rotate = 0;

function preload ()
{
    this.load.image("car", "car.png");
}

function create ()
{
    car = this.matter.add.image(100, 150, 'car');
    cursors = this.input.keyboard.createCursorKeys();
    xText = this.add.text(16, 16, 'X: 0', { fontSize: '32px', fill: '#000' });
    yText = this.add.text(16, 52, 'Y: 0', { fontSize: '32px', fill: '#000' });
    
}

function update ()
{
    
    xText.setText("X: "+ Math.round(car.x));
    yText.setText("Y: "+ Math.round(car.y));

    
    if(cursors.down.isDown){
        car.setVelocityY(10);
    }
    else if(cursors.up.isDown){
        car.setVelocityY(-10);
        car.setSensor(2)
    }
    else if(cursors.left.isDown){
        rotate+=1;
    }
    else if(cursors.right.isDown){
        rotate-=1;
    }
    else{
        car.setVelocity(0,0);
    }

    car.rotation = rotate;
}