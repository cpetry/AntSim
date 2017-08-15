define([ 'settingsSimulation', 'simulation'], 
function( SettingsSimulation, Simulation) {

return class Training {
	constructor(canvas){
		this.canvas = canvas;
	}
	
	start(mode, playerSettings){
		// for now only neural networks are trained
		Math.seedrandom();
		window.cancelAnimationFrame(requestID);
		requestID = undefined;
		playerSettings[0].mayTrain = true;
		var settings = new SettingsSimulation(mode, playerSettings);
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
	
	test(mode, playerSettings){
		// for now only neural networks are trained
		Math.seedrandom();
		window.cancelAnimationFrame(requestID);
		requestID = undefined;

		playerSettings[0].mayTrain = false;
		var settings = new SettingsSimulation(mode, playerSettings);
		new Simulation(this.canvas, settings);
	}
	
	reset(){
		this.neuralNetwork = new NeuralNetwork();
	}
}

});