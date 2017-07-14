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
		var distance = getDistance(this.getPosition(), position);
		return (distance < this.getSmellingDistance());
	}
	
	smellPositionFrom(position)
	{
		if (!this.canBeSmelledFrom(position))
			// should not be able to smell it.... did someone cheat here?!
			return math.matrix([rand(-1000,1000), rand(-1000,1000)])
			
		var distance = getDistance(this.getPosition(), position);
		var smallPosDist = Math.pow(distance/this.getSmellingDistance(),3) * distance;
		var smellPos = { x: this.getPosition().x + rand(-smallPosDist,smallPosDist), 
						 y: this.getPosition().y + rand(-smallPosDist,smallPosDist)};
		return smellPos;
	}
	
	draw(){
		super.draw();
		if (Debug.getShowSmellingDistance()){
			var pos = this.getPosition()
			this._context.beginPath();
			this._context.arc(pos.x, pos.y, this.getSmellingDistance() - 2, 0, 2 * Math.PI, false);
			this._context.fillStyle = '#ddaa99';
			this._context.fill();
			this._context.lineWidth = 2;
			this._context.strokeStyle = '#886644';
			this._context.stroke();
		}
	}
}