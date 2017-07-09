var Direction = {
  FORWARD: 1,
  BACKWARD: 2,
  NONE: 3,
};

const _rotation = Symbol('rotation');
const _speed = Symbol('speed');
const _speedHeading = Symbol('speedHeading');
const _visibilityDistance = Symbol('visibilityDistance');
const _visibilityRangeRad = Symbol('visibilityRangeRad');
const _foodStorageAnt = Symbol('foodStorageAnt');
const _foodMaxAnt = Symbol('foodMaxAnt');
const _foodMaxHarvestAmount = Symbol('foodMaxHarvestAmount');

class Ant extends Collider {
	constructor(canvas, position, settings, collisionObjs){
		super(canvas, position, settings.getAntSize(), collisionObjs);
		this[_rotation] = rand(0, 3.14*2);
		this[_speed] = 2.5;
		this[_speedHeading] = 0.7; // radians
		this[_visibilityDistance] = 35;
		this[_visibilityRangeRad] = 1;
		this[_foodStorageAnt] = 0;
		this[_foodMaxAnt] = settings.getFoodMaxAnt();
		this[_foodMaxHarvestAmount] = settings.getFoodMaxHarvestAmountAnt();

		this.visibleObjs = [];
		this.smelledObjs = [];
	}
	
	// gets overwritten by custom classes
	iterate(){}
	
	// getter
	getRotation(){return this[_rotation];}	
	getSpeed(){	return this[_speed];}	
	getSpeedHeading(){return this[_speedHeading];}	
	getVisibilityDistance(){return this[_visibilityDistance];}	
	getVisibilityRangeRad(){ return this[_visibilityRangeRad]; }	
	getFoodStorage() { return this[_foodStorageAnt]; }
	getMaxFoodStorage() { return this[_foodMaxAnt]; }
	getMaxHarvestAmount() { return this[_foodMaxHarvestAmount]; }
	
	// checks and walks if possible
	move(walkingDirection, colObjs){
		var newHeading = this.getDirectionVecFromAngle(this.getRotation());

		var newPos = this.getPosition();
		if (walkingDirection == Direction.FORWARD)
			newPos = math.add(this.getPosition(), math.multiply(newHeading, this.getSpeed()));
		else if (walkingDirection == Direction.BACKWARD)
			newPos = math.add(this.getPosition(), -math.multiply(newHeading, this.getSpeed()));
		else if (walkingDirection == Direction.NONE)
			newPos = this.getPosition();
		
		this.setPosition(newPos, colObjs);
	}
	
	setNewHeading(newHeading){
		if (Math.abs(this.getRotation() - newHeading) > this.getSpeedHeading()){
			//console.log("new heading too much! Reducing according to attribute.")
			if (newHeading > this.getRotation())
				this[_rotation] += this.getSpeedHeading();
			else 
				this[_rotation] -= this.getSpeedHeading();
		}
		else
			this[_rotation] = newHeading;
		
		this[_rotation] = this.getRotation() % (Math.PI*2);
	}

	setVisibleObjects(objects){
		this.visibleObjs = [];
		for (var i=0; i<objects.length; i++){
			if (this == objects[i])
				continue;
			
			var distToObj = this.getDistanceToObject(objects[i]);
			// check distance
			if (distToObj < this.getVisibilityDistance()){
				// TODO some error in calculating radians
				var fromObjToDirRad = this.getAngleToObject(objects[i]);
				// check inside cone
				if (math.abs(fromObjToDirRad) < this.getVisibilityRangeRad()){
					//console.log("seeing sth!")
					this.visibleObjs.push(objects[i]);
				}				
			}
		}
	}
	
	setSmelledObjects(objects){
		this.smelledObjs = [];
		for (var i=0; i<objects.length; i++){
			if (this == objects[i]  // is not the ant itself
			|| !(objects[i].canBeSmelledFrom) // can be smelled
			|| this.visibleObjs.indexOf(objects[i]) > -1) // is not already visible
				continue;
			
			if (objects[i].canBeSmelledFrom(this.getPosition())){
				var pos = objects[i].smellPositionFrom(this.getPosition());
				var type = "None";
				if (objects[i] instanceof Hive)
					type = "Hive";
				else if (objects[i] instanceof Food)
					type = "Food";					 
				this.smelledObjs.push(new SmellableObjectProxy(pos,type));
			}
		}
	}

	getDirectionVecFromAngle(){
		var direction = math.matrix([math.cos(this.getRotation()), math.sin(this.getRotation())]);
		return direction;
	}

	getAngleToObject(obj){
		var directionVec = math.matrix([math.cos(this.getRotation()), math.sin(this.getRotation())])
		var toObjVec = math.subtract(obj.getPosition(), this.getPosition());
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

	
	draw(){
		var pos = this.getPosition().valueOf();
		//console.log("Draw Ant!")
		if (Debug.getVisibility()){		
			this._context.beginPath();
			this._context.moveTo(pos[0], pos[1]);
			this._context.arc(pos[0], pos[1],
					this.getVisibilityDistance(), 
					this.getRotation()-this.getVisibilityRangeRad(), 
					this.getRotation()+this.getVisibilityRangeRad(), false);
			this._context.lineTo(pos[0],this.getPosition().valueOf()[1]);
			this._context.fillStyle = '#' + (this.visibleObjs.length*11).toString() + "" + (this.visibleObjs.length*11).toString() + '00';
			this._context.fill();
			this._context.strokeStyle = '#003300';
			this._context.stroke();
		}
		if(Debug.getShowSmelledObjects()){
			for (var i=0; i<this.smelledObjs.length; i++){
				var pos = this.smelledObjs[i].getPosition().valueOf();
				this._context.beginPath();
				this._context.arc(pos[0], pos[1], 3, 0, 2 * Math.PI, false);
				this._context.fillStyle = '#ee0000';
				this._context.fill();
				this._context.lineWidth = 1;
				this._context.strokeStyle = '#ee0000';
				this._context.stroke();
			}
		}
		this._context.beginPath();
		this._context.arc(pos[0], pos[1], this.getSize(), 0, 2 * Math.PI, false);
		this._context.fillStyle = '#000000';
		this._context.fill();
		this._context.lineWidth = 1;
		this._context.strokeStyle = '#003300';
		this._context.stroke();
		if (Debug.getShowFoodAmount()){
			this._context.font = "14px Arial";
			this._context.textAlign = "center";
			this._context.lineWidth = 1;
			this._context.strokeStyle = '#FFFFFF';
			this._context.strokeText(this.getFoodStorage().toString(),pos[0],pos[1]); 
			this._context.fillStyle = 'black';
			this._context.fillText(this.getFoodStorage().toString(),pos[0],pos[1]);
		}
	}
}