/**
 * An abstract class for all smellable objects.
 */
class SmellableObject extends Collider {
	
	/**
	* Creates a smellable object
	* @constructor
	* @abstract
	* @param {object} canvas - The canvas used to draw.
    * @param {object} position - 2D position of where the object shall be created (if no collision occurs).
    * @param {number} size - Size of the objects collider.
    * @param {number} sizeSmellingFactor - Size of the objects smell.
    * @param {Objects[]} collisionObjs - Objects in simulation that can collide with this.
    * @param {number} [rotation=0]rotation - ID of the ants hive.
	*/
	constructor(canvas, position, size, sizeSmellingFactor, collisionObjs, rotation = 0){
		if (new.target === SmellableObject) {
			throw new TypeError("Cannot construct SmellableObject instances directly");
		}
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
		if (!this.canBeSmelledBy(ant)){
			// should not be able to smell it.... did someone cheat here?!
			return math.matrix([rand(-1000,1000), rand(-1000,1000)])
		}
		
		var distance = getDistance(this.getPosition(), ant.getPosition());
		var smallPosDist = Math.pow(distance/(this.getSmellDistance()+ant.getSmellingDistance()),3) * distance;
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