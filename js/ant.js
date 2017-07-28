var Direction = {
  FORWARD: 1,
  BACKWARD: 2,
  NONE: 3
}

var AntType = {
	SIMPLE: 0,
	CUSTOM: 1
}

const _foodBonusProb = Symbol('foodBonusProb');
const _foodStorageAnt = Symbol('foodStorageAnt');
const _foodMaxAnt = Symbol('foodMaxAnt');
const _foodMaxHarvestAmount = Symbol('foodMaxHarvestAmount');
const _parentID = Symbol('parentID');
const _pheromones = Symbol('pheromones');
const _maxPheromones = Symbol('maxPheromones');

const _FILL_STYLE_TABLE = ['#000000','#ff0000','#00ff00','#0000ff']; // Ant color per hive

/**
 * Ant
 */
class Ant extends Animal {

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
		
		// Abilities
		this[_decayProb]            = settings.getAntDecayProb();
		this[_foodBonusProb]        = settings.getAntFoodBonusProb(); // less life loss when carrying food
		this[_foodMaxAnt]           = settings.getFoodMaxAnt();
		this[_foodMaxHarvestAmount] = settings.getFoodMaxHarvestAmountAnt();
		this[_speed]                = settings.getAntSpeed();
		this[_speedRotation]        = settings.getAntSpeedRotation();
		this[_smellingDistance]     = settings.getAntSmellingDistance();
		this[_visibilityDistance]   = settings.getAntVisibilityDistance();
		this[_visibilityRangeRad]   = settings.getAntVisibilityRange();
		this[_attackDamage]         = settings.getAntAttackDamage();

		this[_life] = settings.getAntLife();
		this[_foodStorageAnt] = 0;
		this[_parentID] = parentID;
		this[_pheromones] = [];
		this[_maxPheromones] = settings.getAntMaxPheromones();
		
		if (settings.getAntType() == AntType.SIMPLE)
			this[_controller] = new AntControllerSimple(this);
		else if (settings.getAntType() == AntType.CUSTOM)
			this[_controller] = new AntControllerCustom(this);

	}
	
	// getter
	getParentID() {return this[_parentID]; }
	getFoodStorage() { return this[_foodStorageAnt]; }
	getMaxFoodStorage() { return this[_foodMaxAnt]; }
	getMaxHarvestAmount() { return this[_foodMaxHarvestAmount]; }
	getPheromones() { return this[_pheromones]; }
	
	iterate(allObjects){
		super.iterate(allObjects);
		
		for (var i = 0; i < this[_pheromones].length; i++) {
			var phero = this[_pheromones][i];
			phero.age();
			if (phero.getLife() <= 0)
				removePheromone(phero, i, allObjects);
		}
	}
	
	removePheromone(pheromone, index, allObjects){
		for (var a =0; a < allObjects.length; a++){
			if (allObjects[a] == this[_pheromones][index])
				allObjects.splice(a, 1);
		}
		this[_pheromones].splice(index, 1);
	}
	
	canSetPheromone(){
		return (this[_pheromones].length <= this[_maxPheromones]) 
	}
	
	createPheromone(allObjects){
		if (!this.canSetPheromone()){
			console.log("Pheromone cannot be created! Check with 'this.canSetPheromone'")
			return;
		}
		var newPheromone = new Pheromone(this.getCanvas(), this.getPosition(), allObjects);
		this[_pheromones].push(newPheromone);
		allObjects.push(newPheromone);
	}
	
	age(){
		var bonus = 0;
		if(this.getFoodStorage() > 0){
			bonus = this[_foodBonusProb]; // negative
		}
		
		if (rand(0,1.0 + this[_decayProb] + bonus) >= 1.0){
			if (this.getFoodStorage() > 0)
				this.consumeFood();
			this[_life]-=1;
		}
	}
	
	consumeFood(){
		this[_foodStorageAnt]-=1;
	}
	

	giveAwayFood(amount){
		if (amount > this.getFoodStorage()){
			// should not happen!
			console.log("ERROR - Too much food to give away!")
			amount = this.getFoodStorage();
		}
		this[_foodStorageAnt] -= amount;
	}

	receiveFood(amount, allObjects){
		var additionalFood = amount;
		if (amount + this.getFoodStorage() > this.getMaxFoodStorage()){
			// should not happen!
			console.log("ERROR - Too much food received!")
			var tooMuch = (amount + this.getFoodStorage()) % this.getMaxFoodStorage();
			additionalFood = amount - tooMuch;
		}
		this[_foodStorageAnt] += additionalFood;
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
