class Ant extends Collider {
	constructor(canvas, position, collisionObjs){
		super(canvas, position, 2, collisionObjs);
		this.directionRad = getRandomArbitrary(0,3.14*2);
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
			
			var fromTo = math.subtract(objects[i].getPosition(), this.position);
			var distToObj = math.norm(fromTo,2);
			// check distance
			if (distToObj < this.visibilityDistance){
				// TODO some error in calculating radians
				var directionVec = math.matrix([math.sin(this.directionRad), math.cos(this.directionRad)])
				var fromToDir = math.divide(fromTo, distToObj);
				var fromObjToDirRad = math.acos(math.dot(fromToDir, directionVec));
				//console.log(math.abs(fromObjToDirRad))
				// check inside cone
				if (math.abs(fromObjToDirRad) < this.visibilityRangeRad){
					console.log("seeing sth!")
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
	getNewDirection(){
		this.directionRad += getRandomArbitrary(-0.5,0.5);
		//this.directionRad = this.directionRad % (3.14*2);
		var direction = math.matrix([math.cos(this.directionRad), math.sin(this.directionRad)]);
		return direction;
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