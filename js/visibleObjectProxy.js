class VisibleObjectProxy extends SmellableObjectProxy{
	constructor(canvas, parentID, refID, distance, rotation, size, type){
		super(canvas, parentID, distance, rotation, type);
		this.size = size;
		this.refID = refID;
	}

	canBeInteractedWith(other){
		var isNearEnough = this.distance - this.size - other.getSize() < 10;
		var rotatedTowards = Math.abs(this.getRotationToObj()) < Math.PI/4; 
		return (isNearEnough && rotatedTowards);
	}
	
	getID(){ return this.refID; }
}