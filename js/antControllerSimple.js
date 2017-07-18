class AntControllerSimple extends AntController{
	constructor(ant){
		super(ant);
		this.memory = { harvestedFood : false };
	}

	getAction(){
		//console.log(this);
		var enoughFoodForKilling = (this.getFoodStorage() > this.getMaxFoodStorage() * 0.25)
		var searchForFood = (this.getFoodStorage() < this.getMaxFoodStorage()*0.15);
		var nearestFood = false;
		var hive = false;

		// Check to kill some ants
		if (enoughFoodForKilling) {
			for (var id in this.visibleObjs){
				if(this.visibleObjs[id].getType() == ObjectType.ANT) {
					if (this.visibleObjs[id].getParentID() != this.getParentID()) {
						var prey = this.visibleObjs[id];
						if (this.getLife() > 50) {
							if (prey.canBeInteractedWith()) {
								return [ActionType.ATTACK, prey]
							}
							else {
								var fromObjToDirRad = prey.getRotationToObj();
								return [ActionType.WALK, Direction.FORWARD, fromObjToDirRad];
							}
						}
					}
				}
			}
		}

		// search for food
		if (searchForFood || !this.memory.harvestedFood){
			this.memory.harvestedFood = false;
				
			// Check if ant can see food
			//console.log(this.visibleObjs)
			for (var id in this.visibleObjs){
				if (this.visibleObjs[id].getType() == ObjectType.FOOD){
					nearestFood = this.visibleObjs[id];
				}
			}

			// food can be seen
			if (nearestFood != false ){
				var canBeHarvested = nearestFood.canBeInteractedWith();
				var canHarvestMore = (this.getFoodStorage() < this.getMaxFoodStorage());

				if (!canHarvestMore)
					this.memory.harvestedFood = true;
					
				// harvest food if possible
				if(canBeHarvested && canHarvestMore){
					var harvestAmount = this.getMaxFoodStorage() - this.getFoodStorage();
					return [ActionType.HARVEST, nearestFood, harvestAmount];
				}
				// walk towards food
				else if (canHarvestMore){
					var fromObjToDirRad = nearestFood.getRotationToObj();
					return [ActionType.WALK, Direction.FORWARD, fromObjToDirRad];
				}
			}
			else {
				// try to smell food and walk towards position
				for (var id in this.smelledObjs){
					if (this.smelledObjs[id].getType() == ObjectType.FOOD){
						nearestFood = this.smelledObjs[id];
					}
				}
				if (nearestFood != false){
					var fromObjToDirRad = nearestFood.getRotationToObj();
					return [ActionType.WALK, Direction.FORWARD, fromObjToDirRad];
				}
				// search for food
				else{
					return [ActionType.WALK, Direction.FORWARD, rand(-0.5,0.5)];
				}
			}
		}

		// search for hive and return food
		else{

			// Check what can the ant see
			for (var id in this.visibleObjs){
				if(this.visibleObjs[id].getType() == ObjectType.HIVE
				&& this.visibleObjs[id].getParentID() == this.getParentID()){
						hive = this.visibleObjs[id];
				}
			}

			// hive can be seen
			if (hive != false){
				// harvest food if possible
				if(hive.canBeInteractedWith()){
					this.memory.harvestedFood = false;
					return [ActionType.GIVEFOOD, hive, this.getFoodStorage()*0.85];
				}
				// walk towards food
				else {
					var fromObjToDirRad = hive.getRotationToObj();
					return [ActionType.WALK, Direction.FORWARD, fromObjToDirRad];
				}
			}
			else {
				// try to smell hive and walk towards position
				for (var id in this.smelledObjs){
					if (this.smelledObjs[id].getType() == ObjectType.HIVE
					&& this.smelledObjs[id].getParentID() == this.getParentID()){
						hive = this.smelledObjs[id];
					}
				}
				if (hive != false){
					var fromObjToDirRad = hive.getRotationToObj();
					return [ActionType.WALK, Direction.FORWARD, fromObjToDirRad];
				}
				// search for hive
				else{
					return [ActionType.WALK, Direction.FORWARD, rand(-0.5,0.5)];
				}

			}
			
		}
		return [ActionType.WALK, Direction.NONE, rand(-0.5,0.5)];
	}
}
