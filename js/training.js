define([ 'settingsSimulation', 'simulation', 'neuralNetwork'], 
function( SettingsSimulation, Simulation, NeuralNetwork) {

return class Training {
	constructor(canvas){
		this.canvas = canvas;
	}
	
	start(mode, playerSettings){
		Math.seedrandom();
		window.cancelAnimationFrame(requestID);
		requestID = undefined;
		
		// check if neural network ants do have a brain
		if (playerSettings[0].antType == AntType.NEURALNET
		&& playerSettings[0].globalMemory == null){
			globalMemorySelf = new NeuralNetwork();
			playerSettings[0].globalMemory = globalMemorySelf;
		}			
		
		playerSettings[0].mayTrain = true;
		var settings = new SettingsSimulation(mode, playerSettings);
		var i = 0;
		function simulate(){
			console.log(playerSettings[0].globalMemory)
			i++;
			if (i < 100){
				Math.seedrandom();
				new Simulation(this.canvas, settings, simulate.bind(this));
			}
		}
		simulate.call(this);
	}
	
	test(mode, playerSettings){
		Math.seedrandom();
		window.cancelAnimationFrame(requestID);
		requestID = undefined;
		
		// check if neural network ants do have a brain
		for (var s in playerSettings)
			if (playerSettings[s].antType == AntType.NEURALNET
			&& playerSettings[s].globalMemory == null)
				throw new TypeError("No neural network existing!")

		playerSettings[0].mayTrain = false;
		var settings = new SettingsSimulation(mode, playerSettings);
		new Simulation(this.canvas, settings);
	}
	
	reset(){
		this.neuralNetwork = new NeuralNetwork();
	}
}

});