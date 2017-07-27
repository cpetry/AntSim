class SpiderController extends Controller {
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
		if (prey != null){
			if (prey.canBeInteractedWith(this)) {
				return [ActionType.ATTACK, prey]
			}
			else {
				var fromObjToDirRad = prey.getRotationToObj();
				return [ActionType.WALK, Direction.FORWARD, fromObjToDirRad];
			}
		}

		return [ActionType.WALK, Direction.FORWARD, rand(-0.5,0.5)];
	}
}