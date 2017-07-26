class Training {
	constructor(){
		this.neuralNetwork = new NeuralNetwork();
	}
	
	start(antType = AntType.NEURALNET){
		// for now only neural networks are trained
		Math.seedrandom();
		window.cancelAnimationFrame(requestID);
		requestID = undefined;

		
		this.neuralNetwork.shouldTrain = true;
		settings = new SettingsSimulation(antType, HiveType.DEFAULT, this.neuralNetwork);
		new Simulation(settings);
	}
	
	test(antType = AntType.NEURALNET){
		// for now only neural networks are trained
		Math.seedrandom();
		window.cancelAnimationFrame(requestID);
		requestID = undefined;

		this.neuralNetwork.shouldTrain = false;
		settings = new SettingsSimulation(antType, HiveType.DEFAULT, this.neuralNetwork);
		new Simulation(settings);
	}
	
	reset(){
		this.neuralNetwork = new NeuralNetwork();
	}

}