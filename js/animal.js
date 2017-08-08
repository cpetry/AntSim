define(['smellableObject','smellableObjectProxy','visibleObjectProxy','action','pheromone'], 
function(SmellableObject, SmellableObjectProxy, VisibleObjectProxy, Action, Pheromone) {

return class Animal extends SmellableObject {
	
	/**
	* Creates an animal
	* @constructor
	* @abstract
	* @param {object} canvas - The canvas used to draw.
    * @param {object} position - 2D position of where the object shall be created (if no collision occurs).
    * @param {number} size - Size of the objects collider.
    * @param {number} sizeSmellingFactor - Size of the objects smell.
    * @param {Objects[]} allObjects - Objects in simulation.
    * @param {number} [rotation=0]rotation - Rotation of the animal.
	*/
	constructor(canvas, position, size, settings, allObjects, rotation){
		super(canvas, position, size, settings.getSizeSmellingFactor(), allObjects, rotation);
		
		if (new.target === Animal) {
			throw new TypeError("Cannot construct animals directly");
		}

		this._decayProb = 0;
		this._speed = 0;
		this._speedRotation = 0;
		this._smellingDistance = 0;
		this._visibilityDistance = 0;
		this._visibilityRangeRad = 0;
		this._life = 100;
		this._collidedWithSth = null;
		this._wasAttacked = false;
		this._controller = null;
		this._attackDamage = 0;
		this._interactionDistance = settings.getInteractionDistance();
		this._interactionRange = settings.getInteractionRange();
		this._rotationSpeedReduction = settings.getRotationSpeedReduction();
		
		this._visibleObjs = {};
		this._smelledObjs = {};
	}

	getLife(){	return this._life;}
	getSmellingDistance(){	return this._smellingDistance;}
	getSpeed(){	return this._speed;}
	getSpeedRotation(){return this._speedRotation;}
	getVisibilityDistance(){return this._visibilityDistance;}
	getVisibilityRangeRad(){ return this._visibilityRangeRad; }
	getVisibilityRangeRad(){ return this._visibilityRangeRad; }
	getVisibleObjs(){return this._visibleObjs;}
	getSmelledObjs(){return this._smelledObjs;}
	getAttackDamage() {return this._attackDamage;}
	getInteractionDistance() {return this._interactionDistance;}
	getInteractionRange() {return this._interactionRange;}
	
	hasCollidedWith(){ return this._collidedWithSth;}
	wasAttacked(){ return this._wasAttacked;}

	setController(controller) {this._controller = controller;}
	
	iterate(allObjects){
		if (this.getLife() <= 0)
			throw new TypeError("Dead animals shouldn't be able to do anything! - We don't like zombies!");
		
		// setting sight and smell
		this.setVisibleObjects(allObjects);
		this.setSmelledObjects(allObjects);
		
		// get action
		this._controller.setAttributes(this);
		Action.apply(this, this._controller.getAction(), allObjects);

		// set decay
		this.age();
		this._wasAttacked = false;
	}
	
	age(){	
		if (rand(0,1.0 + this._decayProb) >= 1.0)
			this._life-=1;
	}
	
	/**
	* checks and walks if possible
	* rotation is given in relative radians to current heading
	*/
	move(direction, rotation, allObjects){
		var rotationDiff = Math.min(Math.abs(rotation), this.getSpeedRotation());
		var possibleRotation = Math.sign(rotation) * rotationDiff;
		super.setNewRotation(this.getRotation() + possibleRotation);

		
		
		var moveSpeed = this.getSpeed();
		// being attacked -> 0.5*moveSpeed!
		if (this.wasAttacked())
			moveSpeed *= 0.5;
		
		// rotation reduces move speed a bit!
		if(direction != DirectionType.NONE){
			//console.log(rotationDiff)
			var rotationPercentage = 1.0 - (rotationDiff / this.getSpeedRotation());
			moveSpeed *= ((1.0-this._rotationSpeedReduction) + this._rotationSpeedReduction*rotationPercentage);
		}
		
		// attention: has to be copied!
		var newPos = { x: this.getPosition().x, y: this.getPosition().y};
		var newHeading = this.getDirectionVec();

		if (direction == DirectionType.FORWARD){
			newPos.x += newHeading.x * moveSpeed;
			newPos.y += newHeading.y * moveSpeed;
		}
		else if (direction == DirectionType.BACKWARD){
			newPos.x -= newHeading.x * moveSpeed*0.5;
			newPos.y -= newHeading.y * moveSpeed*0.5;
		}

		// Collider
		this._collidedWithSth = this.checkCollision(newPos, allObjects);
		if (this._collidedWithSth === null){
			this.setPosition(newPos);
		}
	}
		
	setVisibleObjects(objects){
		this._visibleObjs = {}
		
		for (var i=0, l=objects.length; i<l; i++){
			if (this == objects[i] || objects[i].getObjectType() == ObjectType.PHEROMONE)
				continue;
			var objPos = objects[i].getPosition();
			var distToObj = getDistance(objPos, this.getPosition()) - objects[i].getSize();
			// check distance
			if (distToObj < this.getVisibilityDistance()){
				// TODO some error in calculating radians
				var fromObjToDirRad = this.getAngleToPos(objPos);
				// check inside cone
				if (Math.abs(fromObjToDirRad) < this.getVisibilityRangeRad()){
					//console.log("seeing sth!")
					var type = objects[i].getObjectType();
					var parentID = null;
					if (type == ObjectType.HIVE)
						parentID = objects[i].getID();
					else if (type == ObjectType.ANT || type == ObjectType.PHEROMONE)
						parentID = objects[i].getParentID();
					
					this._visibleObjs[objects[i].getID()] = new VisibleObjectProxy(this.getCanvas(), parentID, objects[i].getID(), distToObj, fromObjToDirRad, objects[i].getSize(), type);
				}
			}
		}
	}
	
	setSmelledObjects(objects){
		this._smelledObjs = {}
		
		for (var i=0, l=objects.length; i<l; i++){
			if (this == objects[i]  // is not the ant itself
			|| !(objects[i].canBeSmelledBy)) // can this object be smelled? !! No parameter!
				continue;

			if (objects[i].canBeSmelledBy(this)){
				var pos = objects[i].smellPositionFrom(this);
				var distance = getDistance(pos, this.getPosition())
				var rotation = this.getAngleToPos(pos);
				var type = objects[i].getObjectType();
				var pheromoneType = PheromoneType.NONE;
				var parentID = null;
				if (type == ObjectType.HIVE)
					parentID = objects[i].getID();
				else if (type == ObjectType.ANT || type == ObjectType.PHEROMONE)
					parentID = objects[i].getParentID();
				if (type == ObjectType.PHEROMONE)
					pheromoneType = objects[i].getPheromoneType();

				this._smelledObjs[objects[i].getID()] = new SmellableObjectProxy(this.getCanvas(), parentID, distance, rotation, type, pheromoneType);
			}
		}
	}
	
	
	getDirectionVec(){
		var direction = rotateVector({ x: 1, y: 0 }, this.getRotation());
		return direction;
	}

	getAngleToPos(pos){
		var directionVec = this.getDirectionVec();
		var toObjVec = {x: pos.x - this.getPosition().x, y: pos.y - this.getPosition().y};
		//console.log(directionVec);
		return angleBetweenVectorsRad(directionVec, toObjVec);
	}
	
	receiveAttack(damage){
		this._life -= damage;
		this._wasAttacked = true;
    }

	draw(){
		var pos = this.getPosition();
		if (Debug.getShowSmelledObjectsPosition()){
			for (var id in this._smelledObjs){
				var dist = this._smelledObjs[id].getDistanceToObj();
				var rot  = this._smelledObjs[id].getRotationToObj();
				var addVec = rotateVector({x: dist, y:0}, rot + this.getRotation());
				this._context.beginPath();
				this._context.arc(pos.x+addVec.x, pos.y+addVec.y, 6, 0, 2 * Math.PI, false);
				this._context.fillStyle = '#aaaaee';
				this._context.fill();
			}
		}
		
		if (Debug.getShowLife()){
			this._context.beginPath();
			this._context.rect(pos.x-10, pos.y+8, 20*this.getLife()/100, 3)
			this._context.lineWidth = 1;
			this._context.fillStyle = 'red';
			this._context.fill();
		}
		
		if (Debug.getShowSmellingDistance()){
			this._context.beginPath();
			this._context.arc(pos.x, pos.y, this.getSmellingDistance() - 2, 0, 2 * Math.PI, false);
			this._context.strokeStyle = '#2277dd';
			this._context.lineWidth = 2;
			this._context.stroke();
		}
		
	
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

	}
}

});