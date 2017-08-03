define(['controller'], function(Controller) {

return class SpiderController extends Controller {
	constructor(spider){
		super(spider);
	}
	
	getNearestAnt(){
		var minDist = 1000;
		var prey = null;
		for (var id in this.visibleObjs){
			if(this.visibleObjs[id].getType() == ObjectType.ANT
			&& this.visibleObjs[id].getDistanceToObj() < minDist){
				minDist = this.visibleObjs[id].getDistanceToObj();
				var prey = this.visibleObjs[id];
			}
		}
		if(prey==null){
			for (var id in this.smelledObjs){
				if(this.smelledObjs[id].getType() == ObjectType.ANT
				&& this.smelledObjs[id].getDistanceToObj() < minDist){
					minDist = this.smelledObjs[id].getDistanceToObj();
					var prey = this.smelledObjs[id];
				}
			}
		}
		return prey;		
	}

	getAction(){
		var prey = this.getNearestAnt();
		var rotation = rand(-0.5,0.5);
		if (prey != null){
			if (prey.canBeInteractedWith(this)) {
				return [ActionType.ATTACK, prey]
			}
			else {
				var fromObjToDirRad = prey.getRotationToObj();
				rotation = fromObjToDirRad;
			}
		}
		if (this.hasCollidedWithID() != -1){
			return [ActionType.MOVE, DirectionType.FORWARD, 1];
		}
		return [ActionType.MOVE, DirectionType.FORWARD, rotation];
	}
}

});