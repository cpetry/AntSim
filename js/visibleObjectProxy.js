class VisibleObjectProxy {
	constructor(canvas, refID, distance, rotation, size, type){
		this._context = canvas.getContext("2d");
		this.distance = distance;
		this.rotation = rotation;
		this.type = type;
		this.size = size;
		this.refID = refID;
	}

	canBeInteractedWith(){
		return (this.distance - this.size < 10);
	}
	
	getRefID(){ return this.refID; }
	getDistanceToObj(){ return this.distance; }
	getRotationToObj() { return this.rotation; }
	getType(){ return this.type; }
}