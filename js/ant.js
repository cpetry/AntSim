var Direction = {
  FORWARD: 1,
  BACKWARD: 2,
  NONE: 3
}

var AntType = {
	SIMPLE: 0,
	CUSTOM: 1
}

const _speed = Symbol('speed');
const _life = Symbol('life');
const _smellingDistance = Symbol('smellingDistance'); 
const _decayProb = Symbol('decayProb');
const _foodBonusProb = Symbol('foodBonusProb');
const _speedHeading = Symbol('speedHeading');
const _visibilityDistance = Symbol('visibilityDistance');
const _visibilityRangeRad = Symbol('visibilityRangeRad');
const _foodStorageAnt = Symbol('foodStorageAnt');
const _foodMaxAnt = Symbol('foodMaxAnt');
const _foodMaxHarvestAmount = Symbol('foodMaxHarvestAmount');
const _parentID = Symbol('parentID');
const _collidedWithSth = Symbol('collidedWithSth');

const _FILL_STYLE_TABLE = ['#000000','#ff0000','#00ff00','#0000ff']; // Ant color per hive

/**
 * Ant
 */
class Ant extends SmellableObject {

	/**
	* Creates an ant and sets its abilities
	* @constructor
	* @param {object} canvas - The canvas used to draw.
    * @param {object} position - 2D position of where the ant shall be created (if no collision occurs).
    * @param {float} rotation - Rotation of the object in radians.
    * @param {SettingsSimulation} settings - Settings of the current simulation.
    * @param {Objects[]} collisionObjs.
    * @param {number} parentID - ID of the ants hive.
	*/
	constructor(canvas, position, rotation, settings, collisionObjs, parentID){
		super(canvas, position, settings.getAntSize(), settings.getSizeSmellingFactor(), collisionObjs, rotation);
		
		// Abilities
		this[_decayProb]     = settings.getAntDecayProb();
		this[_foodBonusProb] = settings.getAntFoodBonusProb(); // less life loss when carrying food
		this[_foodMaxAnt] = settings.getFoodMaxAnt();
		this[_foodMaxHarvestAmount] = settings.getFoodMaxHarvestAmountAnt();
		this[_speed] = 2.5;
		this[_speedHeading] = 0.2;
		this[_smellingDistance] = settings.getAntSmellingDistance();
		this[_visibilityDistance] = settings.getAntVisibilityDistance();
		this[_visibilityRangeRad] = settings.getAntVisibilityRange();

		this[_life] = 100;
		this[_foodStorageAnt] = 0;
		this[_parentID] = parentID;
		this[_collidedWithSth] = null;
		
		if (settings.getAntType() == AntType.SIMPLE)
			this.controller = new AntControllerSimple(this);
		else if (settings.getAntType() == AntType.CUSTOM)
			this.controller = new AntControllerCustom(this);

		this.visibleObjs = {};
		this.smelledObjs = {};
	}
	
	iterate(){
		this.controller.setAttributes(this);
		return this.controller.getAction();
	}

	// getter
	getParentID() {return this[_parentID]; }
	getLife(){	return this[_life];}
	getSmellingDistance(){	return this[_smellingDistance];}
	getSpeed(){	return this[_speed];}
	getSpeedHeading(){return this[_speedHeading];}
	getVisibilityDistance(){return this[_visibilityDistance];}
	getVisibilityRangeRad(){ return this[_visibilityRangeRad]; }
	getFoodStorage() { return this[_foodStorageAnt]; }
	getMaxFoodStorage() { return this[_foodMaxAnt]; }
	getMaxHarvestAmount() { return this[_foodMaxHarvestAmount]; }
	
	hasCollidedWith(){ return this[_collidedWithSth];}

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
	
	// checks and walks if possible
	move(walkingDirection, colObjs){
		
		var newHeading = this.getDirectionVec();

		// attention: has to be copied!
		var newPos = { x: this.getPosition().x, y: this.getPosition().y};
		if (walkingDirection == Direction.FORWARD){
			newPos.x += newHeading.x * this.getSpeed();
			newPos.y += newHeading.y * this.getSpeed();
		}
		else if (walkingDirection == Direction.BACKWARD){
			newPos.x -= newHeading.x * this.getSpeed();
			newPos.y -= newHeading.y * this.getSpeed();
		}
		
		var collider = this.setPosition(newPos, colObjs);
		this[_collidedWithSth] = collider;
	}
	
	setNewHeading(newHeading){
		if (Math.abs(this.getRotation() - newHeading) > this.getSpeedHeading()){
			//console.log("new heading too much! Reducing according to attribute.")
			if (newHeading > this.getRotation())
				super.setNewHeading(this.getRotation()+this.getSpeedHeading());
			else
				super.setNewHeading(this.getRotation()-this.getSpeedHeading());
		}
		else
			super.setNewHeading(newHeading);
	}

	setVisibleObjects(objects){
		this.visibleObjs = {}
		
		for (var i=0, l=objects.length; i<l; i++){
			if (this == objects[i])
				continue;
			var objPos = objects[i].getPosition();
			var distToObj = getDistance(objPos, this.getPosition());
			// check distance
			if (distToObj < this.getVisibilityDistance()){
				// TODO some error in calculating radians
				var fromObjToDirRad = this.getAngleToPos(objPos);
				// check inside cone
				if (Math.abs(fromObjToDirRad) < this.getVisibilityRangeRad()){
					//console.log("seeing sth!")
					var type = ObjectType.NONE;
					var parentID = null;
					if (objects[i] instanceof Hive){
						type = ObjectType.HIVE;
						parentID = objects[i].getID();
					}
					else if (objects[i] instanceof Food)
						type = ObjectType.FOOD;
					else if (objects[i] instanceof Ant){
						type = ObjectType.ANT;
						parentID = objects[i].getParentID();
					}
					this.visibleObjs[objects[i].getID()] = new VisibleObjectProxy(this.getCanvas(), parentID, objects[i].getID(), distToObj, fromObjToDirRad, objects[i].getSize(), type);
				}
			}
		}
	}
	
	setSmelledObjects(objects){
		this.smelledObjs = {}
		
		for (var i=0, l=objects.length; i<l; i++){
			if (this == objects[i]  // is not the ant itself
			|| !(objects[i].canBeSmelledBy)) // can this object be smelled? !! No parameter!
				continue;

			if (objects[i].canBeSmelledBy(this)){
				var pos = objects[i].smellPositionFrom(this);
				var distance = getDistance(pos, this.getPosition())
				var rotation = this.getAngleToPos(pos);
				var type = ObjectType.NONE;
				var parentID = null;
				if (objects[i] instanceof Hive){
					type = ObjectType.HIVE;
					parentID = objects[i].getID();
				}
				else if (objects[i] instanceof Food)
					type = ObjectType.FOOD;
				else if (objects[i] instanceof Ant){
					parentID = objects[i].getParentID();
					type = ObjectType.ANT;
				}
				this.smelledObjs[objects[i].getID()] = new SmellableObjectProxy(this.getCanvas(), parentID, distance, rotation, type);
			}
		}
	}

	getDirectionVec(){
		var direction = { x: Math.cos(this.getRotation()), y: Math.sin(this.getRotation()) };
		return direction;
	}

	getAngleToPos(pos){
		var directionVec = { x: Math.cos(this.getRotation()), y: Math.sin(this.getRotation()) }
		var toObjVec = {x: pos.x - this.getPosition().x, y: pos.y - this.getPosition().y};
		//console.log(directionVec);
		return angleBetweenVectorsRad(directionVec, toObjVec);
	}

	giveAwayFood(amount){
		if (amount > this.getFoodStorage()){
			// should not happen!
			console.log("ERROR - Too much food to give away!")
			amount = this.getFoodStorage();
		}
		this[_foodStorageAnt] -= amount;
	}

	receiveFood(amount){
		var additionalFood = amount;
		if (amount + this.getFoodStorage() > this.getMaxFoodStorage()){
			// should not happen!
			console.log("ERROR - Too much food received!")
			var tooMuch = (amount + this.getFoodStorage()) % this.getMaxFoodStorage();
			additionalFood = amount - tooMuch;
		}
		this[_foodStorageAnt] += additionalFood;
	}

  receiveAttack(){
    this[_life] -= 1;
  }


	draw(){

		super.draw();
		var pos = this.getPosition();

		if (Debug.getVisibility()){
			this._context.beginPath();
			this._context.moveTo(pos.x, pos.y);
			this._context.arc(pos.x, pos.y,
					this.getVisibilityDistance(),
					this.getRotation()-this.getVisibilityRangeRad(),
					this.getRotation()+this.getVisibilityRangeRad(), false);
			this._context.lineTo(pos.x,pos.y);
			this._context.strokeStyle = '#003300';
			this._context.stroke();
		}
		
		if (Debug.getShowSmelledObjectsPosition()){
			for (var id in this.smelledObjs){
				var dist = this.smelledObjs[id].getDistanceToObj();
				var rot  = this.smelledObjs[id].getRotationToObj();
				var addVec = rotateVector({x: dist, y:0}, rot + this.getRotation());
				this._context.beginPath();
				this._context.arc(pos.x+addVec.x, pos.y+addVec.y, 6, 0, 2 * Math.PI, false);
				this._context.fillStyle = '#aaaaee';
				this._context.fill();
			}
		}
		
		if (Debug.getShowSmellingDistance()){
			this._context.beginPath();
			this._context.arc(pos.x, pos.y, this.getSmellingDistance() - 2, 0, 2 * Math.PI, false);
			this._context.strokeStyle = '#2277dd';
			this._context.lineWidth = 2;
			this._context.stroke();
		}


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
		if (Debug.getShowLife()){
			this._context.beginPath();
			this._context.rect(pos.x-10, pos.y+8, 20*this.getLife()/100, 3)
			this._context.lineWidth = 1;
			this._context.fillStyle = 'red';
			this._context.fill();
		}
	}
}
