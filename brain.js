//In this file I'm going to start develop the neural network for the car

/*

Sen1-
     \
      ---  Hidden Layer --
                          \
     /                     \
Sen2-     |Hidden Layer|    ---- Output (ONE)
     \                     /     * Steer Right
      ---  Hidden Layer --/      * Steer Left
     /                           * (Move forward)
Sen3-

*/

//Initiling the methods from synaptic
let Network = synaptic.Network;
let Architect = synaptic.Architect;

//Creation of the network

//let inputLayer = new Layer(3);
let inputLayer = 3; 
let hiddenLayer = 6;
let outputLayer = 1 

let fitness = 0;
let learningrate = .03;
let populationSize = 20;
let nBest = 2;
let mutationProbability = 0.2;

let generation = 0;

let genomes = [];

while (genomes.length < populationSize) {
    // Population genomes with random perceptron networks
    genomes.push( new Architect.Perceptron(inputLayer, hiddenLayer, hiddenLayer, outputLayer) );
}

let genome = 0;



//Training the network


function activate(data){
    return genomes[genome].activate(data);
}

function advanceGenome(fitness){
	genomes[genome].fitness = fitness; // Assign fitness to the current genome 
	genome++; // Advance genome
	if (genome > genomes.length-1){
		console.log("Advancing generation");
		createNextGeneration();
	}
}


function createNextGeneration(){
	generation++; // Advance generation
	genome = 0; // Reset current genome

	console.log(genomes);
	keepBestGenomes(); // Kill worst genomes and copy the best for crossover
	var bestGenomes = JSON.parse(JSON.stringify(genomes)); // Deep copy

	// Peform the crossover and mutation by selecting two random genomes
	// From the bestGenomes and add the new genome to the generation
	// Until there are populationSize - 2 remaining
	while (genomes.length < populationSize - 2){
		// Select two random genomes
		var genome1 = sample(bestGenomes);
		var genome2 = sample(bestGenomes);
		 
		// Cross over the two randomly selected genomes
		var crossOver = crossOver(genome1, genome2);
		// Mutate using the new genome created from the crossover
		var mutatedGenome = mutate(crossOver);
		// Add to next generation
		genomes.push(Network.fromJSON(mutatedGenome)); 
	}

	// perform just the mutation for the remaining two genomes 
	while (genomes.length < populationSize){
		var genome = sample(bestGenomes); // get random genome
		genomes.push( Network.fromJSON(mutate(genome))); // mutate and add to next generation
	}
}


function sample(array){
	return array[Math.floor(Math.random()*array.length)];
}


function keepBestGenomes(maximize=false){
	// sort genomes on fitness
	genomes.sort(function(a, b){ return a['fitness'] - b['fitness'] });
	if (maximize) genomes.reverse(); // allows for fitness to be maximized 
	console.log(genomes);
	
	while (genomes.length > nBest) // remove worst genomes
		genomes.pop();
}


function mutate(net){
	// mutate neurons
	var neurons = net.neurons;
	for (var i = 0; i < neurons.length; i++){  
		// adjust the bias multiplying a random number in the random -2:2
		if (Math.random() < mutationProbability)
			neurons[i]['bias'] += neurons[i]['bias'] * (Math.random() - 0.5) * 3 + (Math.random() - 0.5);
	}

	// mutate connections
	var connections = net.connections;
	for (var i = 0; i < connections.length; i++){ 
		// adjust the weight multiplying a random number in the random -2:2
		if (Math.random() < mutationProbability)
			connections[i]['weight'] += connections[i]['weight'] * (Math.random() - 0.5) * 3 + (Math.random() - 0.5);
	}

	return net;
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