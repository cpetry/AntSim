class SmellableObject extends Collider {
	constructor(canvas, position, size, sizeSmellingFactor, collisionObjs){
		super(canvas, position, ShapeType.CIRCLE, size, 0, collisionObjs);
		this.sizeSmellingFactor = sizeSmellingFactor;
	}

	getSmellingDistance(){
		var smellingDistance = this.getSize() * this.sizeSmellingFactor;
		return smellingDistance;
	}
	
	canBeSmelledFrom(position)
	{
		var distance = math.norm(math.subtract(this.getPosition(), position),2);
		return (distance < this.getSmellingDistance());
	}
	
	smellPositionFrom(position)
	{
		if (!this.canBeSmelledFrom(position))
			// should not be able to smell it.... did someone cheat here?!
			return math.matrix([rand(-1000,1000), rand(-1000,1000)])
			
		var distance = math.norm(math.subtract(this.getPosition(), position),2);
		var smallPosDist = math.pow(distance/this.getSmellingDistance(),3) * distance;
		return math.add(this.getPosition(), math.matrix([rand(-smallPosDist,smallPosDist), rand(-smallPosDist,smallPosDist)]));
	}
	
	draw(){
		if (Debug.getColliderVisibility()){
			super.draw();
		}
		if (Debug.getShowSmellingDistance()){
			var pos = this.getPosition().valueOf();
			this._context.beginPath();
			this._context.arc(pos[0], pos[1], this.getSmellingDistance() - 2, 0, 2 * Math.PI, false);
			this._context.fillStyle = '#ddaa99';
			this._context.fill();
			this._context.lineWidth = 2;
			this._context.strokeStyle = '#886644';
			this._context.stroke();
		}
	}
}