define(['smellableObjectProxy'], function(SmellableObjectProxy) {

return class VisibleObjectProxy extends SmellableObjectProxy{
	constructor(canvas, parentID, refID, distance, rotation, size, type){
		super(canvas, parentID, distance, rotation, type);
		this.size = size;
		this.refID = refID;
	}

	canBeInteractedWith(other){
		var isNearEnough = this.distance - this.size - other.getSize() < other.getInteractionDistance();
		var rotatedTowards = Math.abs(this.rotation) < other.getInteractionRange(); // both are given in radians here!
		return (isNearEnough && rotatedTowards);
	}
	
	getSize(){ return this.size;}
	getID(){ return this.refID; }
}

});