class AntControllerSimple extends AntController{
	constructor(ant){
		super(ant);
		this.memory = { harvestedFood : false };
	}

	getAction(){
		//console.log(this);
		var enoughFoodForKilling = (this.getFoodStorage() > this.getMaxFoodStorage() * 0.25)
		var searchForFood = (this.getFoodStorage() < this.getMaxFoodStorage()*0.85);
		var nearestFood = false;
		var hive = false;

		// Check to kill some ants
		if (enoughFoodForKilling) {
			for(var i=0; i < this.visibleObjs.length; i++) {
				if(this.visibleObjs[i].getType() == "Ant") {
					var nearAnt = this.visibleObjs[i];
					if (nearAnt.getParentID() != this.getParentID()) {
						if (this.getLife() > 50) {
							if (nearAnt.canBeInteractedWith()) {
								return [ActionType.ATTACK, this.visibleObjs[i]]
							}
							else {
								var fromObjToDirRad = nearAnt.getRotationToObj();
								return [ActionType.WALK, Direction.FORWARD, fromObjToDirRad];
							}
						}
					}
				}
			}
		}

		// search for food
		if (searchForFood && !this.memory.harvestedFood){
			// Check if ant can see food
			for(var i=0; i<this.visibleObjs.length; i++){
				if (this.visibleObjs[i].getType() == "Food"){
					nearestFood = this.visibleObjs[i];
				}
			}

			// food can be seen
			if (nearestFood != false 
			&& nearestFood.getType() == "Food"){
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
				for (var i=0; i<this.smelledObjs.length; i++){
					if (this.smelledObjs[i].getType() == "Food"){
						nearestFood = this.smelledObjs[i];
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
			for(var i=0; i<this.visibleObjs.length; i++){
				if(this.visibleObjs[i].getType() == "Hive"
				&& this.visibleObjs[i].getParentID() == this.getParentID()){
						hive = this.visibleObjs[i];
						console.log("ownHive!")
				}
			}

			// hive can be seen
			if (hive != false){

				// harvest food if possible
				if(hive.canBeInteractedWith()){
					this.memory.harvestedFood = false;
					console.log("giveFood!")
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
				for (var i=0; i<this.smelledObjs.length; i++){
					if (this.smelledObjs[i].getType() == "Hive"
					&& this.smelledObjs[i].getParentID() == this.getParentID()){
						console.log("smelled own hive")
						hive = this.smelledObjs[i];
					}
				}
				if (hive != false){
					console.log("walk to hive!" + hive.getRotationToObj())
					var fromObjToDirRad = hive.getRotationToObj();
					return [ActionType.WALK, Direction.FORWARD, fromObjToDirRad];
				}
				// search for hive
				else{
					return [ActionType.WALK, Direction.FORWARD, rand(-0.5,0.5)];
				}

			}
		}
	}
}
