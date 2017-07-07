var WalkDirection = {
  FORWARD: 1,
  BACKWARD: 2,
  NONE: 3,
};

const _directionRad = Symbol('directionRad');
const _speed = Symbol('speed');
const _speedHeading = Symbol('speedHeading');
const _visibilityDistance = Symbol('visibilityDistance');
const _visibilityRangeRad = Symbol('visibilityRangeRad');

class Ant extends Collider {
	constructor(canvas, position, collisionObjs){
		super(canvas, position, 2, collisionObjs);
		this[_directionRad] = rand(0, 3.14*2);
		this[_speed] = 2.5;
		this[_speedHeading] = 0.7; // radians
		this[_visibilityDistance] = 35;
		this[_visibilityRangeRad] = 1;

		this.visibleObjs = [];
		this.smelledObjs = [];
	}
	
	iterate(){
		
	}
	
	getDirectionRad(){
		return this[_directionRad];
	}
	
	getSpeed(){
		return this[_speed]
	}
	
	getSpeedHeading(){
		return this[_speedHeading];
	}
	
	getVisibilityDistance(){
		return this[_visibilityDistance];
	}
	
	getVisibilityRangeRad(){
		return this[_visibilityRangeRad];
	}
	
	// checks and walks if possible
	move(colObjs){
		var newHeading = this.getDirectionVecFromAngle(this.getDirectionRad());
		var walkingDirection = WalkDirection.FORWARD;

		var newPos = this.getPosition();
		if (walkingDirection == WalkDirection.FORWARD)
			newPos = math.add(this.getPosition(), math.multiply(newHeading, this.getSpeed()));
		
		this.setPosition(newPos, colObjs);
	}
	
	setNewHeading(newHeading){
		//newHeading % (Math.PI*2);
		if (Math.abs(this.getDirectionRad() - newHeading) > this.getSpeedHeading()){
			console.log("new heading too much! Reducing according to attribute.")
			if (newHeading > this.getDirectionRad())
				this[_directionRad] += this.getSpeedHeading();
			else 
				this[_directionRad] -= this.getSpeedHeading();
		}
		else
			this[_directionRad] = newHeading;
		
		this[_directionRad] = this.getDirectionRad() % (Math.PI*2);
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
			|| !(objects[i] instanceof Food) // can be smelled
			|| this.visibleObjs.indexOf(objects[i]) > -1) // is not already visible
				continue;
			
			if (objects[i].canBeSmelledFrom(this.getPosition())){
				this.smelledObjs.push(new SmellableObjectProxy(objects[i].smellPositionFrom(this.getPosition())));
			}
		}
	}

	getDirectionVecFromAngle(){
		var direction = math.matrix([math.cos(this.getDirectionRad()), math.sin(this.getDirectionRad())]);
		return direction;
	}

	getAngleToObject(obj){
		var directionVec = math.matrix([math.cos(this.getDirectionRad()), math.sin(this.getDirectionRad())])
		var toObjVec = math.subtract(obj.getPosition(), this.getPosition());
		//console.log(directionVec);
		return angleBetweenVectorsRad(directionVec, toObjVec);
	}
	
	draw(){
		//console.log("Draw Ant!")
		if (Debug.getVisibility()){		
			this._context.beginPath();
			this._context.moveTo(this.getPosition().valueOf()[0],this.getPosition().valueOf()[1]);
			this._context.arc(this.getPosition().valueOf()[0], this.getPosition().valueOf()[1],
					this.getVisibilityDistance(), 
					this.getDirectionRad()-this.getVisibilityRangeRad(), 
					this.getDirectionRad()+this.getVisibilityRangeRad(), false);
			this._context.lineTo(this.getPosition().valueOf()[0],this.getPosition().valueOf()[1]);
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
		this._context.arc(this.getPosition().valueOf()[0], this.getPosition().valueOf()[1], this.getSize(), 0, 2 * Math.PI, false);
		this._context.fillStyle = '#000000';
		this._context.fill();
		this._context.lineWidth = 1;
		this._context.strokeStyle = '#003300';
		this._context.stroke();
	}
}