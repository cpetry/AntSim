class VisibleObjectProxy extends SmellableObjectProxy{
	constructor(canvas, parentID, refID, distance, rotation, size, type){
		super(canvas, parentID, distance, rotation, type);
		this.size = size;
		this.refID = refID;
	}

	canBeInteractedWith(){
		return (this.distance - this.size < 10);
	}
	
	getRefID(){ return this.refID; }
}