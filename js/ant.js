class Ant extends Collider {
	constructor(canvas, position, collisionObjs){
		super(canvas, position, 2, collisionObjs);
		this.directionRad = rand(0, 3.14*2);
		this.speed = 2.5;
		this.visibilityDistance = 35;
		this.visibilityRangeRad = 1;
		this.visibleObjs = [];
	}
	
	setVisibleObjects(objects){
		this.visibleObjs = [];
		for (var i=0; i<objects.length; i++){
			if (this == objects[i])
				continue;
			
			var distToObj = this.getDistanceToObject(objects[i]);
			// check distance
			if (distToObj < this.visibilityDistance){
				// TODO some error in calculating radians
				var fromObjToDirRad = this.getAngleToObject(objects[i]);
				// check inside cone
				if (math.abs(fromObjToDirRad) < this.visibilityRangeRad){
					//console.log("seeing sth!")
					this.visibleObjs.push(objects[i]);	
				}				
			}
		}
	}
	
	// checks and walks if possible
	walkTo(newDirection, colObjs){
		var newPos = math.add(this.position, math.multiply(newDirection, this.speed));
		
		var collision = false;
		collision = !inside(newPos, this.size, this.canvas);
		for (var i=0; i < colObjs.length; i++)
		{
			if (this != colObjs[i]
			&& this.collidesWith(colObjs[i], newPos))
				collision = true;
		}
		if (!collision)
			this.position = newPos;
		else {
			// ant is not allowed to walk into stuff! :C
		}
	}
	
	// One function the user should be able to write him/herself
	// returns direction vector!
	getNewDirection(){
		var isFoodInSight = false;
		var nearestFood;
		for(var i=0; i<this.visibleObjs.length; i++){
			if (this.visibleObjs[i] instanceof Food){
				nearestFood = this.visibleObjs[i];
				isFoodInSight = true;
			}
		}
		if (isFoodInSight){
			this.directionRad = this.directionRad % (Math.PI*2);
			var fromObjToDirRad = this.getAngleToObject(nearestFood);
			this.directionRad += fromObjToDirRad;
			return this.getDirectionVecFromAngle(this.directionRad);
		}
		else{
			this.directionRad += rand(-0.5,0.5);
			this.directionRad = this.directionRad % (Math.PI*2);
			return this.getDirectionVecFromAngle(this.directionRad);
		}
	}
	
	draw(){
		//console.log("Draw Ant!")
		if (Debug.getVisibility()){		
			this.context.beginPath();
			this.context.moveTo(this.position.valueOf()[0],this.position.valueOf()[1]);
			this.context.arc(this.position.valueOf()[0], this.position.valueOf()[1],
					this.visibilityDistance, 
					this.directionRad-this.visibilityRangeRad, 
					this.directionRad+this.visibilityRangeRad, false);
			this.context.lineTo(this.position.valueOf()[0],this.position.valueOf()[1]);
			this.context.fillStyle = '#' + (this.visibleObjs.length*11).toString() + "" + (this.visibleObjs.length*11).toString() + '00';
			this.context.fill();
			this.context.strokeStyle = '#003300';
			this.context.stroke();
		}
		this.context.beginPath();
		this.context.arc(this.position.valueOf()[0], this.position.valueOf()[1], this.size, 0, 2 * Math.PI, false);
		this.context.fillStyle = '#000000';
		this.context.fill();
		this.context.lineWidth = 1;
		this.context.strokeStyle = '#003300';
		this.context.stroke();
	}
}