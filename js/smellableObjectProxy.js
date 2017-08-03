define(function() {
	
return class SmellableObjectProxy {
	constructor(canvas, parentID, distance, rotation, type){
		this._context = canvas.getContext("2d");
		this.parentID = parentID;
		this.distance = distance;
		this.rotation = rotation;
		this.type = type;
	}
	
	getParentID(){ return this.parentID; }
	getDistanceToObj(){ return this.distance; }
	getRotationToObj() { return radToDeg(this.rotation); }
	getType(){ return this.type; }
	
	// has to be visible to be interactive
	canBeInteractedWith() { return false; }
}

});