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
setNoUI();

Debug.setShowLife(document.getElementById('debugShowLife').checked);
Debug.setVisibility(document.getElementById('debugVisibility').checked);
Debug.setShowCollider(document.getElementById('debugCollider').checked);
Debug.setShowFoodAmount(document.getElementById('debugFoodAmount').checked);
Debug.setShowSmellingDistance(document.getElementById('debugSmellingDistance').checked);

var mode;
var sim;
var requestID;
var lang = ace.require("ace/ext/language_tools");
lang.setCompleters();
var antControllerWordCompleter = {
    getCompletions: function(editor, session, pos, prefix, callback) {
		var wordList = AntController.getAutoCompletionWordList();
		callback(null, wordList.map(function(word) {
			return {
				caption: word,
				value: word,
				meta: "This ant"
			};
		}));
    }
}
var globalWordCompleter = {
    getCompletions: function(editor, session, pos, prefix, callback) {
		var wordList = ["this."];
		callback(null, wordList.map(function(word) {
			return {
				caption: word,
				value: word,
				meta: "global"
			};
		}));
    }
}
var customAntEditor = ace.edit("editor");
customAntEditor.setTheme("ace/theme/chrome");
customAntEditor.session.setMode("ace/mode/javascript");
customAntEditor.setOptions({
    enableBasicAutocompletion: true,
});
customAntEditor.completers = [globalWordCompleter, antControllerWordCompleter];

var userAntFunction;
var userHiveFunction;
var selectedTutorialPart = 0;
window.onload = function(){
	document.getElementById('AntType').value = 'Simple'
	startSimulation();
}

function switchAntType(){
	reset();
	if (document.getElementById('AntType').value == 'Simple'){
		startSimulation();
	}
	else{
		showEditor();
	}
}

function showGraph(){
	document.getElementById('terrarium').style.display = 'none';
	document.getElementById('graphs').style.display = 'block';
	document.getElementById('customAntContainer').style.display = 'none';
	document.getElementById('NoUI').style.display = 'none';
}

function showSimulation(){
	document.getElementById('terrarium').style.display = 'block';
	document.getElementById('graphs').style.display = 'none';
	document.getElementById('customAntContainer').style.display = 'none';
	document.getElementById('NoUI').style.display = 'none';
}

function showEditor(){
	document.getElementById('graphs').style.display = 'none';
	document.getElementById('terrarium').style.display = 'none';
	document.getElementById('customAntContainer').style.display = 'block';
	document.getElementById('NoUI').style.display = 'none';
}

function showNoUI(){
	document.getElementById('graphs').style.display = 'none';
	document.getElementById('terrarium').style.display = 'none';
	document.getElementById('customAntContainer').style.display = 'none';
	document.getElementById('NoUI').style.display = 'block';
}

function setNoUI(){
	var show = document.getElementById('showUI').checked;
	SettingsGlobal.setShowUI(show);
	if (show)
		showSimulation();
	else
		showNoUI();
}

function reset(){
	if (mode == Mode.TEASER)
		sim = new Simulation();
    else if (mode == Mode.TUTORIAL)
		sim = new Tutorial();
	else
		sim = new Simulation();

	sim.clear();
	sim.draw();
	sim.loop();
}

function run(){
	userAntFunction = new Function(customAntEditor.getValue());

	if (mode == Mode.TEASER)
		startSimulation();
    else if (mode == Mode.TUTORIAL)
		startTutorialPart(selectedTutorialPart);
	else
		startSimulation();
}

function setupTutorialPart(part){
	document.getElementById('tutorial').style.display = 'block';
	selectedTutorialPart = part;
	document.getElementById('AntType').value = "Custom"
	window.cancelAnimationFrame(requestID);
	requestID = undefined;
	mode = Mode.TUTORIAL;
	showEditor();
}

function startTutorialPart(part){
	document.getElementById('showUI').checked = true;
	showSimulation();
	window.cancelAnimationFrame(requestID);
	requestID = undefined;
	Math.seedrandom(document.getElementById('seed').value);
	sim = new Tutorial(part);
	sim.init();
	sim.clear();
	sim.draw();
	sim.loop();	
}

function startSimulation(){
	document.getElementById('tutorial').style.display = 'none';
	window.cancelAnimationFrame(requestID);
	requestID = undefined;
	Math.seedrandom(document.getElementById('seed').value);
	mode = Mode.TEASER;
	sim = new Simulation();
	sim.init();
	sim.clear();
	sim.draw();
	sim.loop();
}

function simulationClicked(){
	setNoUI();
	startSimulation();
}

function tutorialClicked(){
	setupTutorialPart(0);
}