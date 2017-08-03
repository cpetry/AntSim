define(['collider'], function(Collider) {

/**
 * An abstract class for all smellable objects.
 */
return class SmellableObject extends Collider {
	
	/**
	* Creates a smellable object
	* @constructor
	* @abstract
	* @param {object} canvas - The canvas used to draw.
    * @param {object} position - 2D position of where the object shall be created (if no collision occurs).
    * @param {number} size - Size of the objects collider.
    * @param {number} sizeSmellingFactor - Size of the objects smell.
    * @param {Objects[]} allObjects - Objects in simulation.
    * @param {number} [rotation=0]rotation - Rotation in radians.
	*/
	constructor(canvas, position, size, sizeSmellingFactor, allObjects, rotation = 0){
		if (new.target === SmellableObject) {
			throw new TypeError("Cannot construct SmellableObject instances directly");
		}
		super(canvas, position, ShapeType.CIRCLE, size, rotation, allObjects);
		this.sizeSmellingFactor = sizeSmellingFactor;
	}

	getSmellDistance(){
		var smellingDistance = this.getSize() * this.sizeSmellingFactor;
		return smellingDistance;
	}
	
	canBeSmelledBy(animal)
	{
		var distance = getDistance(this.getPosition(), animal.getPosition());
		return (distance - this.getSmellDistance() - animal.getSmellingDistance() <= 0);
	}
	
	smellPositionFrom(animal)
	{
		if (!this.canBeSmelledBy(animal)){
			// should not be able to smell it.... did someone cheat here?!
			return math.matrix([rand(-1000,1000), rand(-1000,1000)])
		}
		
		var distance = getDistance(this.getPosition(), animal.getPosition());
		// [0, 1] <-> [0, smellingDistance+smellDistance] 
		var farthest = animal.getSmellingDistance() + this.getSmellDistance();
		var nearest  = 0;
		// [0,1]
		var smellPos = {x: this.getPosition().x, y:this.getPosition().y }; // clone position
		if (distance > nearest){
			var percentage = distance / (farthest-nearest);
			var smellPosDist = percentage * percentage * this.getSmellDistance(); // distance from actual position
			var addVec = rotateVector({x: smellPosDist, y:0}, rand(0, Math.PI*2));
			var smellPos = { x: this.getPosition().x + addVec.x, 
						     y: this.getPosition().y + addVec.y };
		}
		return smellPos;
	}
	
	draw(){
		super.draw();
		if (Debug.getShowSmellingDistance()){
			var pos = this.getPosition()
			this._context.beginPath();
			this._context.lineWidth = 2;
			this._context.arc(pos.x, pos.y, this.getSmellDistance() - 2, 0, 2 * Math.PI, false);
			this._context.strokeStyle = '#ddaa99';
			this._context.stroke();
		}
	}
}

});