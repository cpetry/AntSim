define(['antController'], function(AntController) {
	
/**
 * AntControllerNeuralNet class
 *
 * Implements a TD-Neural-Q-Learning algorithm for AntSim.
 * This implementation is neither perfect nor meant to look
 * good in any way. Feel free to improve, describe, clarify,
 * add, remove or completely rewrite. This class is mainly
 * meant as an example and case study.
 */
return class AntControllerNeuralNet extends AntController{
	constructor(ant, neuralNetwork, userCode){
		super(ant, userCode);
		this.memory = { harvestedFood : false, lastLife : -1 };
		this.neuralNetwork = neuralNetwork;
		this.networkMemory = this.neuralNetwork.networkMemory;
		
		this.batchSize = 10;
		this.minTrainSet = this.batchSize * 500;

		this.trainSet = this.neuralNetwork.trainSet;
		this.realChosen = this.neuralNetwork.realChosen;
		this.firstChoice = this.neuralNetwork.firstChoice;
	}		
}

});