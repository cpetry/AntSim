var requestID;
var	userAntFunction;

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

SettingsGlobal.setFramesPerSecond(15);
//Debug.setVisibility(true);
//Debug.setShowSmellingDistance(true);

requirejs([ 'external/seedrandom/seedrandom',
			'external/setImmediate/setImmediate',
			'tutorial',
			'settingsSimulation',
			'antController'],
function   (seed, setImmediate, Tutorial, SettingsSimulation, AntController) {

	var defaultValue = "return [ActionType.MOVE, DirectionType.FORWARD, rand(-60,60)];"
	var editor = AntController.createEditor("editor", defaultValue)
		
	function finishedFunc(){
		document.getElementById('finished').style.display = 'block';
		window.cancelAnimationFrame(requestID);
		requestID = undefined;
	};
	
	function showSolution(){
		editor.setValue(`// CHEATER! :)
var nearestFood = this.getNearestObjectType(ObjectType.FOOD);
if (nearestFood !== null){
	var rotationTowardsFood = nearestFood.getRotationToObj();
	return [ActionType.MOVE, DirectionType.FORWARD, rotationTowardsFood];
}
return [ActionType.MOVE, DirectionType.FORWARD, rand(-60,60)];`)
	};

	function startTutorial(){
		userAntFunction = new Function(editor.getValue());
		window.cancelAnimationFrame(requestID);
		requestID = undefined;
		SettingsGlobal.setShowUI(true);
		Math.seedrandom();

		//userAntFunction = new Function(customAntEditor.getValue());
		var canvas = document.getElementById('canvasTutorial');
		var settings = new SettingsSimulation(AntType.CUSTOM, HiveType.DEFAULT, userAntFunction);
		new Tutorial(canvas, settings, finishedFunc);
	};

	document.getElementById("showSolution").onclick = showSolution;
	document.getElementById("runTutorial").onclick = startTutorial;
	// show default behaviour before user has coded
	startTutorial();
});