class AntSimple extends Ant{
	constructor(canvas, position, collisionObjs){
	    super(canvas, position, 2, collisionObjs);
	}
	
	iterate(){
		var isFoodInSight = false;
		var nearestFood;
		for(var i=0; i<this.visibleObjs.length; i++){
			if (this.visibleObjs[i] instanceof Food){
				nearestFood = this.visibleObjs[i];
				isFoodInSight = true;
			}
		}
		if (isFoodInSight){
			var fromObjToDirRad = this.getAngleToObject(nearestFood);
			this.setNewHeading(this.getDirectionRad() + fromObjToDirRad);
		}
		else{
			this.setNewHeading(this.getDirectionRad() + rand(-0.5,0.5));
		}
	}
}