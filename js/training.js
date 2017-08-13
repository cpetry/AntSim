define([ 'neuralNetwork', 'settingsSimulation', 'simulation'], 
function(NeuralNetwork, SettingsSimulation, Simulation) {

return class Training {
	constructor(canvas){
		this.canvas = canvas;
		this.neuralNetwork = new NeuralNetwork();
	}
	
	start(userAntFunction){
		// for now only neural networks are trained
		Math.seedrandom();
		window.cancelAnimationFrame(requestID);
		requestID = undefined;
		
		this.neuralNetwork.shouldTrain = true;
		var settings = new SettingsSimulation(AntType.NEURALNET, HiveType.DEFAULT, userAntFunction);
		settings.neuralNetwork = this.neuralNetwork;
		
		var i = 0;
		function simulate(){
			i++;
			if (i < 100){
				Math.seedrandom();
				new Simulation(this.canvas, settings, simulate.bind(this));
			}
		}
		simulate.call(this);
	}
	
	test(userAntFunction){
		// for now only neural networks are trained
		Math.seedrandom();
		window.cancelAnimationFrame(requestID);
		requestID = undefined;

		this.neuralNetwork.shouldTrain = false;
		var settings = new SettingsSimulation(AntType.NEURALNET, HiveType.DEFAULT, userAntFunction);
		settings.neuralNetwork = this.neuralNetwork;
		new Simulation(this.canvas, settings);
	}
	
	reset(){
		this.neuralNetwork = new NeuralNetwork();
	}
}

});