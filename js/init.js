
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

function showSimulation(){
	document.getElementById('simulationSandbox').style.display = 'block';
	document.getElementById('editorContainer').style.display = 'none';
	document.getElementById('simulationOptions').style.display = 'none';
}

function showSimulationOptions(){
	document.getElementById('simulationSandbox').style.display = 'none';
	document.getElementById('editorContainer').style.display = 'none';
	document.getElementById('simulationOptions').style.display = 'block';
	document.getElementById('simulationButtons').style.display = 'none';
	document.getElementById('trainingButtons').style.display = 'none';
}

function showSimulationEditor(){
	document.getElementById('simulationSandbox').style.display = 'none';
	document.getElementById('editorContainer').style.display = 'block';
	document.getElementById('simulationOptions').style.display = 'none';
	document.getElementById('simulationButtons').style.display = 'block';
	document.getElementById('trainingButtons').style.display = 'none';
}

function showTraining(){
	document.getElementById('simulationSandbox').style.display = 'none';
	document.getElementById('editorContainer').style.display = 'block';
	document.getElementById('simulationOptions').style.display = 'none';
	document.getElementById('simulationButtons').style.display = 'none';
	document.getElementById('trainingButtons').style.display = 'block';
}

function simulationClicked(){
	runState = true;
	document.getElementById('mode').innerHTML = "Simulation";
	document.getElementById('floatingContainer').style.display = 'none';
	showSimulationOptions();
}

function trainingClicked(){
	document.getElementById('mode').innerHTML = "Training";
	document.getElementById('floatingContainer').style.display = 'none';
	showSimulationOptions();
}

function aboutClicked(){
	document.getElementById('message').src = "./user-code_doc/index.html";
	document.getElementById('floatingContainer').style.display = 'block';
}

function apiClicked(){
	document.getElementById('message').src = "./user-code_doc/global.html";
	document.getElementById('floatingContainer').style.display = 'block';
}

function tutorialClicked(){
	window.open('./user-code_doc/tutorial-00_basics.html');
	/*
	document.getElementById('message').src = "./user-code_doc/tutorial-00_basics.html";
	document.getElementById('floatingContainer').style.display = 'block';*/
}

function closeMessage(){
	document.getElementById('floatingContainer').style.display = 'none';
}

function simulationModeChanged(mode){
	if (mode == SimulationMode.COMPETITIVE)
		document.getElementById('typesEnemy').style.display = 'block';
	else
		document.getElementById('typesEnemy').style.display = 'none';
}


function changeEditorCode(antType){
	if (antType == AntType.SIMPLE)
		editor.setValue(simpleAntCode, -1);
	else if (antType == AntType.NEURALNET)
		editor.setValue(neuralNetworkAntCode, -1);
	else
		editor.setValue(defaultValue, -1);
}
	
function getAutoCompletionWordList(){
	return ["getFoodStorage()",
			"getLife()", 
			"getMaxFoodStorage()",
			"getNearestEnemyAnt()",
			"getNearestObjectType()",
			"getObjectOfID()",
			"getOwnHive()",
			"getParentID()",
			"getSmelledObjs()",
			"getVisibleObjs()", 
			];
}

function getSimulationMode(){
	var radios = document.getElementsByName('simulationMode');
	var modeValue = SimulationMode.SOLO;
	for (var i = 0, length = radios.length; i < length; i++) {
		if (radios[i].checked) {
			// do whatever you want with the checked radio
			modeValue = radios[i].value;
			// only one radio can be logically checked, don't check the rest
			break;
		}
	}
	return modeValue;
}

function simulate(commandString) {
	var frame = document.getElementById('simulationSandbox');	
	var showUIvalue = document.getElementById("showUI").checked;
	var playerSettings = [];
	var simulationModeValue = getSimulationMode();
	
    if (commandString == "Teaser"){
		showUIvalue = true;
		playerSettings.push({ antType: AntType.CUSTOM, hiveType: HiveType.DEFAULT, antCode: simpleAntCode, hiveCode: null});
	}
	else {
		function addPlayer(type){
			type = parseInt(type)
			var antCodeString = "";
			if (type == AntType.CUSTOM)
				antCodeString = editor.getValue();
			else if (type == AntType.SIMPLE)
				antCodeString = simpleAntCode;
			else if (type == AntType.NEURALNET)
				antCodeString = neuralNetworkAntCode;
			else
				throw new TypeError("AntType incorrect! (" + type + ")")
			playerSettings.push({ antType: type, hiveType: HiveType.DEFAULT, antCode: antCodeString, hiveCode: null});
		}
		addPlayer.call(this, document.getElementById('AntTypeSelf').value);

		if (simulationModeValue == SimulationMode.COMPETITIVE){
			addPlayer.call(this, document.getElementById('AntTypeEnemy').value);
		}
	}
	// Note that we're sending the message to "*", rather than some specific
	// origin. Sandboxed iframes which lack the 'allow-same-origin' header
	// don't have an origin which you can target: you'll have to send to any
	// origin, which might alow some esoteric attacks. Validate your output!
	var message = {command : commandString, mode : simulationModeValue, playerSettings : playerSettings, showUI : showUIvalue};
	if (window.location.protocol == 'file:')
		frame.contentWindow.postMessage( message, '*');
	else frame.contentWindow.postMessage( message, 'https://cpetry.github.io/AntSim/simulation.html');
}

function startSimulation(mode){
	document.getElementById('mode').innerHTML = mode;
	showSimulation();
	document.getElementById('floatingContainer').style.display = 'none';
	simulate(mode);
}

function setupDone(){
	var mode = document.getElementById('mode').innerHTML;
	var simulationModeValue = getSimulationMode();
	if (mode == "Simulation"){
		showSimulationEditor();
	}
	else if (mode == "Training")
		showTraining();
}

function runClicked(){
	if (runState == true){
		startSimulation("Simulation");
		runState = false;
	}
	else
		simulationClicked();
	
	// toggle current run state
	document.getElementById('runButton').value = (runState ? 'stop' : 'run')
}

var runState = true;
var defaultValue = "return [ActionType.MOVE, DirectionType.FORWARD, rand(-30,30)];"
var editor = createEditor("editor", defaultValue);

document.getElementById("runButton").onclick           = function(){ runClicked() };
document.getElementById("nextButton").onclick          = function(){ setupDone() };
document.getElementById("teaserButton").onclick        = function(){ startSimulation("Teaser") };
document.getElementById("startTrainingButton").onclick = function(){ startSimulation("StartTraining") };
document.getElementById("testTrainingButton").onclick  = function(){ startSimulation("TestTraining") };
document.getElementById("resetTrainingButton").onclick = function(){ startSimulation("ResetTraining") };
document.getElementById("AntTypeSelf").onchange = function(){ changeEditorCode(this.value)};

var radios = document.getElementsByName('simulationMode');
for(var i = 0; i < radios.length; i++) {
	radios[i].onclick = function() { simulationModeChanged(this.value); }; // "this" is here the radio button element
}

// TODO try to find a better solution
//window.addEvent("domready",function(){ startSimulation("Teaser") });
window.onload = function(){ startSimulation("Teaser") };