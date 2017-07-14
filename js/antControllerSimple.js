class AntControllerSimple extends AntController{
	constructor(ant){
	    super(ant);
		this.memory = { harvestedFood : false };
	}
	
	getAction(){
		var searchForFood = (this.getFood() < this.getFoodMax());
		var nearestFood = false;
		var hive = false;

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
				var canHarvestMore = (this.getFood() < this.getFoodMax());
				
				if (!canHarvestMore)
					this.memory.harvestedFood = true;
				
				// harvest food if possible
				if(canBeHarvested && canHarvestMore){
					var harvestAmount = this.getFoodMax() - this.getFood();
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
				if(this.visibleObjs[i].getType() == "Hive"){
					hive = this.visibleObjs[i];
				}
			}
			// hive can be seen
			if (hive != false){
				console.log("see hive")
				
				// harvest food if possible
				if(hive.canBeInteractedWith()){
					this.memory.harvestedFood = false;
					return [ActionType.GIVEFOOD, hive, this.getFood()*0.85];
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
					if (this.smelledObjs[i].getType() == "Hive"){
						hive = this.smelledObjs[i];
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
	}
}