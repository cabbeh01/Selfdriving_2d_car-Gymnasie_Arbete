//In this file I'm going to start develope the neural network for the car

/*

Sen1-
     \
      ---  Hidden Layer --
                          \
     /                     \
Sen2-     |Hidden Layer|    ---- Output
     \                     /     * Steer Right
      ---  Hidden Layer --/      * Steer Left
     /                           * Move forward
Sen3-

*/

//Initiling the methods from synaptic
let Layer = synaptic.Layer;
let Network = synaptic.Network;

//Creation of the network


//let inputLayer = new Layer(3);
let inputLayer = new Layer(2); // Kanske bara behöver använda mig av två input alltså höger eller vänster då gasen i botten kan köras hela tiden
let hiddenLayer = new Layer(6);
let outputLayer = new Layer(3);

let fitness = 0;


inputLayer.project(hiddenLayer);
hiddenLayer.project(outputLayer);

let NeuralNetwork = new Network({
	input: inputLayer,
	hidden: [hiddenLayer],
	output: outputLayer
});


//Training the network



function nextGeneration(){

}

function mutation(){

}

function crossover(){
     
}

//Test the network