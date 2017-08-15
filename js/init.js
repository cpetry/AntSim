
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

function showSimulationEditor(){
	document.getElementById('simulationSandbox').style.display = 'none';
	document.getElementById('editorContainer').style.display = 'block';
	document.getElementById('simulationOptions').style.display = 'block';
	document.getElementById('simulationButtons').style.display = 'block';
	document.getElementById('trainingButtons').style.display = 'none';
}

function showTraining(){
	document.getElementById('simulationSandbox').style.display = 'none';
	document.getElementById('editorContainer').style.display = 'block';
	document.getElementById('simulationOptions').style.display = 'block';
	document.getElementById('simulationButtons').style.display = 'none';
	document.getElementById('trainingButtons').style.display = 'block';
}

function simulationClicked(){
	runState = true;
	document.getElementById('mode').innerHTML = "Simulation";
	document.getElementById('floatingContainer').style.display = 'none';
	showSimulationEditor();
}

function trainingClicked(){
	document.getElementById('mode').innerHTML = "Training";
	document.getElementById('floatingContainer').style.display = 'none';
	showTraining();
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


function changeEditorCode(){
	var antType = document.getElementById("AntType").value;
	if (antType == "Simple")
		editor.setValue(simpleAntCode, -1);
	else if (antType == "NeuralNet")
		editor.setValue(neuralNetworkAntCode, -1);
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

function simulate(commandString) {
	var frame = document.getElementById('simulationSandbox');	
	var showUIvalue = document.getElementById("showUI").checked;
	var codeString = editor.getValue();
	var modeValue = SimulationMode.SOLO;
	
	var radios = document.getElementsByName('simulationMode');
	for (var i = 0, length = radios.length; i < length; i++) {
		if (radios[i].checked) {
			// do whatever you want with the checked radio
			modeValue = radios[i].value;
			// only one radio can be logically checked, don't check the rest
			break;
		}
	}
	
    if (commandString == "Teaser"){
		showUIvalue = true;
		codeString = simpleAntCode;
	}
	
	// Note that we're sending the message to "*", rather than some specific
	// origin. Sandboxed iframes which lack the 'allow-same-origin' header
	// don't have an origin which you can target: you'll have to send to any
	// origin, which might alow some esoteric attacks. Validate your output!
	var message = {command : commandString, mode : modeValue, code : codeString, showUI : showUIvalue};
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
document.getElementById("teaserButton").onclick        = function(){ startSimulation("Teaser") };
document.getElementById("startTrainingButton").onclick = function(){ startSimulation("StartTraining") };
document.getElementById("testTrainingButton").onclick  = function(){ startSimulation("TestTraining") };
document.getElementById("resetTrainingButton").onclick = function(){ startSimulation("ResetTraining") };
document.getElementById("AntType").onchange = changeEditorCode;

// TODO try to find a better solution
//window.addEvent("domready",function(){ startSimulation("Teaser") });
window.onload = function(){ startSimulation("Teaser") };