/**
 * AntControllerNeuralNet class
 *
 * Implements a TD-Neural-Q-Learning algorithm for AntSim.
 * This implementation is neither perfect nor meant to look
 * good in any way. Feel free to improve, describe, clarify,
 * add, remove or completely rewrite. This class is mainly
 * meant as an example and case study.
 */
class AntControllerNeuralNet extends AntController{
	constructor(ant, neuralNetwork){
		super(ant);
		this.memory = { harvestedFood : false, lastLife : -1 };
		this.networkMemory = [];
		this.neuralNetwork = neuralNetwork;
		
		this.batchSize = 10;
		this.minTrainSet = this.batchSize * 500;

		this.trainSet = [];
		this.realChosen = [];
		this.firstChoice = [];
	}
	
	
	argmax(tlist) {
		var max = -9e8;
		var maxarg = -1;
		for (var i = 0; i < tlist.length; ++i) {
			if (tlist[i] > max) {
				max = tlist[i];
				maxarg = i;
			}
		}
		return maxarg;
	}
	maxElement(tlist) {
		var max = -9e8;
		for (var i = 0; i < tlist.length; ++i) {
			if (tlist[i] > max) {
				max = tlist[i];
			}
		}
		return max;
	}

	createFeatureVector() {

		if (typeof(this.neuralNetwork.network)==='undefined')
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

		var additionalList = [(this.collidedWithID != 0) ? 1 : 0, this.getFoodStorage()/this.getMaxFoodStorage(), this.wasAttacked];

		var inputSet = antList.concat(foodList.concat(hiveList.concat(additionalList)));
		var outputSet = this.neuralNetwork.network.activate(inputSet);

		var setElement = {input: inputSet, output: outputSet, chosenAction: -1};

		return setElement;

	}

	getAction(){

		if (typeof(this.neuralNetwork.network)==='undefined')
			return [ActionType.NONE, 0, 0];

		var shouldSave = rand(0,1) < 0.001 ? true : false;

		if (shouldSave) {
			console.log("Saving network...");
			localStorage.setItem("network", JSON.stringify(this.neuralNetwork.network.toJSON()));
			console.log("Saved network!");
		}

		if (this.neuralNetwork.newNetwork) {
			this.neuralNetwork.initNetwork();
		}

		var foodKept = this.getMaxFoodStorage() * 0.14;
		var foodGivingToHive = Math.max(this.getFoodStorage() - foodKept,0);

		var networkAnswer = this.createFeatureVector();

		/*
		 * Chose action
		 */
		var networkOutput = networkAnswer.output;
		var maxAction = this.argmax(networkOutput);

		/*
		 * - Attack nearest Ant 					0
		 * - Run left, straight, right		1 2 3
		 * - Harvest nearest Food					4
		 * - Give food to nearest hive		5
		 */

		// Sort actions by value
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
			if (this.networkMemory.length > this.batchSize)
				this.networkMemory.shift(1);
		}

		if (actionTuple.length > 0) {
			this.realChosen.push(true);
		} else {
			this.realChosen.push(false);
		}
		this.firstChoice.push(networkAnswer.chosenAction == maxAction);

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

		if (reward != 0 && this.networkMemory.length >= this.batchSize && this.neuralNetwork.shouldTrain) {
			var lastBest = this.maxElement(networkAnswer.output);
			for (var i = this.networkMemory.length - 1; i >= 0; --i) {

				var originalOutput = this.networkMemory[i].output;
				var modifiedOutput = originalOutput;
				var maxIdx = this.argmax(originalOutput);
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

				lastBest = this.maxElement(modifiedOutput);

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

		/*
		 * Return value
		 */
		if (actionTuple.length > 0)
				return actionTuple;
		else
			return [ActionType.WALK, Direction.FORWARD, rand(-0.5,0.5)];

	}
}
