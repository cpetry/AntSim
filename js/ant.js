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
const _decayProb = Symbol('decayProb');
const _foodBonusProb = Symbol('foodBonusProb');
const _speedHeading = Symbol('speedHeading');
const _visibilityDistance = Symbol('visibilityDistance');
const _visibilityRangeRad = Symbol('visibilityRangeRad');
const _foodStorageAnt = Symbol('foodStorageAnt');
const _foodMaxAnt = Symbol('foodMaxAnt');
const _foodMaxHarvestAmount = Symbol('foodMaxHarvestAmount');

class Ant extends Collider {
	constructor(canvas, position, rotation, settings, collisionObjs){
		super(canvas, position, ShapeType.CIRCLE, settings.getAntSize(), rotation, collisionObjs);
		this[_decayProb] = settings.getAntDecayProb();
		this[_foodBonusProb] = settings.getAntFoodBonusProb();
		this[_life] = 100;
		this[_speed] = 2.5;
		this[_speedHeading] = 0.2; // radians
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
	getLife(){	return this[_life];}	
	getSpeed(){	return this[_speed];}
	getSpeedHeading(){return this[_speedHeading];}	
	getVisibilityDistance(){return this[_visibilityDistance];}	
	getVisibilityRangeRad(){ return this[_visibilityRangeRad]; }	
	getFoodStorage() { return this[_foodStorageAnt]; }
	getMaxFoodStorage() { return this[_foodMaxAnt]; }
	getMaxHarvestAmount() { return this[_foodMaxHarvestAmount]; }
	
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
		var newHeading = this.getDirectionVecFromAngle(this.getRotation());

		var newPos = this.getPositionMat();
		if (walkingDirection == Direction.FORWARD)
			newPos = math.add(this.getPositionMat(), math.multiply(newHeading, this.getSpeed()));
		else if (walkingDirection == Direction.BACKWARD)
			newPos = math.add(this.getPositionMat(), -math.multiply(newHeading, this.getSpeed()));
		else if (walkingDirection == Direction.NONE)
			newPos = this.getPositionMat();
		
		this.setPosition(newPos, colObjs);
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
				this.smelledObjs.push(new SmellableObjectProxy(this.getCanvas(), pos,type));
			}
		}
	}

	getDirectionVecFromAngle(){
		var direction = math.matrix([math.cos(this.getRotation()), math.sin(this.getRotation())]);
		return direction;
	}

	getAngleToObject(obj){
		var directionVec = { x: Math.cos(this.getRotation()), y: Math.sin(this.getRotation()) }
		var toObjVec = {x: obj.getPosition().x - this.getPosition().x, y: obj.getPosition().y - this.getPosition().y};
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
		var pos = this.getPosition();
		super.draw();
		//console.log("Draw Ant!")
		if (Debug.getVisibility()){		
			this._context.beginPath();
			this._context.moveTo(pos.x, pos.y);
			this._context.arc(pos.x, pos.y,
					this.getVisibilityDistance(), 
					this.getRotation()-this.getVisibilityRangeRad(), 
					this.getRotation()+this.getVisibilityRangeRad(), false);
			this._context.lineTo(pos.x,pos.y);
			this._context.fillStyle = '#' + (this.visibleObjs.length*11).toString() + "" + (this.visibleObjs.length*11).toString() + '00';
			this._context.fill();
			this._context.strokeStyle = '#003300';
			this._context.stroke();
		}
		if (Debug.getShowSmelledObjects()){
			for (var i=0; i<this.smelledObjs.length; i++){
				this.smelledObjs[i].draw();
			}
		}
		
		// body
		this._context.beginPath();
		this._context.arc(pos.x, pos.y, this.getSize()*0.50, 0, 2 * Math.PI, false);
		this._context.fillStyle = '#000000';
		this._context.fill();
		this._context.lineWidth = 1;
		this._context.strokeStyle = '#003300';
		this._context.stroke();

		// head
		var directionVec = math.matrix([math.cos(this.getRotation()), math.sin(this.getRotation())])
		var headPos = math.add(this.getPositionMat(), math.multiply(directionVec, this.getSize()*0.65)).valueOf();
		this._context.beginPath();
		this._context.arc(headPos[0], headPos[1], this.getSize()*0.25, 0, 2 * Math.PI, false);
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
			this._context.strokeText(this.getFoodStorage().toString(),pos.x,pos.y); 
			this._context.fillStyle = 'black';
			this._context.fillText(this.getFoodStorage().toString(),pos.x,pos.y);
		}
		if (Debug.getShowLife()){
		this._context.font = "14px Arial";
			this._context.textAlign = "center";
			this._context.lineWidth = 1;
			this._context.strokeStyle = '#FFFFFF';
			this._context.strokeText(this.getLife().toString(),pos.x,pos.y-5); 
			this._context.fillStyle = 'red';
			this._context.fillText(this.getLife().toString(),pos.x,pos.y-5);
		}
	}
}