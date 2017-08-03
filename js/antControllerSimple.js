define(['antController'], function(AntController) {

return class AntControllerSimple extends AntController{
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
					if (prey.canBeInteractedWith(this)) {
						return [ActionType.ATTACK, prey]
					}
					else {
						var fromObjToDirRad = prey.getRotationToObj();
						return [ActionType.MOVE, DirectionType.FORWARD, fromObjToDirRad];
					}
				}
			}
		}

		// search for food
		if (searchForFood || !this.memory.harvestedFood){
			this.memory.harvestedFood = false;
				
			nearestFood = this.getNearestObjectType(ObjectType.FOOD);
			
			if (nearestFood != null ){
				var canBeHarvested = nearestFood.canBeInteractedWith(this);
				var canHarvestMore = (this.getFoodStorage() < this.getMaxFoodStorage());
					
				// harvest food if possible
				if(canBeHarvested && canHarvestMore){
					return [ActionType.HARVEST, nearestFood];
				}
				// MOVE towards food
				else if (canHarvestMore){
					var fromObjToDirRad = nearestFood.getRotationToObj();
					if (this.hasCollidedWithID() != -1){
						return [ActionType.MOVE, DirectionType.FORWARD, 30];
					}
					return [ActionType.MOVE, DirectionType.FORWARD, fromObjToDirRad];
				}
				else
					this.memory.harvestedFood = true;

			}
			// search for food
			else{
				if (this.hasCollidedWithID() != -1){
					return [ActionType.MOVE, DirectionType.FORWARD, 30];
				}
				return [ActionType.MOVE, DirectionType.FORWARD, rand(-30,30)];
			}
		}

		// search for hive and return food
		else{

			hive = this.getOwnHive();

			if (hive != null){
				// harvest food if possible
				if(hive.canBeInteractedWith(this)){
					return [ActionType.TRANSFER, hive, foodGivingToHive];
				}
				// MOVE towards hive
				else {
					var fromObjToDirRad = hive.getRotationToObj();
					if (this.hasCollidedWithID() != -1){
						return [ActionType.MOVE, DirectionType.FORWARD, 30];
					}
					return [ActionType.MOVE, DirectionType.FORWARD, fromObjToDirRad];
				}
			}
			else{ 
				if (this.hasCollidedWithID() != -1){
					return [ActionType.MOVE, DirectionType.FORWARD, 1];
				}
				return [ActionType.MOVE, DirectionType.FORWARD, rand(-30,30)];
			}
			
		}
		return [ActionType.MOVE, DirectionType.NONE, rand(-30,30)];
	}
}

});
