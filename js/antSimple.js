class AntSimple extends Ant{
	constructor(canvas, position, settings, collisionObjs){
	    super(canvas, position, settings, collisionObjs);
	}
	
	iterate(){
		var foodIsNear = false;
		var nearestFood;
		for(var i=0; i<this.visibleObjs.length; i++){
			if (this.visibleObjs[i] instanceof Food){
				nearestFood = this.visibleObjs[i];
				foodIsNear = true;
			}
		}
		if (!foodIsNear) {
			// smell food
			for (var i=0; i<this.smelledObjs.length; i++){
				if (this.smelledObjs[i] instanceof SmellableObjectProxy){
					nearestFood = this.smelledObjs[i];
					foodIsNear = true;
				}
			}
		}
		if (foodIsNear){
			var fromObjToDirRad = this.getAngleToObject(nearestFood);
			this.setNewHeading(this.getDirectionRad() + fromObjToDirRad);
		}
		
		else{
			this.setNewHeading(this.getDirectionRad() + rand(-0.5,0.5));
		}
	}
}