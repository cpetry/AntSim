var neuralNetworkAntCode = `
this.minimumFoodStorage = this.getMaxFoodStorage() * 0.14;

const NetworkAction = {
	ATTACK_NEAREST_ANT : 0,
	RUN_LEFT : 1,
	RUN_STRAIGHT : 2,
	RUN_RIGHT : 3,
	HARVEST_NEAREST_FOOD : 4,
	GIVE_FOOD_TO_HIVE : 5,
	ATTACK_SPIDER : 6
};

function createFeatureVector() {
	
	var visibleObjects = this.getVisibleObjs();
	var smellableObjects = this.getSmelledObjs();

	var degreePerArea = 60;
	var degreeShift = degreePerArea / 2;
	var subAreas = 360/degreePerArea;

	var antList = new Array(subAreas);
	var foodList = new Array(subAreas);
	var hiveList = new Array(subAreas);
	var spiderList = new Array(subAreas);

	for (var i = 0; i < subAreas; ++i)
		antList[i] = foodList[i] = hiveList[i] = spiderList[i] = 0;
	
	var objsCategories = [this.visibleObjs, this.smelledObjs];
	for (var objs in objsCategories) {
		for (var id in objsCategories[objs]) {
			var rotation = objsCategories[objs][id].getRotationToObj() + degreeShift;
			while (rotation < 0) rotation += 360;
			while (rotation >= 360) rotation -= 360;
			var targetArea = Math.floor(rotation / degreePerArea);
			var isEnemy = objsCategories[objs][id].getParentID() != this.getParentID();

			if(objsCategories[objs][id].getObjectType() == ObjectType.ANT) {
				antList[targetArea] += (isEnemy) ? 1 : -1;
			} else if (objsCategories[objs][id].getObjectType() == ObjectType.FOOD) {
				foodList[targetArea] += 1;
			} else if (objsCategories[objs][id].getObjectType() == ObjectType.HIVE) {
				hiveList[targetArea] += (isEnemy) ? -1 : 1;
			} else if (objsCategories[objs][id].getObjectType() == ObjectType.SPIDER) {
				spiderList[targetArea] += -1;
			}
		}
	}
	
	// Normalization
	for (var i = 0; i < antList.length; ++i) {
		antList[i] = Math.min(Math.max(-5,antList[i]),5)/5.;
		foodList[i] = Math.min(Math.max(-4,foodList[i]),4)/4.;
		hiveList[i] = Math.min(Math.max(-2,hiveList[i]),2)/2.;
		spiderList[i] = Math.min(Math.max(-10,spiderList[i]),10)/10.;
	}

	var additionalList = [(this.hasCollidedWithID() == -1) ? 1 : -1, this.getFoodStorage()/this.getMaxFoodStorage(), (this.wasAttacked ? -1 : 1)];
	var inputSet = antList.concat(foodList.concat(hiveList.concat(spiderList.concat(additionalList))));

	if (this.neuralNetwork.newNetwork) {
		this.neuralNetwork.initNetwork(inputSet.length, 10, NetworkAction.length);
	}

	//console.log(inputSet.length);
	
	var outputSet = this.neuralNetwork.network.activate(inputSet);
	var networkAnswer = {input: inputSet, output: outputSet, chosenAction: -1};
	return networkAnswer;
}

function chooseAction(networkAnswer){
	//console.log(networkAnswer)
	// Chose action
	
	var foodGivingToHive = Math.max(this.getFoodStorage() - this.minimumFoodStorage,0);
	
	var networkOutput = networkAnswer.output;
	var maxAction = argmax(networkOutput);


	// Sort actions by value
	var actionList = [0,1,2,3,4,5];
	actionList.sort(function(a,b){return networkOutput[b] - networkOutput[a];});

	var continiousSum = 0;
	for (var i = 0; i < networkOutput.length; ++i)
		continiousSum += networkOutput[i];

	var randomChosen = rand(0,1) * continiousSum;
	//console.log(randomChosen)

	var actionTuple = null;

	var currentSum = 0;
	for (var j = 0; j < actionList.length; ++j) {

		var action = actionList[j];

		// Randomly chosen action
		currentSum += networkOutput[action];
		if (currentSum < randomChosen)
			continue;

		if (action == NetworkAction.ATTACK_NEAREST_ANT) {
			var prey = this.getNearestEnemyAnt();
			if (prey != null) {
				if (prey.canBeInteractedWith(this)) {
					return [ActionType.ATTACK, prey]
				} else {
					var fromObjToDirRad = prey.getRotationToObj();
					actionTuple = [ActionType.MOVE, DirectionType.FORWARD, fromObjToDirRad];
				}
			}
		} else if (action == NetworkAction.RUN_LEFT) {
			actionTuple = [ActionType.MOVE, DirectionType.FORWARD, -30];
		} else if (action == NetworkAction.RUN_STRAIGHT) {
			actionTuple = [ActionType.MOVE, DirectionType.FORWARD,   0];
		} else if (action == NetworkAction.RUN_RIGHT) {
			actionTuple = [ActionType.MOVE, DirectionType.FORWARD,  30];
		} else if (action == NetworkAction.HARVEST_NEAREST_FOOD) {

			var nearestFood = this.getNearestObjectType(ObjectType.FOOD);
			if (nearestFood != null) {

				var canBeHarvested = nearestFood.canBeInteractedWith(this);
				var isFull = (this.getFoodStorage() == this.getMaxFoodStorage());
				var canHarvestMore = (this.getFoodStorage() < this.getMaxFoodStorage());

				// harvest food if possible
				if (canHarvestMore) {
					if(canBeHarvested){
						actionTuple = [ActionType.HARVEST, nearestFood];
					} else {
						// MOVE towards food
						var fromObjToDirRad = nearestFood.getRotationToObj();
						actionTuple = [ActionType.MOVE, DirectionType.FORWARD, fromObjToDirRad];
					}
				}
			}

		} else if (action == NetworkAction.GIVE_FOOD_TO_HIVE) {

			var hive = this.getOwnHive();
			if (hive != null){

				// harvest food if possible
				if(hive.canBeInteractedWith(this)){
					actionTuple = [ActionType.TRANSFER, hive, foodGivingToHive];
				} else {
					// MOVE towards hive
					var fromObjToDirRad = hive.getRotationToObj();
					actionTuple = [ActionType.MOVE, DirectionType.FORWARD, fromObjToDirRad];
				}
			}
		}
		else if (action == NetworkAction.ATTACK_SPIDER) {

			var spider = this.getNearestObjectType(ObjectType.SPIDER);
			if (spider != null){

				// attack spider if possible
				if (spider.canBeInteractedWith(this)) {
					return [ActionType.ATTACK, spider]
				} else {
					var fromObjToDirRad = spider.getRotationToObj();
					actionTuple = [ActionType.MOVE, DirectionType.FORWARD, fromObjToDirRad];
				}
			}
		}

		if (actionTuple != null) {
			networkAnswer.chosenAction = action;
			break;
		}

	}
	
	this.firstChoice.push(networkAnswer.chosenAction == maxAction);

	return actionTuple;
}

function reinforcementLearning(networkAnswer){
	// Reward and reinforcement learning
	var reward = 0;

	if (this.memory.lastLife == -1)
		this.memory.lastLife = this.getLife();

	if (this.getLife() < this.memory.lastLife - 5) {
		reward += -0.1;
		this.memory.lastLife = this.getLife();
	}
	if (this.getFoodStorage() > this.memory.lastFoodStorage && this.memory.lastFoodStorage != -1)
		reward += 0.8;
	if (this.getFoodStorage() < this.memory.lastFoodStorage && this.memory.lastFoodStorage != -1 && this.getFoodStorage() <= this.minimumFoodStorage)
		reward += 0.8;
	if (this.collidedWithID != -1)
		reward += -0.9;
	// Reward for incoming ants of same type?

	// Update food storage
	this.memory.lastFoodStorage = this.getFoodStorage();

	var qLearningAlpha = 0.01;
	var qLearningGamma = 0.9;

	if (reward != 0 && this.networkMemory.length >= this.batchSize && this.neuralNetwork.shouldTrain) {
		var lastBest = maxElement(networkAnswer.output);
		for (var i = this.networkMemory.length - 1; i >= 0; --i) {

			var originalOutput = this.networkMemory[i].output;
			var modifiedOutput = originalOutput;
			var maxIdx = argmax(originalOutput);
			var chosenAction = this.networkMemory[i].chosenAction;

			if (chosenAction != -1 && modifiedOutput[chosenAction] > 0.2)
				var useless = 0;

			if (chosenAction != -1)
				modifiedOutput[chosenAction] = modifiedOutput[chosenAction] + qLearningAlpha * (reward + qLearningGamma * lastBest - modifiedOutput[chosenAction]);

			// Normalize vector and clip to [0.001,inf.)
			var sum = 0;
			for (var j = 0; j < modifiedOutput.length; ++j)
				modifiedOutput[j] = Math.max(modifiedOutput[j], 0.001);
			for (var j = 0; j < modifiedOutput.length; ++j)
				sum += modifiedOutput[j];
			for (var j = 0; j < modifiedOutput.length; ++j)
				modifiedOutput[j] = (modifiedOutput[j]) / sum;

			lastBest = maxElement(modifiedOutput);

			this.networkMemory[i].output = modifiedOutput;

		}

		this.trainSet = this.trainSet.concat(this.networkMemory);

		if (this.trainSet.length >= this.minTrainSet) {

			if (this.trainSet.length > this.minTrainSet)
				this.trainSet.shift(this.trainSet.length - this.minTrainSet);

			//var showDebug = rand(0,1) < 0.01;
			var showDebug = true;
			if (showDebug)
				console.log("Starting training...");
			var data = this.neuralNetwork.trainer.train(this.trainSet,{iterations: 100, rate: 0.001, error: 1e-10, shuffle: true, log: showDebug ? 10 : 1e8});
			this.trainSet = [];

			if (showDebug){
				console.dir(data);
				console.log("Finished.");
				console.log("Error: "+data.error);
				console.log("Its: "+data.iterations);
			}

		}

	}
}


var shouldSave = rand(0,1) < 0.001 ? true : false;

if (shouldSave) {
	localStorage.setItem("network", JSON.stringify(this.neuralNetwork.network.toJSON()));
	console.log("Saved network!");
}

var networkAnswer = createFeatureVector.call(this);
if (networkAnswer.output[0].isNaN)
	throw new TypeError("Network input incorrect! (" + networkAnswer.input + ")")

var actionTuple = chooseAction.call(this, networkAnswer);
//console.log(actionTuple)

// Push into memory
if (actionTuple != null) {
	this.networkMemory.push(networkAnswer);
	if (this.networkMemory.length > this.batchSize)
		this.networkMemory.shift(1);
	
	this.realChosen.push(true);
} else {
	this.realChosen.push(false);
}


if (this.realChosen.length > 1000) {
	var chosenPart = 0.;
	var firstChoicePart = 0.;
	for (var i = 0; i < this.realChosen.length; ++i) {
		chosenPart += this.realChosen[i] ? 1. : 0.;
		firstChoicePart += this.firstChoice[i] ? 1. : 0.;
	}
	chosenPart /= this.realChosen.length;
	firstChoicePart /= this.realChosen.length;
	console.log("Actively chosen %: "+chosenPart*100+"%");
	console.log("First choice %:    "+firstChoicePart*100+"%");
	this.realChosen = [];
	this.firstChoice = [];
}


reinforcementLearning.call(this, networkAnswer);

//Return value

if (actionTuple != null)
		return actionTuple;
else
	return [ActionType.MOVE, DirectionType.NONE, 0];`