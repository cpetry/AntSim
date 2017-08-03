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

requirejs([ 'external/seedrandom/seedrandom',
			'external/setImmediate/setImmediate',
			'tutorial',
			'settingsSimulation',
			'antController'],
function   (seed, setImmediate, Tutorial, SettingsSimulation, AntController) {

	var tutorialPart = document.getElementById("tutorialPart").value;
	var defaultValues = ["return [ActionType.MOVE, DirectionType.FORWARD, rand(-60,60)];",
// MOVE Tutorial
`var nearestFood = this.getNearestObjectType(ObjectType.FOOD);
if (nearestFood !== null){
	var rotationTowardsFood = nearestFood.getRotationToObj();
	return [ActionType.MOVE, DirectionType.FORWARD, rotationTowardsFood];
}
return [ActionType.MOVE, DirectionType.FORWARD, rand(-60,60)];`,
// HARVEST tutorial
`var hive = this.getOwnHive();
var nearestFood = this.getNearestObjectType(ObjectType.FOOD);
if (nearestFood !== null && !this.memory.harvestedFood){
	if(nearestFood.canBeInteractedWith(this)){
		if (this.isFull())
			this.memory.harvestedFood = true;
		return [ActionType.HARVEST, nearestFood];
	}
	else
		return [ActionType.MOVE, DirectionType.FORWARD, nearestFood.getRotationToObj()];
}
if (this.memory.harvestedFood && hive !== null){
	return [ActionType.MOVE, DirectionType.FORWARD, hive.getRotationToObj()];
}
return [ActionType.MOVE, DirectionType.FORWARD, rand(-60,60)];`,
// TRANSFER tutorial
`var hive = this.getOwnHive();
var nearestFood = this.getNearestObjectType(ObjectType.FOOD);
if (nearestFood !== null && !this.memory.harvestedFood){
	if(nearestFood.canBeInteractedWith(this)){
		if (this.isFull())
			this.memory.harvestedFood = true;
		return [ActionType.HARVEST, nearestFood];
	}
	else
		return [ActionType.MOVE, DirectionType.FORWARD, nearestFood.getRotationToObj()];

}
if (this.memory.harvestedFood && hive !== null){
	if(hive.canBeInteractedWith(this)){
		this.memory.harvestedFood = false;
		return [ActionType.TRANSFER, hive, this.getMaxFoodStorage()];
	}
	else
		return [ActionType.MOVE, DirectionType.FORWARD, hive.getRotationToObj()];
}
return [ActionType.MOVE, DirectionType.FORWARD, rand(-60,60)];`

];
	var editor = AntController.createEditor("editor", defaultValues[tutorialPart-1])
		
	function finishedFunc(){
		document.getElementById('finished').style.display = 'block';
		window.cancelAnimationFrame(requestID);
		requestID = undefined;
	};
	
	function cheat(part){
		editor.setValue("// CHEATER! :)\n" + defaultValues[part], -1); // -1 set cursor to begin
	};

	function startTutorial(part){
		userAntFunction = new Function(editor.getValue());
		window.cancelAnimationFrame(requestID);
		requestID = undefined;
		SettingsGlobal.setShowUI(true);
		Math.seedrandom();

		var canvas = document.getElementById('canvasTutorial');
		var settings = new SettingsSimulation(AntType.CUSTOM, HiveType.DEFAULT, userAntFunction);
		new Tutorial(canvas, settings, finishedFunc, part);
	};

	document.getElementById("cheat").onclick = function(){cheat(tutorialPart)};
	document.getElementById("runTutorial").onclick = function(){startTutorial(tutorialPart)};
	
	// show default behaviour before user has coded
	startTutorial(tutorialPart);
});