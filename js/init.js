var Mode = {
	TEASER : 0,
	TUTORIAL : 1
}

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
SettingsGlobal.setAutoIterateFrames(document.getElementById('autoFrame').checked);
SettingsGlobal.setShowUI(document.getElementById('showUI').checked);

Debug.setShowLife(document.getElementById('debugShowLife').checked);
Debug.setVisibility(document.getElementById('debugVisibility').checked);
Debug.setShowCollider(document.getElementById('debugCollider').checked);
Debug.setShowFoodAmount(document.getElementById('debugFoodAmount').checked);
Debug.setShowSmellingDistance(document.getElementById('debugSmellingDistance').checked);
Debug.setShowSmelledObjects(document.getElementById('debugSmelledObjects').checked);

var mode;
var sim;
var requestID;
var customAntEditor = ace.edit("editor");
customAntEditor.setTheme("ace/theme/chrome");
customAntEditor.session.setMode("ace/mode/javascript");
var userFunction;

window.onload = function(){
	switchAntType();
}

function switchAntType(){
	if (document.getElementById('AntType').value == 'Simple'){
		document.getElementById('customAntContainer').style.display = 'none';
		document.getElementById('graphs').style.display = 'none';
		document.getElementById('terrarium').style.display = 'block';
		startSimulation();
	}
	else{
		document.getElementById('graphs').style.display = 'none';
		document.getElementById('terrarium').style.display = 'none';
		document.getElementById('customAntContainer').style.display = 'block';
		reset();
	}
}

function showGraph(){
	document.getElementById('terrarium').style.display = 'none';
	document.getElementById('graphs').style.display = 'block';
}

function showSimulation(){
	document.getElementById('terrarium').style.display = 'block';
	document.getElementById('graphs').style.display = 'none';
}

function reset(){
	if (mode == Mode.TEASER)
		sim = new Simulation();
    else if (mode == Mode.TUTORIAL)
		sim = new TutorialRunCircle();
	else
		sim = new Simulation();

	SettingsGlobal.setAutoIterateFrames(true);
	sim.clear();
	sim.draw();
	sim.loop();
}

function run(){
	userFunction = new Function(customAntEditor.getValue());

	if (mode == Mode.TEASER)
		startSimulation();
    else if (mode == Mode.TUTORIAL){
		showSimulation();
		startTutorial();
		SettingsGlobal.setAutoIterateFrames(true);
		sim = new TutorialRunCircle();
		sim.init();
		sim.clear();
		sim.draw();
		sim.loop();
	}
	else
		startSimulation();
}

function startSimulation(){
	showSimulation();
	window.cancelAnimationFrame(requestID);
	requestID = undefined;
	SettingsGlobal.setAutoIterateFrames(true);
	Math.seedrandom(document.getElementById('seed').value);
	mode = Mode.TEASER;
	sim = new Simulation();
	sim.init();
	sim.clear();
	sim.draw();
	sim.loop();
}

function startTutorial(){
	document.getElementById('AntType').value = "Custom"
	window.cancelAnimationFrame(requestID);
	requestID = undefined;
	mode = Mode.TUTORIAL;
}