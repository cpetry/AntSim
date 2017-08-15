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
	document.getElementById('canvasContainer').style.display = (show ? 'none' : 'inline');
	document.getElementById('graphs').style.display = (show ? 'block' : 'none');
	document.getElementById('NoUI').style.display = (show ? 'none' : 'inline');
	document.getElementById('settings').style.display = (show ? 'none' : 'inline');
}

SettingsGlobal.setFramesPerSecond(document.getElementById('fps').value);

userAntFunction = new Function(simpleAntCode);


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
		var settings = new SettingsSimulation(SimulationMode.COMPETITIVE, 
						AntType.CUSTOM, HiveType.DEFAULT, userAntFunction);
		new Simulation(canvas, settings);
	}

	function startSimulation(mode){
		console.log("Simulation")
		var settings = new SettingsSimulation(mode, AntType.CUSTOM, HiveType.DEFAULT, userAntFunction);
		new Simulation(canvas, settings);
	}

	function startTraining(mode){
		console.log("startTraining")
		SettingsGlobal.setShowUI(true);
		SettingsGlobal.setFramesPerSecond(60);
		training.start(mode, userAntFunction);
	}

	function testTraining(mode){
		console.log("testTraining")
		SettingsGlobal.setShowUI(true);
		training.test(mode, userAntFunction);
	}

	function resetTraining(){
		console.log("resetTraining")
		training.reset();
	}
	
	function getMessage(e){
		if ((window.location.protocol != 'file:') 
		&& e.origin != "https://cpetry.github.io"){
			console.log("Message blocked from: " + e.origin)
			return;
		}
		var result = '';
		var parsedData = e.data;
		var command;
		var mode = SimulationMode.SOLO;
		
		// setImmediate() uses postMessage! We therefor have to intercept this message here.
		if ((typeof parsedData === 'string' || parsedData instanceof String) 
		&& parsedData.startsWith("setImmediate")){
			return;
		}
		
		try {
			command = parsedData.command;
			mode = parsedData.mode;
			userAntFunction = new Function(parsedData.code);
			SettingsGlobal.setShowUI(parsedData.showUI == true);
		} catch (err) {
			console.log("postMessage didn't work with: " + err);
		}
		var showUI = SettingsGlobal.getShowUI();
		document.getElementById('graphs').style.display = 'none';
		document.getElementById('NoUI').style.display = (showUI ? 'none' : 'inline');
		document.getElementById('canvasContainer').style.display = (showUI ? 'inline' : 'none');
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
	
	window.addEventListener('message', getMessage);
	startTeaser()
});