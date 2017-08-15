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


var child = document.createElement('div');
child.innerHTML = `
<div style="width:850px;">
	<div style="width:550px; float:left;">
		<input type="button" value="run" id="runTutorial" >
		<input type="button" value="cheat" id="cheat" >
		<div id="customAntContainer" style="height:150px;margin:10px;">
			<pre id="editor"></pre>
		</div>
	</div>
	<div style="width:250px; float:right; text-align:center;">
		<canvas width="250" height="200" class="terrarium" id="canvasTutorial"></canvas>
		<input type="checkbox" value="speedUp" id="speedUp">SpeedUp!
		<input type="checkbox" value="debug"   id="debug">debug
	</div>
	<div style="clear:both;"></div>
</div>`

var insertNode = document.getElementById("tutorialPart");	
insertNode.parentNode.insertBefore(child, insertNode);

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
return [ActionType.MOVE, DirectionType.FORWARD, rand(-60,60)];`,
// PHEROMONE tutorial
`var hive = this.getOwnHive();
var nearestFood = this.getNearestObjectType(ObjectType.FOOD);
var isScout = (this.getGenes().sensitivity > 0.7);
var nextPheromone = this.getNextPheromoneOfType(PheromoneType.FOOD);
// ant has collided with sth -> try to walk around it
if (this.hasCollidedWithID() != -1){
	return [ActionType.MOVE, DirectionType.FORWARD, 45];
}

// return food if ant harvested some but doesn't see food source anymore
if (nearestFood === null && !this.memory.harvestedFood && this.getFoodStorage() > 0)
	this.memory.harvestedFood = true;
	
// try to find food
if ((nearestFood !== null || (nextPheromone !== null && !isScout)) && !this.memory.harvestedFood){
	if(nearestFood !== null && nearestFood.canBeInteractedWith(this)){
		this.memory.harvestedFood = this.isFull();
		this.memory.lastPheromoneSet = 0;
		return [ActionType.HARVEST, nearestFood];
	}
	else {
		if (nearestFood !== null)
			return [ActionType.MOVE, DirectionType.FORWARD, nearestFood.getRotationToObj()];
		else if (nextPheromone !== null)
			return [ActionType.MOVE, DirectionType.FORWARD, nextPheromone.getRotationToObj()+15];
	}

}

// bring food back home
if (this.memory.harvestedFood && hive !== null){
	if (isScout)
		this.memory.lastPheromoneSet +=1;
	if (this.memory.lastPheromoneSet > 25){
		this.memory.lastPheromoneSet = 0;
		return [ActionType.PHEROMONE, PheromoneType.FOOD];
	}
	if(hive.canBeInteractedWith(this)){
		this.memory.harvestedFood = false;
		return [ActionType.TRANSFER, hive, this.getMaxFoodStorage()];
	}
	else {
		return [ActionType.MOVE, DirectionType.FORWARD, hive.getRotationToObj()];
	}
}

else if (this.memory.harvestedFood && nextPheromone !== null)
	return [ActionType.MOVE, DirectionType.FORWARD, nextPheromone.getRotationToObj()];

if (isScout)
	return [ActionType.MOVE, DirectionType.FORWARD, rand(-60,60)];

return [ActionType.MOVE, DirectionType.NONE, rand(-60,60)];`];

	var editor = createEditor("editor", defaultValues[tutorialPart-1])

	function finishedFunc(){
		document.getElementById('finished').style.display = 'block';
		window.cancelAnimationFrame(requestID);
		requestID = undefined;
	};
	
	function cheat(part){
		editor.setValue("// CHEATER! :)\n" + defaultValues[part], -1); // -1 set cursor to begin
		startTutorial(part);
	};
	
	function speedUp(enabled){
		SettingsGlobal.setFramesPerSecond(enabled ? 60 : 15);
	}
	
	function debug(enabled){
		if (tutorialPart == 1){
			Debug.setVisibility(enabled);
			Debug.setShowSmellingDistance(enabled);
		}
		if (tutorialPart == 4){
			Debug.setShowFoodAmount(enabled);
			Debug.setShowPheromones(enabled);
		}
	}

	function startTutorial(part){
		userAntFunction = new Function(editor.getValue());
		window.cancelAnimationFrame(requestID);
		requestID = undefined;
		SettingsGlobal.setShowUI(true);
		Math.seedrandom();

		var canvas = document.getElementById('canvasTutorial');
		var playerSettings = [{ antType: AntType.CUSTOM, hiveType: HiveType.DEFAULT, antCode: userAntFunction, hiveCode: null}];
		var settings = new SettingsSimulation(SimulationMode.SOLO, playerSettings);
		new Tutorial(canvas, settings, finishedFunc, part);
	};

	document.getElementById("cheat").onclick = function(){cheat(tutorialPart)};
	document.getElementById("runTutorial").onclick = function(){startTutorial(tutorialPart)};
	document.getElementById("speedUp").onclick = function(){ speedUp(document.getElementById("speedUp").checked) };
	document.getElementById("debug").onclick = function(){ debug(document.getElementById("debug").checked) };
	
	// show default behaviour before user has coded
	startTutorial(tutorialPart);
});