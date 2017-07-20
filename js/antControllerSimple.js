class AntControllerSimple extends AntController{
	constructor(ant){
		super(ant);
		this.memory = { harvestedFood : false };
	}

	getAction(){
		//console.log(this);
		var enoughFoodForKilling = (this.getFoodStorage() > this.getMaxFoodStorage() * 0.25)
		var foodThresholdToSearch = this.getMaxFoodStorage()*0.15;
		var searchForFood = (this.getFoodStorage() < foodThresholdToSearch);
		var foodGivingToHive = Math.max(this.getFoodStorage() - this.getMaxFoodStorage()*0.14,0);
		var nearestFood = false;
		var hive = false;

		// Check to kill some ants
		if (enoughFoodForKilling) {
			var prey = this.getNearestEnemyAnt();
			if (prey != null){
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

		// search for food
		if (searchForFood || !this.memory.harvestedFood){
			this.memory.harvestedFood = false;
				
			nearestFood = this.getNearestObjectType(ObjectType.FOOD);
			
			if (nearestFood != null ){
				var canBeHarvested = nearestFood.canBeInteractedWith();
				var isFull = (this.getFoodStorage() == this.getMaxFoodStorage());
				var canHarvestMore = (this.getFoodStorage() < this.getMaxFoodStorage());
					
				// harvest food if possible
				if(canBeHarvested && canHarvestMore){
					var harvestAmount = this.getMaxFoodStorage() - this.getFoodStorage();
					return [ActionType.HARVEST, nearestFood, harvestAmount];
				}
				// walk towards food
				else if (canHarvestMore){
					var fromObjToDirRad = nearestFood.getRotationToObj();
					if (this.hasCollidedWithID() != -1){
						return [ActionType.WALK, Direction.FORWARD, 1];
					}
					return [ActionType.WALK, Direction.FORWARD, fromObjToDirRad];
				}
				else
					this.memory.harvestedFood = true;

			}
			// search for food
			else{
				if (this.hasCollidedWithID() != -1){
					return [ActionType.WALK, Direction.FORWARD, 1];
				}
				return [ActionType.WALK, Direction.FORWARD, rand(-0.5,0.5)];
			}
		}

		// search for hive and return food
		else{

			hive = this.getOwnHive();

			if (hive != null){
				// harvest food if possible
				if(hive.canBeInteractedWith()){
					return [ActionType.GIVEFOOD, hive, foodGivingToHive];
				}
				// walk towards hive
				else {
					var fromObjToDirRad = hive.getRotationToObj();
					if (this.hasCollidedWithID() != -1){
						return [ActionType.WALK, Direction.FORWARD, 1];
					}
					return [ActionType.WALK, Direction.FORWARD, fromObjToDirRad];
				}
			}
			else{ 
				if (this.hasCollidedWithID() != -1){
					return [ActionType.WALK, Direction.FORWARD, 1];
				}
				return [ActionType.WALK, Direction.FORWARD, rand(-0.5,0.5)];
			}
			
		}
		return [ActionType.WALK, Direction.NONE, rand(-0.5,0.5)];
	}
}
