//In this file I'm going to start develop the neural network for the car

/*

Sen1-
     \
      ---  Hidden Layer --
                          \
     /                     \
Sen2-     |Hidden Layer|    ---- Output
     \                     /     * Steer Right
      ---  Hidden Layer --/      * Steer Left
     /                           * (Move forward)
Sen3-

*/

//Initiling the methods from synaptic
let Layer = synaptic.Layer;
let Network = synaptic.Network;

//Creation of the network


//let inputLayer = new Layer(3);
let inputLayer = new Layer(3); 
let hiddenLayer = new Layer(6);
let outputLayer = new Layer(2); // Kanske bara behöver använda mig av två input alltså höger eller vänster då gasen i botten kan köras hela tiden

let fitness = 0;
let learningrate = .03;

inputLayer.project(hiddenLayer);
hiddenLayer.project(outputLayer);

let NeuralNetwork = new Network({
	input: inputLayer,
	hidden: [hiddenLayer],
	output: outputLayer
});

//Link to the car module
let carNN = nCar;


//Training the network


function train(){
    for(let i = 0; i<1000;i++){
        carNN.MoveForward();
    }
}

function nextGeneration(){

}

function mutation(){

}

function crossover(){
     
}



function GuessWord(lenght){
    let word = "";
    for(let i = 0; i<lenght;i++){
        n = Math.floor(Math.random()*125);
        while(!(n > 96 && n < 123)){
            n = Math.floor(Math.random()*125);
        }
        
        a = String.fromCharCode(n);

        word += a;
    }
    console.log(word);
}
//Test the network