var Mode = {
	TEASER : 0,
	TUTORIAL : 1,
	SIMULATION : 2
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

Message.container = document.getElementById('message');
SettingsGlobal.setFramesPerSecond(document.getElementById('fps').value);

Debug.setShowLife(document.getElementById('debugShowLife').checked);
Debug.setVisibility(document.getElementById('debugVisibility').checked);
Debug.setShowCollider(document.getElementById('debugCollider').checked);
Debug.setShowFoodAmount(document.getElementById('debugFoodAmount').checked);
Debug.setShowSmellingDistance(document.getElementById('debugSmellingDistance').checked);
Debug.setShowSmelledObjectsPosition(document.getElementById('debugSmelledObjectsPosition').checked);

var mode;
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
customAntEditor.setValue("return [ActionType.WALK, Direction.FORWARD, rand(-0.5,0.5)];");

var userAntFunction = new Function(customAntEditor.getValue());
var userHiveFunction;
var selectedTutorialPart = 0;
window.onload = function(){
	startTeaser();
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
	document.getElementById('editorButtons').style.visibility = 'hidden';
}

function showEditor(){
	document.getElementById('graphs').style.display = 'none';
	document.getElementById('terrarium').style.display = 'none';
	document.getElementById('customAntContainer').style.display = 'block';
	document.getElementById('NoUI').style.display = 'none';
	document.getElementById('editorButtons').style.visibility = 'visible';
}

function showNoUI(){
	document.getElementById('graphs').style.display = 'none';
	document.getElementById('terrarium').style.display = 'none';
	document.getElementById('customAntContainer').style.display = 'none';
	document.getElementById('NoUI').style.display = 'block';
	document.getElementById('editorButtons').style.visibility = 'hidden';
}

function setUI(show){
	var show = document.getElementById('showUI').checked;	SettingsGlobal.setShowUI(show);
	if (show)
		showSimulation();
	else
		if (Simulation.isFinished)
			showGraph();
		else
			showNoUI();
}

function run(){
	userAntFunction = new Function(customAntEditor.getValue());

	if (mode == Mode.TEASER)
		startTeaser();
    else if (mode == Mode.TUTORIAL)
		startTutorialPart(selectedTutorialPart);
	else if (mode == Mode.SIMULATION)
		startSimulation();
}

function startTutorialPart(part){
	document.getElementById('showUI').checked = true;
	showSimulation();
	Math.seedrandom(document.getElementById('seed').value);
	new Tutorial(part);
}

function startTeaser(){
	SettingsGlobal.setShowUI(true);
	document.getElementById('showUI').checked = true;
	showSimulation();
	Math.seedrandom();

	var antType = document.getElementById("AntType").value;
	if (antType == "Neural Net")
		new Simulation(AntType.NEURALNET);
	else
		new Simulation(AntType.SIMPLE);
}

function startSimulation(){
	document.getElementById('showUI').checked = false;
	Math.seedrandom(document.getElementById('seed').value);
	new Simulation(AntType.CUSTOM);
}


function simulationClicked(){
	Message.hideMessage();
	document.getElementById('frame').value = 0;
	document.getElementById('tutorial').style.visibility = 'hidden';
	mode = Mode.SIMULATION;
	window.cancelAnimationFrame(requestID);
	requestID = undefined;
	showEditor();
}

function teaserClicked(){
	Message.hideMessage();
	document.getElementById('frame').value = 0;
	document.getElementById('tutorial').style.visibility = 'hidden';
	mode = Mode.TEASER;
	window.cancelAnimationFrame(requestID);
	requestID = undefined;
	startTeaser();
}

function tutorialClicked(){
	Message.hideMessage();
	document.getElementById('frame').value = 0;
	document.getElementById('tutorial').style.visibility = 'visible';
	mode = Mode.TUTORIAL;
	selectedTutorialPart = 0;
	window.cancelAnimationFrame(requestID);
	requestID = undefined;
	Message.tutorial0();
	showEditor();
}

function editorClicked(){
	Message.hideMessage();
	document.getElementById('frame').value = 0;
	window.cancelAnimationFrame(requestID);
	requestID = undefined;
	showEditor();
}
