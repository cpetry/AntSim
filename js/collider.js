class Collider {
	constructor(canvas, position, size, colObjs)
	{
		this.canvas = canvas;
		this.context = canvas.getContext("2d");
		this.size = size;
		while(this.checkCollision(colObjs, position)){
			position = math.add(math.matrix([rand(-10,10),rand(-10,10)]), position);
		}
		this.position = position;
	}
	
	getSize()
	{
		return this.size;
	}
	
	getPosition()
	{
		return this.position;
	}
	
	checkCollision(colObjs, newPos)
	{
		var collision = false;
		collision = !inside(newPos, this.size, this.canvas);
		for (var i=0; i < colObjs.length; i++)
		{
			if (this != colObjs[i]
			&& this.collidesWith(colObjs[i], newPos))
				collision = true;
		}
		return collision;
	}
	
	collidesWith(colObj, position)
	{
		var colSize = colObj.getSize();
		var colPosition = colObj.getPosition();
		if (position.valueOf()[0] + this.size > colPosition.valueOf()[0] - colSize 
		&&  position.valueOf()[1] + this.size > colPosition.valueOf()[1] - colSize
		&&  position.valueOf()[0] - this.size < colPosition.valueOf()[0] + colSize
		&&  position.valueOf()[1] - this.size < colPosition.valueOf()[1] + colSize){
			//console.log("Collision!");
			return true;
		}
		else
			return false;
	}
	
	getDirectionVecFromAngle(){
		var direction = math.matrix([math.cos(this.directionRad), math.sin(this.directionRad)]);
		return direction;
	}
	
	getDistanceToObject(obj){
		var fromTo = math.subtract(obj.getPosition(), this.position);
		return math.norm(fromTo,2);
	}
	
	getAngleToObject(obj){
		var directionVec = math.matrix([math.cos(this.directionRad), math.sin(this.directionRad)])
		var toObjVec = math.subtract(obj.getPosition(), this.position);
			
		return angleBetweenVectorsRad(directionVec, toObjVec);
	}
}