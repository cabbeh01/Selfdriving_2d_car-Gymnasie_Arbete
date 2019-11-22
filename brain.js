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
    // population genomes with random perceptron networks
    genomes.push( new Architect.Perceptron(inputLayer, hiddenLayer, hiddenLayer, outputLayer) );
}

let genome = 0;



//Training the network


function activate(data){
    return genomes[genome].activate(data);
}

function advanceGenome(fitness){
	genomes[genome].fitness = fitness; // assign fitness to the current genome 
	genome++; // advance genome
	if (genome > genomes.length-1){
		console.log("advancing generation");
		createNextGeneration();
	}
}


function createNextGeneration(){
	generation++; // advance generation
	genome = 0; // reset current genome

	console.log(genomes);
	keepBestGenomes(); // kill worst genomes and copy the best for crossover
	var bestGenomes = JSON.parse(JSON.stringify(genomes)); // deep copy

	// peform the crossover and mutation by selecting two random genomes
	// from the bestGenomes and add the new genome to the generation
	// until there are popSize - 2 remaining
	while (genomes.length < popSize - 2){
		// select two random genomes
		var genome1 = sample(bestGenomes);
		var genome2 = sample(bestGenomes);
		 
		// cross over the two randomly selected genomes
		var crossOver = crossOver(genome1, genome2);
		// mutate using the new genome created from the crossover
		var mutatedGenome = mutate(crossOver);
		// add to next generation
		genomes.push(Network.fromJSON(mutatedGenome)); 
	}

	// perform just the mutation for the remaining two genomes 
	while (genomes.length < popSize){
		var genome = sample(bestGenomes); // get random genome
		genomes.push( Network.fromJSON(mutate(genome))); // mutate and add to next generation
	}
}


function sample(array){
	return array[Math.floor(Math.random()*array.length)];
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