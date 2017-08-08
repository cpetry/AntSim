define(function() {
	
return class SmellableObjectProxy {
	constructor(canvas, parentID, distance, rotation, objectType, pheromoneType = PheromoneType.NONE){
		this._context = canvas.getContext("2d");
		this.parentID = parentID;
		this.distance = distance;
		this.rotation = rotation;
		this.objectType = objectType;
		this.pheromoneType = pheromoneType;
	}
	
	getParentID(){ return this.parentID; }
	getDistanceToObj(){ return this.distance; }
	getRotationToObj() { return radToDeg(this.rotation); }
	getObjectType(){ return this.objectType; }
	getPheromoneType(){ return this.pheromoneType;}
	getID(){ return -2; }
	
	// has to be visible to be interactive
	canBeInteractedWith() { return false; }
}

});