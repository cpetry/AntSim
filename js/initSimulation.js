var requestID;
var userAntFunction;

Debug.setShowLife(document.getElementById('debugShowLife').checked);
Debug.setVisibility(document.getElementById('debugVisibility').checked);
Debug.setShowCollider(document.getElementById('debugCollider').checked);
Debug.setShowFoodAmount(document.getElementById('debugFoodAmount').checked);
Debug.setShowSmellingDistance(document.getElementById('debugSmellingDistance').checked);
Debug.setShowSmelledObjectsPosition(document.getElementById('debugSmelledObjectsPosition').checked);
Debug.setShowPheromones(document.getElementById('debugPheromones').checked);

function showGraph(show){
	document.getElementById('canvasSimulation').style.display = (show ? 'none' : 'inline');
	document.getElementById('graphs').style.display = (show ? 'block' : 'none');
	document.getElementById('NoUI').style.display = (show ? 'none' : 'inline');
	document.getElementById('settings').style.display = (show ? 'none' : 'inline');
}

SettingsGlobal.setFramesPerSecond(document.getElementById('fps').value);

playerSettings =  [{antType: AntType.CUSTOM, hiveType: HiveType.DEFAULT, antCode: new Function(simpleAntCode), hiveCode: null},
			{antType: AntType.CUSTOM, hiveType: HiveType.DEFAULT, antCode: new Function(simpleAntCode), hiveCode: null}]

requirejs.config({
	//By default load any module IDs from js
	baseUrl: './js',
	//except, if the module ID starts with "app",
	//load it from the js/app directory. paths
	//config is relative to the baseUrl, and
	//never includes a ".js" extension since
	//the paths config could be for a directory.
});
	
requirejs([ 'external/seedrandom/seedrandom',
			'external/setImmediate/setImmediate',
			'simulation','settingsSimulation', 'training','ant'],
function   (seed, setImmediate, Simulation, SettingsSimulation, Training, Ant) {
	
	var canvas = document.getElementById('canvasSimulation')
	var training = new Training(canvas);
	
	SettingsGlobal.setFramesPerSecond(30);
	var Debug;
	
	function startTeaser(){
		SettingsGlobal.setShowUI(true);
		var settings = new SettingsSimulation(SimulationMode.COMPETITIVE, playerSettings);
		new Simulation(canvas, settings);
	}

	function startSimulation(mode){
		console.log("Simulation")

		// check if neural network ants do have a brain
		for (var s in playerSettings)
			if (playerSettings[s].antType == AntType.NEURALNET
			&& playerSettings[s].globalMemory == null)
				throw new TypeError("No neural network existing!")

		var settings = new SettingsSimulation(mode, playerSettings);
		new Simulation(canvas, settings);
	}

	function startTraining(mode){
		console.log("startTraining")
		SettingsGlobal.setShowUI(true);
		SettingsGlobal.setFramesPerSecond(60);
		training.start(mode, playerSettings);
	}

	function testTraining(mode){
		console.log("testTraining")
		SettingsGlobal.setShowUI(true);
		training.test(mode, playerSettings);
	}

	function resetTraining(){
		console.log("resetTraining")
		training.reset();
	}
	
	function initSimulation(simulationSettings){
		/*if ((window.location.protocol != 'file:') 
		&& e.origin != "https://cpetry.github.io"){
			console.log("Message blocked from: " + e.origin)
			return;
		}*/
		var result = '';
		var parsedData = simulationSettings;
		var command;
		var mode = SimulationMode.SOLO;
		
		// setImmediate() uses postMessage! We therefor have to intercept this message here.
		/*if ((typeof parsedData === 'string' || parsedData instanceof String) 
		&& parsedData.startsWith("setImmediate")){
			return;
		}*/
		
		command = parsedData.command;
		mode = parsedData.mode;
		playerSettings = parsedData.playerSettings;

		// interprete code
		for (var s in playerSettings)
			playerSettings[s].antCode = new Function(playerSettings[s].antCode);
		
		SettingsGlobal.setShowUI(parsedData.showUI == true);

		var showUI = SettingsGlobal.getShowUI();
		document.getElementById('graphs').style.display = 'none';
		document.getElementById('NoUI').style.display = (showUI ? 'none' : 'inline');
		document.getElementById('canvasSimulation').style.display = (showUI ? 'inline' : 'none');
		document.getElementById('settings').style.display = 'inline';

		document.getElementById('frame').value = 0;
		window.cancelAnimationFrame(requestID);
		requestID = undefined;
		Math.seedrandom();

		if (parsedData.command == "Teaser"){
			startTeaser();
		}
		else if (parsedData.command == "Simulation"){
			startSimulation(mode);
		}
		else if (parsedData.command == "StartTraining"){
			startTraining(mode);
		}
		else if (parsedData.command == "TestTraining"){
			testTraining(mode);
		}
		else if (parsedData.command == "ResetTraining"){
			resetTraining();
		}
	}
	
	//window.addEventListener('message', getMessage);
	startTeaser()
	// make the init function visible from outside
	window.initSimulation = initSimulation;
});