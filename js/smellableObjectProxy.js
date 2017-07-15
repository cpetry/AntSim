var ObjectType = {
	NONE : 0,
	HIVE : 1,
	FOOD : 2,
	ANT : 3
}
class SmellableObjectProxy {
	constructor(canvas, parentID, distance, rotation, type){
		this._context = canvas.getContext("2d");
		this.parentID = parentID;
		this.distance = distance;
		this.rotation = rotation;
		this.type = type;
	}
	
	getParentID(){ return this.parentID; }
	getDistanceToObj(){ return this.distance; }
	getRotationToObj() { return this.rotation; }
	getType(){ return this.type; }
}