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

// Initiling the methods from synaptic
let Network = synaptic.Network;
let Architect = synaptic.Architect;

// ******* Creation of the network *******

// let inputLayer = new Layer(3);
let inputLayer = 3; 
let hiddenLayer = 4; // Default 4
let outputLayer = 1 

let fitness = 0;
let learningrate = .02;
let populationSize = 50;
let nBest = 2;
let mutationProbability = 0.2;

let generation = 0;

let genomes = [];

while (genomes.length < populationSize) {
    // Population genomes with random perceptron networks
    genomes.push( new Architect.Perceptron(inputLayer,hiddenLayer, hiddenLayer, outputLayer) );
}

let genome = 0;



// ******* Training the network *******
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
	let bestGenomes = JSON.parse(JSON.stringify(genomes)); // Deep copy

	// Peform the crossover and mutation by selecting two random genomes
	// From the bestGenomes and add the new genome to the generation
	// Until there are populationSize - 2 remaining
	while (genomes.length < populationSize - 2){
		// Select two random genomes
		let genome1 = sample(bestGenomes);
		let genome2 = sample(bestGenomes);
		 
		// Cross over the two randomly selected genomes
		let cO = crossOver(genome1, genome2);
		// console.log(cO);
		// Mutate using the new genome created from the crossover
		let mutatedGenome = mutate(cO);
		// Add to next generation
		genomes.push(Network.fromJSON(mutatedGenome)); 
	}

	// Perform just the mutation for the remaining two genomes 
	while (genomes.length < populationSize){
		let genome = sample(bestGenomes); // Get random genome
		genomes.push( Network.fromJSON(mutate(genome))); // Mutate and add to next generation
	}
}

function keepBestGenomes(){
	// Sort genomes on fitness
	genomes.sort(function(a, b){ return a["fitness"] - b["fitness"] });
	genomes.reverse(); // Allows for fitness to be maximized 
	console.log(genomes);
	
	while (genomes.length > nBest) // Remove worst genomes
		genomes.pop();
}

function sample(array){
	return array[Math.floor(Math.random()*array.length)];
}

function mutate(n){
	// Mutate neurons
	let neurons = n.neurons;
	for (let i = 0; i < neurons.length; i++){  
		// Adjust the bias multiplying a random number in the random -2:2
		if (Math.random() < mutationProbability)
			neurons[i]["bias"] += neurons[i]["bias"] * (Math.random() - 0.5) * 3 + (Math.random() - 0.5);
	}

	// Mutate connections
	let connections = n.connections;
	for (let i = 0; i < connections.length; i++){ 
		// Adjust the weight multiplying a random number in the random -2:2
		if (Math.random() < mutationProbability)
			connections[i]["weight"] += connections[i]["weight"] * (Math.random() - 0.5) * 3 + (Math.random() - 0.5);
	}

	return n;
}

function crossOver(n1, n2){
	if (Math.random() > 0.5){ // Swap probability
		let temp = n1;
		n1 = n2;
		n2 = temp;
	}
	
	// Deep clone the neurons of both nets to avoid changing the originals
	let n1Copy = JSON.parse(JSON.stringify(n1));
	let n2Copy = JSON.parse(JSON.stringify(n2));
	let n1Neurons = n1Copy.neurons;
	let n2Neurons = n2Copy.neurons;

	// Select a random number of neurons to perform a cross over of networks neurons
	let slicePoint = Math.round(n1Neurons.length * Math.random());
	for (let i=slicePoint; i<n1Neurons; i++){
		// Swap bias values
		let temp = n1Neurons[i]["bias"];
		n1Neurons[i]["bias"] = n2Neurons[i]["bias"];
		n2Neurons[i]["bias"] = temp;
	}

	return n1Copy; 
}


// Send current generation of genomes to the server to save as a file
function saveGeneration(x){
	console.log("Saving generation");
	let filename = "undefined";
	if(!document.getElementById("name_genome").value == ""){
		filename = document.getElementById("name_genome").value;
	}
	let saveGeneration;
	// Create array of genomes objects 
	if(x){
		saveGeneration = genomes.map(function(genome){ return genome.toJSON(); });
	}
	else{
		saveGeneration = genomes[genome].toJSON();
	}
	
	
	let serializedGen = JSON.stringify(saveGeneration);

	downloadGeneration(serializedGen, filename+".json", "text/plain");
}

function downloadGeneration(content, fileName, contentType) {
    let a = document.createElement("a");
    let file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}


// Load choosen generation and push it to the model
function loadGeneration(){
	console.log("Loading generation");
	let selectedFile = document.getElementById("get_the_file").files[0];
	
	let reader = new FileReader();
	reader.readAsText(selectedFile);

	reader.onload = function() {
		// console.log(reader.result);
		
		let importGenome = JSON.parse(reader.result); // Array of Objects.
		genome = 0;
		generation = 0;
		// Load genomes in to current genomes

		console.log(importGenome.length);
		if(importGenome.length != 50){
			genomes = [50]
			genomes[generation] = Network.fromJSON(importGenome);
		}
		else {
			genomes = []
			genomes = importGenome.map(function(genome){ return Network.fromJSON(genome) });
		}

		console.log(genomes); // You can index every object
			
		nCar.ResetCar(true);
	};
	
	reader.onerror = function() {
		nCar.ResetCar(false);
	};
}
