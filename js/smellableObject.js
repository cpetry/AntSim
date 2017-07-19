class SmellableObject extends Collider {
	constructor(canvas, position, size, sizeSmellingFactor, collisionObjs, rotation = 0){
		super(canvas, position, ShapeType.CIRCLE, size, rotation, collisionObjs);
		this.sizeSmellingFactor = sizeSmellingFactor;
	}

	getSmellDistance(){
		var smellingDistance = this.getSize() * this.sizeSmellingFactor;
		return smellingDistance;
	}
	
	canBeSmelledBy(ant)
	{
		var distance = getDistance(this.getPosition(), ant.getPosition());
		return (distance - this.getSmellDistance() - ant.getSmellingDistance() <= 0);
	}
	
	smellPositionFrom(ant)
	{
		if (!this.canBeSmelledBy(ant))
			// should not be able to smell it.... did someone cheat here?!
			return math.matrix([rand(-1000,1000), rand(-1000,1000)])
			
		var distance = getDistance(this.getPosition(), ant.getPosition());
		var smallPosDist = Math.pow(distance/this.getSmellDistance(),3) * distance;
		var smellPos = { x: this.getPosition().x + rand(-smallPosDist,smallPosDist), 
						 y: this.getPosition().y + rand(-smallPosDist,smallPosDist)};
		return smellPos;
	}
	
	draw(){
		super.draw();
		if (Debug.getShowSmellingDistance()){
			var pos = this.getPosition()
			this._context.beginPath();
			this._context.arc(pos.x, pos.y, this.getSmellDistance() - 2, 0, 2 * Math.PI, false);
			this._context.strokeStyle = '#ddaa99';
			this._context.lineWidth = 2;
			this._context.stroke();
		}
	}
}