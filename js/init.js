
var requestID;
var userAntFunction;

window.requestAnimationFrame = function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        function(f) {
            window.setTimeout(f,1);
        }
}();


SettingsGlobal.setFramesPerSecond(document.getElementById('fps').value);

Debug.setShowLife(document.getElementById('debugShowLife').checked);
Debug.setVisibility(document.getElementById('debugVisibility').checked);
Debug.setShowCollider(document.getElementById('debugCollider').checked);
Debug.setShowFoodAmount(document.getElementById('debugFoodAmount').checked);
Debug.setShowSmellingDistance(document.getElementById('debugSmellingDistance').checked);
Debug.setShowSmelledObjectsPosition(document.getElementById('debugSmelledObjectsPosition').checked);


function showGraph(){
	document.getElementById('terrariumContainer').style.display = 'none';
	document.getElementById('graphs').style.display = 'block';
	document.getElementById('customAntContainer').style.display = 'none';
	document.getElementById('NoUI').style.display = 'none';
	document.getElementById('trainingContainer').style.visibility = 'hidden';
}

function showSimulation(){
	document.getElementById('terrariumContainer').style.display = 'block';
	document.getElementById('graphs').style.display = 'none';
	document.getElementById('customAntContainer').style.display = 'none';
	document.getElementById('NoUI').style.display = 'none';
	document.getElementById('editorButtons').style.visibility = 'hidden';
	document.getElementById('trainingContainer').style.visibility = 'hidden';
}

function showEditor(){
	document.getElementById('graphs').style.display = 'none';
	document.getElementById('terrariumContainer').style.display = 'none';
	document.getElementById('customAntContainer').style.display = 'block';
	document.getElementById('NoUI').style.display = 'none';
	document.getElementById('editorButtons').style.visibility = 'visible';
	document.getElementById('trainingContainer').style.visibility = 'hidden';
}

function showNoUI(){
	document.getElementById('graphs').style.display = 'none';
	document.getElementById('terrariumContainer').style.display = 'none';
	document.getElementById('customAntContainer').style.display = 'none';
	document.getElementById('NoUI').style.display = 'block';
	document.getElementById('editorButtons').style.visibility = 'hidden';
	document.getElementById('trainingContainer').style.visibility = 'hidden';
}

function showTraining(){
	document.getElementById('graphs').style.display = 'none';
	document.getElementById('terrariumContainer').style.display = 'block';
	document.getElementById('customAntContainer').style.display = 'none';
	document.getElementById('NoUI').style.display = 'none';
	document.getElementById('editorButtons').style.visibility = 'hidden';
	document.getElementById('trainingContainer').style.visibility = 'visible';
}

function simulationClicked(){
	document.getElementById('floatingContainer').style.display = 'none';
	document.getElementById('frame').value = 0;
	window.cancelAnimationFrame(requestID);
	requestID = undefined;
	showEditor();
}

function trainingClicked(){
	document.getElementById('floatingContainer').style.display = 'none';
	document.getElementById('frame').value = 0;
	window.cancelAnimationFrame(requestID);
	requestID = undefined;
	showTraining();
}

function aboutClicked(){
	document.getElementById('message').src = "./user-code_doc/index.html";
	document.getElementById('floatingContainer').style.display = 'block';
}

function tutorialClicked(){
	document.getElementById('message').src = "./user-code_doc/tutorial-00_basics.html";
	document.getElementById('floatingContainer').style.display = 'block';
}

function closeMessage(){
	document.getElementById('floatingContainer').style.display = 'none';
}

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
			'simulation','settingsSimulation', 'training','ant','hive','antController'],
function   (seed, setImmediate, Simulation, SettingsSimulation, Training, Ant, Hive, AntController) {

	var canvas = document.getElementById('canvasSimulation')
	var defaultValue = "return [ActionType.MOVE, DirectionType.FORWARD, rand(-30,30)];"
	var editor = AntController.createEditor("editor", defaultValue)

	var training = new Training(canvas);
	
	function startTeaser(){
		document.getElementById('floatingContainer').style.display = 'none';
		document.getElementById('frame').value = 0;
		window.cancelAnimationFrame(requestID);
		requestID = undefined;
		SettingsGlobal.setShowUI(true);
		document.getElementById('showUI').checked = true;
		showSimulation();
		Math.seedrandom();
		var settings = new SettingsSimulation(AntType.SIMPLE, HiveType.DEFAULT);
		new Simulation(canvas, settings);
	}

	function run(){
		userAntFunction = new Function(editor.getValue());
		//SettingsGlobal.setShowUI(false);
		showSimulation();
		Math.seedrandom(document.getElementById('seed').value);
		var settings = new SettingsSimulation(AntType.CUSTOM, HiveType.DEFAULT, userAntFunction);
		new Simulation(canvas, settings);
	}

	function startTraining(){
		var antType = document.getElementById("AntType").value;
		if (antType == "Simple")
			training.start(AntType.SIMPLE);
		else if (antType == "NeuralNet")
			training.start(AntType.NEURALNET);
		else if (antType == "Custom")
			training.start(AntType.CUSTOM);
	}

	function testTraining(){
		var antType = document.getElementById("AntType").value;
		if (antType == "Simple")
			training.test(AntType.SIMPLE);
		else if (antType == "NeuralNet")
			training.test(AntType.NEURALNET);
		else if (antType == "Custom")
			training.test(AntType.CUSTOM);
	}

	function resetTraining(){
		training.reset();
	}

	document.getElementById("runButton").onclick = run;
	document.getElementById("teaserButton").onclick = startTeaser;
	document.getElementById("startTrainingButton").onclick = startTraining;
	document.getElementById("testTrainingButton").onclick = testTraining;
	document.getElementById("resetTrainingButton").onclick = resetTraining;
	

	startTeaser();

});
