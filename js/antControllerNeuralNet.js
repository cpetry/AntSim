var jquery = require['js/external/jquery/jquery-3.2.1.min'];
var synaptic = require(['js/external/synaptic/synaptic'], initNetwork);

var network;
var trainer;

var batchSize = 10;
var minTrainSet = batchSize * 500;
var trainSet = [];

var shouldTrain = true;

var newNetwork = false;

var numInputs = 38;
var numHidden = 20;
var numOutputs = 6;
//newNetwork = true;

//$.cookie.json = true;

var realChosen = [];
var firstChoice = [];

function setActivation(network, activation) {
	for (var i = 0; i < network.layers.hidden.length; ++i)
		for (var j = 0; j < network.layers.hidden[i].list.length; ++j)
			network.layers.hidden[i].list[j].squash = activation;
	for (var j = 0; j < network.layers.output.list.length; ++j)
		network.layers.output.list[j].squash = activation;
}

function createNetwork() {

	network = new synaptic.Architect.Perceptron(numInputs, numHidden, numOutputs);
	console.dir(network);

}

function setXavier(network) {
	for (var i = 0; i < network.layers.hidden.length; ++i) {
		var layerVariance = 0;
		for (var j = 0; j < network.layers.hidden[i].list.length; ++j) {

			var inputKeys = Object.keys(network.layers.hidden[i].list[j].connections.inputs);
			var nIn = inputKeys.length;

			// Check if we calculated layer variance already
			if (layerVariance == 0) {
				//var nOut = network.layers.hidden[i].list[j].connections.outputs.length;
				layerVariance = 2. / (nIn);
			}

			for (var k = 0; k < nIn; k++)
				network.layers.hidden[i].list[j].connections.inputs[inputKeys[k]].weight = rand(-layerVariance,layerVariance);

		}
	}
	var layerVariance = 0;
	for (var j = 0; j < network.layers.output.list.length; ++j) {
		var inputKeys = Object.keys(network.layers.output.list[j].connections.inputs);
		var nIn = inputKeys.length;

		// Check if we calculated layer variance already
		if (layerVariance == 0) {
			//var nOut = network.layers.hidden[i].list[j].connections.outputs.length;
			layerVariance = 2. / (nIn);
		}

		for (var k = 0; k < nIn; k++)
			network.layers.output.list[j].connections.inputs[inputKeys[k]].weight = rand(-layerVariance,layerVariance);
	}

}

function initNetwork() {

	if (newNetwork) {
		createNetwork();
		setActivation(network, synaptic.Neuron.squash.RELU);
		setXavier(network);
		newNetwork = false;
	} else
		network = synaptic.Network.fromJSON(JSON.parse(localStorage.getItem("network")));
		//network = $.cookie('network');

	trainer = new synaptic.Trainer(network);

	console.log("Hallo! Biatch!");

}

function argmax(tlist) {
	max = -9e8;
	maxarg = -1;
	for (var i = 0; i < tlist.length; ++i) {
		if (tlist[i] > max) {
			max = tlist[i];
			maxarg = i;
		}
	}
	return maxarg;
}
function maxElement(tlist) {
	max = -9e8;
	for (var i = 0; i < tlist.length; ++i) {
		if (tlist[i] > max) {
			max = tlist[i];
		}
	}
	return max;
}

class AntControllerNeuralNet extends AntController{
	constructor(ant){
		super(ant);
		this.memory = { harvestedFood : false, lastLife : -1 };
		this.networkMemory = [];
	}

	createFeatureVector() {

		if (typeof(network)==='undefined')
			return [ActionType.WALK, Direction.FORWARD, rand(-0.5,0.5)];

		var visibleObjects = this.getVisibleObjs();
		var smellableObjects = this.getSmelledObjs();

		var degreePerArea = 30;
		var degreeShift = degreePerArea / 2;
		var subAreas = 360/degreePerArea;

		var antList = new Array(subAreas);
		var foodList = new Array(subAreas);
		var hiveList = new Array(subAreas);

		for (var i = 0; i < subAreas; ++i)
			antList[i] = foodList[i] = hiveList[i] = 0;

		for (var id in this.visibleObjs) {

			var rotation = this.visibleObjs[id].getRotationToObj() / Math.PI * 180. + degreeShift;
			while (rotation < 0) rotation += 360;
			while (rotation >= 360) rotation -= 360;
			var targetArea = Math.floor(rotation / degreePerArea);

			if(this.visibleObjs[id].getType() == ObjectType.ANT) {
				var isEnemy = this.visibleObjs[id].getParentID() != this.getParentID();
				antList[targetArea] += (isEnemy) ? 1 : -1;
			} else if (this.visibleObjs[id].getType() == ObjectType.FOOD) {
				foodList[targetArea] += 1;
			} else if (this.visibleObjs[id].getType() == ObjectType.HIVE) {
				hiveList[targetArea] += (this.visibleObjs[id].getParentID() != this.getParentID()) ? 1 : -1;
			}
		}
		for (var id in this.smelledObjs) {

			var rotation = this.smelledObjs[id].getRotationToObj() / Math.PI * 180. + degreeShift;
			while (rotation < 0) rotation += 360;
			while (rotation >= 360) rotation -= 360;
			var targetArea = Math.floor(rotation / degreePerArea);

			if(this.smelledObjs[id].getType() == ObjectType.ANT) {
				var isEnemy = this.smelledObjs[id].getParentID() != this.getParentID();
				antList[targetArea] += (isEnemy) ? 1 : -1;
			} else if (this.smelledObjs[id].getType() == ObjectType.FOOD) {
				foodList[targetArea] += 1;
			} else if (this.smelledObjs[id].getType() == ObjectType.HIVE) {
				hiveList[targetArea] += (this.smelledObjs[id].getParentID() != this.getParentID()) ? 1 : -1;
			}
		}

		// Normalization
		for (var i = 0; i < antList.length; ++i) {
			antList[i] = Math.min(Math.max(-5,antList[i]),5)/5.;
			foodList[i] = Math.min(Math.max(-4,antList[i]),4)/4.;
			hiveList[i] = Math.min(Math.max(-2,antList[i]),2)/2.;
		}

		var additionalList = [(this.collidedWithID != 0) ? 1 : 0, this.getFoodStorage()/this.getMaxFoodStorage()];

		var inputSet = antList.concat(foodList.concat(hiveList.concat(additionalList)));
		var outputSet = network.activate(inputSet);

		var setElement = {input: inputSet, output: outputSet, chosenAction: -1};

		return setElement;

	}

	getAction(){

		if (typeof(network)==='undefined')
		return

		var shouldSave = rand(0,1) < 0.001 ? true : false;

		if (shouldSave) {
			console.log("Saving network...");
			//$.cookie('network', network.toJSON(), { expires: 365, path: '/' });
			//localStorage.setItem("network", network.toJSON());
			localStorage.setItem("network", JSON.stringify(network.toJSON()));
			console.log("Saved network!");
		}

		if (newNetwork) {
			initNetwork();
		}

		var foodKept = this.getMaxFoodStorage() * 0.14;
		var foodGivingToHive = Math.max(this.getFoodStorage() - foodKept,0);

		var networkAnswer = this.createFeatureVector();

		/*
		 * Chose action
		 */
		var networkOutput = networkAnswer.output;
		var maxAction = argmax(networkOutput);

		/*
		 * - Attack nearest Ant 					0
		 * - Run left, straight, right		1 2 3
		 * - Harvest nearest Food					4
		 * - Give food to nearest hive		5
		 */

		// Sort actions by value
		// TODO check correctness
		var actionList = [0,1,2,3,4,5];
		actionList.sort(function(a,b){return networkOutput[b] - networkOutput[a];});

		var continiousSum = 0;
		for (var i = 0; i < networkOutput.length; ++i)
			continiousSum += networkOutput[i];

		var randomChosen = rand(0,1) * continiousSum;

		var actionTuple = [];

		var currentSum = 0;
		for (var j = 0; j < actionList.length; ++j) {

			var i = actionList[j];

			// Randomly chosen action
			currentSum += networkOutput[i];
			if (currentSum < randomChosen)
				continue;

			if (i == 0) {
				var prey = this.getNearestEnemyAnt();
				if (prey != null) {
					if (prey.canBeInteractedWith()) {
						return [ActionType.ATTACK, prey]
					} else {
						var fromObjToDirRad = prey.getRotationToObj();
						actionTuple = [ActionType.WALK, Direction.FORWARD, fromObjToDirRad];
					}
				}
			} else if (i == 1) {
				actionTuple = [ActionType.WALK, Direction.FORWARD, -30];
			} else if (i == 2) {
				actionTuple = [ActionType.WALK, Direction.FORWARD,   0];
			} else if (i == 3) {
				actionTuple = [ActionType.WALK, Direction.FORWARD,  30];
			} else if (i == 4) {

				var nearestFood = this.getNearestObjectType(ObjectType.FOOD);

				if (nearestFood != null) {

					var canBeHarvested = nearestFood.canBeInteractedWith();
					var isFull = (this.getFoodStorage() == this.getMaxFoodStorage());
					var canHarvestMore = (this.getFoodStorage() < this.getMaxFoodStorage());

					// harvest food if possible
					if (canHarvestMore) {
						if(canBeHarvested){
							var harvestAmount = this.getMaxFoodStorage() - this.getFoodStorage();
							actionTuple = [ActionType.HARVEST, nearestFood, harvestAmount];
						} else {
							// walk towards food
							var fromObjToDirRad = nearestFood.getRotationToObj();
							if (this.hasCollidedWithID() != -1){
								actionTuple = [ActionType.WALK, Direction.FORWARD, 1];
							}
							actionTuple = [ActionType.WALK, Direction.FORWARD, fromObjToDirRad];
						}
					}
				}

			} else if (i == 5) {

				var hive = this.getOwnHive();

				if (hive != null){

					// harvest food if possible
					if(hive.canBeInteractedWith()){
						actionTuple = [ActionType.GIVEFOOD, hive, foodGivingToHive];
					} else {
						// walk towards hive
						var fromObjToDirRad = hive.getRotationToObj();
						if (this.hasCollidedWithID() != -1)
							actionTuple = [ActionType.WALK, Direction.FORWARD, 1];
						else
							actionTuple = [ActionType.WALK, Direction.FORWARD, fromObjToDirRad];
					}
				}

			}

			if (actionTuple.length > 0) {
				networkAnswer.chosenAction  = i;
				break;
			}

		}

		// Push into memory
		if (actionTuple.length > 0) {
			this.networkMemory.push(networkAnswer);
			if (this.networkMemory.length > batchSize)
				this.networkMemory.shift(1);
		}

		if (actionTuple.length > 0) {
			realChosen.push(true);
		} else {
			realChosen.push(false);
		}
		firstChoice.push(networkAnswer.chosenAction == maxAction);

		if (realChosen.length > 1000) {
			var chosenPart = 0.;
			var firstChoicePart = 0.;
			for (var i = 0; i < realChosen.length; ++i) {
				chosenPart += realChosen[i] ? 1. : 0.;
				firstChoicePart += firstChoice[i] ? 1. : 0.;
			}
			chosenPart /= realChosen.length;
			firstChoicePart /= realChosen.length;
			console.log("Actively chosen %: "+chosenPart*100+"%");
			console.log("First choice %:    "+firstChoicePart*100+"%");
			realChosen = [];
			firstChoice = [];
		}

		/*
		 * Reward and reinforcement learning
		 */
		var reward = 0;

		if (this.memory.lastLife == -1)
			this.memory.lastLife = this.getLife();

		if (this.getLife() < this.memory.lastLife - 5) {
			reward += -0.1;
			this.memory.lastLife = this.getLife();
		}
		if (this.getFoodStorage() > this.memory.lastFoodStorage && this.memory.lastFoodStorage != -1)
			reward += 0.8;
		if (this.getFoodStorage() < this.memory.lastFoodStorage && this.memory.lastFoodStorage != -1 && this.getFoodStorage() <= foodKept)
			reward += 0.8;
		if (this.collidedWithID != -1)
			reward += -0.05;
		// Reward for incoming ants of same type?

		// Update food storage
		this.memory.lastFoodStorage = this.getFoodStorage();

		var qLearningAlpha = 0.01;
		var qLearningGamma = 0.9;

		if (reward != 0 && this.networkMemory.length >= batchSize && shouldTrain) {
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

			trainSet = trainSet.concat(this.networkMemory);

			if (trainSet.length >= minTrainSet) {

				if (trainSet.length > minTrainSet)
					trainSet.shift(trainSet.length - minTrainSet);

				//var showDebug = rand(0,1) < 0.01;
				var showDebug = true;
				if (showDebug)
					console.log("Starting training...");
				var data = trainer.train(trainSet,{iterations: 100, rate: 0.001, error: 1e-10, shuffle: true, log: showDebug ? 10 : 1e8});
				trainSet = [];

	 			if (showDebug){
					console.dir(data);
					console.log("Finished.");
					console.log("Error: "+data.error);
					console.log("Its: "+data.iterations);
				}

			}

		}

		/*
		 * Return value
		 */
		if (actionTuple.length > 0)
				return actionTuple;
		else
			return [ActionType.WALK, Direction.FORWARD, rand(-0.5,0.5)];

	}
}
