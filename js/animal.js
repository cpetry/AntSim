const _speed = Symbol('speed');
const _life = Symbol('life');
const _smellingDistance = Symbol('smellingDistance'); 
const _decayProb = Symbol('decayProb');
const _speedRotation = Symbol('speedRotation');
const _visibilityDistance = Symbol('visibilityDistance');
const _visibilityRangeRad = Symbol('visibilityRangeRad');
const _collidedWithSth = Symbol('collidedWithSth');
const _wasAttacked = Symbol('wasAttacked');
const _controller = Symbol('controller');
const _visibleObjs = Symbol('visibleObjects');
const _smelledObjs = Symbol('smelledObjects');
const _attackDamage = Symbol('attackDamage');
const _interactionDistance = Symbol('interactionDistance');
const _interactionRange = Symbol('interactionRange');

class Animal extends SmellableObject {
	/**
	* Creates an animal
	* @constructor
	* @abstract
	* @param {object} canvas - The canvas used to draw.
    * @param {object} position - 2D position of where the object shall be created (if no collision occurs).
    * @param {number} size - Size of the objects collider.
    * @param {number} sizeSmellingFactor - Size of the objects smell.
    * @param {Objects[]} collisionObjs - Objects in simulation that can collide with this.
    * @param {number} [rotation=0]rotation - Rotation of the animal.
	*/
	constructor(canvas, position, size, settings, collisionObjs, rotation){
		super(canvas, position, size, settings.getSizeSmellingFactor(), collisionObjs, rotation);
		
		if (new.target === Animal) {
			throw new TypeError("Cannot construct animals directly");
		}

		this[_decayProb] = 0;
		this[_speed] = 0;
		this[_speedRotation] = 0;
		this[_smellingDistance] = 0;
		this[_visibilityDistance] = 0;
		this[_visibilityRangeRad] = 0;
		this[_life] = 100;
		this[_collidedWithSth] = null;
		this[_wasAttacked] = false;
		this[_controller] = null;
		this[_attackDamage] = 0;
		this[_interactionDistance] = settings.getInteractionDistance();
		this[_interactionRange] = settings.getInteractionRange();
		
		this[_visibleObjs] = {};
		this[_smelledObjs] = {};
	}

	getLife(){	return this[_life];}
	getSmellingDistance(){	return this[_smellingDistance];}
	getSpeed(){	return this[_speed];}
	getSpeedRotation(){return this[_speedRotation];}
	getVisibilityDistance(){return this[_visibilityDistance];}
	getVisibilityRangeRad(){ return this[_visibilityRangeRad]; }
	getVisibilityRangeRad(){ return this[_visibilityRangeRad]; }
	getVisibleObjs(){return this[_visibleObjs];}
	getSmelledObjs(){return this[_smelledObjs];}
	getAttackDamage() {return this[_attackDamage];}
	getInteractionDistance() {return this[_interactionDistance];}
	getInteractionRange() {return this[_interactionRange];}
	
	hasCollidedWith(){ return this[_collidedWithSth];}
	wasAttacked(){ return this[_wasAttacked];}

	iterate(collisionObjs){
		// setting sight and smell
		this.setVisibleObjects(collisionObjs);
		this.setSmelledObjects(collisionObjs);
		
		// get action
		this[_controller].setAttributes(this);
		let [action, parameter1, parameter2] = this[_controller].getAction();
		// apply action
		Action.apply(this, action, parameter1, parameter2, collisionObjs);

		// set decay
		this.age();
		this[_wasAttacked] = false;
	}
	
	age(){	
		if (rand(0,1.0 + this[_decayProb]) >= 1.0)
			this[_life]-=1;
	}
	
		// checks and walks if possible
	move(walkingDirection, colObjs){
		
		var newHeading = this.getDirectionVec();

		var moveSpeed = this.getSpeed();
		if (this.wasAttacked())
			moveSpeed /= 2;
		
		// attention: has to be copied!
		var newPos = { x: this.getPosition().x, y: this.getPosition().y};
		if (walkingDirection == Direction.FORWARD){
			newPos.x += newHeading.x * moveSpeed;
			newPos.y += newHeading.y * moveSpeed;
		}
		else if (walkingDirection == Direction.BACKWARD){
			newPos.x -= newHeading.x * moveSpeed;
			newPos.y -= newHeading.y * moveSpeed;
		}
		
		var collider = this.setPosition(newPos, colObjs);
		this[_collidedWithSth] = collider;
	}
	
	setNewRotation(newRotation){
		if (Math.abs(this.getRotation() - newRotation) > this.getSpeedRotation()){
			//console.log("new heading too much! Reducing according to attribute.")
			if (newRotation > this.getRotation())
				super.setNewRotation(this.getRotation()+this.getSpeedRotation());
			else
				super.setNewRotation(this.getRotation()-this.getSpeedRotation());
		}
		else
			super.setNewRotation(newRotation);
	}
	
	setVisibleObjects(objects){
		this[_visibleObjs] = {}
		
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
					this[_visibleObjs][objects[i].getID()] = new VisibleObjectProxy(this.getCanvas(), parentID, objects[i].getID(), distToObj, fromObjToDirRad, objects[i].getSize(), type);
				}
			}
		}
	}
	
	setSmelledObjects(objects){
		this[_smelledObjs] = {}
		
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
				this[_smelledObjs][objects[i].getID()] = new SmellableObjectProxy(this.getCanvas(), parentID, distance, rotation, type);
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
	
	receiveAttack(damage){
		this[_life] -= damage;
		this[_wasAttacked] = true;
    }

	draw(){
		var pos = this.getPosition();
		if (Debug.getShowSmelledObjectsPosition()){
			for (var id in this[_smelledObjs]){
				var dist = this[_smelledObjs][id].getDistanceToObj();
				var rot  = this[_smelledObjs][id].getRotationToObj();
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