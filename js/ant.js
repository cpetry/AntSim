define(['animal', 'pheromone', 'antController','antControllerNeuralNet', 'neuralNetwork'], 
function(Animal, Pheromone, AntController, AntControllerNeuralNet, NeuralNetwork) {

/**
 * Ant
 */
return class Ant extends Animal {

	/**
	* Creates an ant and sets its abilities
	* @constructor
	* @param {object} canvas - The canvas used to draw.
    * @param {object} position - 2D position of where the ant shall be created (if no collision occurs).
    * @param {float} rotation - Rotation of the object in radians.
    * @param {SettingsSimulation} settings - Settings of the current simulation.
    * @param {Objects[]} allObjects - All objects inside scene.
    * @param {number} parentID - ID of the ants hive.
	*/
	constructor(canvas, position, rotation, settings, allObjects, parentID){
		super(canvas, position, settings.getAntSize(), settings, allObjects, rotation);
		this._objectType = ObjectType.ANT;
		// Abilities
		this._decayProb             = settings.getAntDecayProb();
		this._speed                 = settings.getAntSpeed();
		this._speedRotation         = settings.getAntSpeedRotation();
		this._smellingDistance      = settings.getAntSmellingDistance();
		this._visibilityDistance    = settings.getAntVisibilityDistance();
		this._visibilityRangeRad    = settings.getAntVisibilityRange();
		this._attackDamage          = settings.getAntAttackDamage();
		this._foodBonusProb         = settings.getAntFoodBonusProb(); // less life loss when carrying food
		this._foodMaxAnt            = settings.getFoodMaxAnt();
		this._foodMaxHarvestAmount  = settings.getFoodMaxHarvestAmountAnt();

		this._life = settings.getAntLife();
		this._foodStorageAnt = 0;
		this._parentID = parentID;
		this._collidedWithSth = null;
		this._wasAttacked = false;
		
		// as pheromones are created by ants, settings reside here
		this._pheromoneSize = settings.getPheromoneSize();
		this._pheromoneSmellingFactor = settings.getSizeSmellingFactor();
		this._pheromoneDecayProb = settings.getPheromoneDecayProb();
		
		var controller=null;
		var playerSettings = settings.getPlayerSettings()[this._parentID];
		var userFunction = playerSettings.antCode;
		if (!isFunction(userFunction))
			throw new TypeError("No valid user function!");
		
		if (playerSettings.antType == AntType.NEURALNET){
			
			var mayTrain = playerSettings.mayTrain;
			var neuralNetwork = null;
			if (mayTrain){
				if (settings.globalMemory[this._parentID] == null)
					settings.globalMemory[this._parentID] = new NeuralNetwork();
				neuralNetwork = settings.globalMemory[this._parentID]; // reference to global memory
			}
			else{
				if (settings.globalMemory[this._parentID] == null)
					neuralNetwork = new NeuralNetwork();
				else
					neuralNetwork = JSON.parse(JSON.stringify(settings.globalMemory[this._parentID])) // deep copy
			}
			controller = new AntControllerNeuralNet(this, userFunction, neuralNetwork, mayTrain);
		}
		else
			controller = new AntController(this, userFunction)
		
		this.setController(controller);
	}
	
	// getter
	getParentID() {return this._parentID; }
	getFoodStorage() { return this._foodStorageAnt; }
	getMaxFoodStorage() { return this._foodMaxAnt; }
	getMaxHarvestAmount() { return this._foodMaxHarvestAmount; }
	getMaxRotation() { return this._speedRotation; }
	
	iterate(allObjects){
		super.iterate(allObjects);
	}
	
	age(){
		var bonus = 0;
		if(this.getFoodStorage() > 0){
			bonus = this._foodBonusProb; // negative
		}

		if (rand(0,1.0 + this._decayProb + bonus) >= 1.0){
			if (this.getFoodStorage() > 0)
				this.consumeFood();
			this._life-=1;
		}
	}

	consumeFood(){
		this._foodStorageAnt -= 1;
	}

	giveAwayFood(amount){
		if (amount > this.getFoodStorage()){
			// should not happen!
			throw new TypeError("ERROR - Too much food to give away! (" + amount + ")")
			amount = this.getFoodStorage();
		}
		this._foodStorageAnt -= amount;
	}

	receiveFood(amount, allObjects){
		var additionalFood = amount;
		if (amount + this.getFoodStorage() > this.getMaxFoodStorage()){
			// should not happen!
			console.log("ERROR - Too much food received!")
			var tooMuch = (amount + this.getFoodStorage()) % this.getMaxFoodStorage();
			additionalFood = amount - tooMuch;
		}
		this._foodStorageAnt += additionalFood;
	}
	
	createPheromone(type, allObjects){
		var p = new Pheromone(this.getCanvas(), this.getPosition(), this.getParentID(), 
			this._pheromoneSize, this._pheromoneSmellingFactor, this._pheromoneDecayProb, type);
		allObjects.push(p);
	}

	draw(){
		super.draw();
		var pos = this.getPosition();

		// Decide ant color
		var fillStyle = _FILL_STYLE_TABLE[this.getParentID()];

		// body
		this._context.beginPath();
		this._context.arc(pos.x, pos.y, this.getSize()*0.50, 0, 2 * Math.PI, false);
		this._context.fillStyle = fillStyle;
		this._context.fill();
		this._context.lineWidth = 1;
		this._context.strokeStyle = '#003300';
		this._context.stroke();

		// head
		var dir = { x: Math.cos(this.getRotation()), y:  Math.sin(this.getRotation()) };
		var headPos = { x: pos.x + dir.x*this.getSize()*0.65, y: pos.y + dir.y*this.getSize()*0.65 };
		this._context.beginPath();
		this._context.arc(headPos.x, headPos.y, this.getSize()*0.25, 0, 2 * Math.PI, false);
		this._context.fillStyle = fillStyle;
		this._context.fill();
		this._context.lineWidth = 1;
		this._context.strokeStyle = '#003300';
		this._context.stroke();

		if (Debug.getShowFoodAmount()){
			this._context.beginPath();
			this._context.lineWidth = 1;
			this._context.fillStyle = 'green';
			this._context.rect(pos.x-10, pos.y+8, 3, -this.getFoodStorage() / this.getMaxFoodStorage() * 20)
			this._context.fill();
		}
		
	}
}

});