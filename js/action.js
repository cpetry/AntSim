define(function() {

return class Action {

	constructor() {
		if (new.target === Action) {
			throw new TypeError("Cannot construct Action instances directly");
			return null;
		}
	}
	
	static apply(obj, action, allObjects){
		if (action.length != 3)
			throw new TypeError("Actions have to be an array of 3 elements!");
		
		// create closure function useable only when applying an action
		// works somewhat like a static private function
		this.getRealObjOfID = function(objId, allObjects){
			var obj;
			for (var i=0; i< allObjects.length; i++)
				if (allObjects[i].getID() == objId){
					obj = allObjects[i];
					break;
				}
			return obj;
		}
		
		let [type, parameter1, parameter2] = action;

		if (type == ActionType.WALK){
			return Action.walk(obj, parameter1, parameter2, allObjects);
		}
		else if (type == ActionType.HARVEST){
			return Action.harvest(obj, parameter1, parameter2, allObjects);
		}
		else if (type == ActionType.ATTACK){
			return Action.attack(obj, parameter1, allObjects);
		}
		else if (type == ActionType.GIVEFOOD){
			return Action.transferFood(obj, parameter1, parameter2, allObjects);
		}
		else if (type == ActionType.SETPHEROMONE){
			return Action.createPheromone(obj, allObjects);
		}
		else
			throw new TypeError("Unknown ActionType!");
		return false;
	}

	static walk(obj, direction, rotation, allObjects){
		// check parameters
		if (!isNaN(rotation)){
			obj.setNewRotation(obj.getRotation() + rotation);
			obj.move(direction, allObjects);
			return true;
		}
		else{
			console.log("Rotation is not set: (" + rotation + ")")			
			return false;
		}
	}

	static harvest(harvester, harvestObjProxy, amount, allObjects){
		if (!harvestObjProxy.canBeInteractedWith(harvester)){
			console.log("Trying to harvest out of range!")
			return false;
		}
		
		// first get real obj to proxy obj
		var harvestObj = this.getRealObjOfID(harvestObjProxy.getID(), allObjects);
		
		// now check if it can be harvested and grab food
		if ((harvestObj.constructor.name == "Food"
		|| harvestObj.constructor.name == "AntDead"
		|| harvestObj.constructor.name == "SpiderDead")
		&& (harvester.constructor.name == "Ant" 
			|| harvester.constructor.name == "AntGenetic")){
			var additionalFoodPossibleToCarry = harvester.getMaxFoodStorage() - harvester.getFoodStorage();
			var foodPossibleToHarvest = Math.min(harvestObj.getAmount(), harvester.getMaxHarvestAmount());
			var amountBeingHarvested = Math.min(Math.min(additionalFoodPossibleToCarry, foodPossibleToHarvest),amount);
			harvestObj.harvest(amountBeingHarvested);
			harvester.receiveFood(amountBeingHarvested);
			return true;
		}
		else{
			console.log("wrong harvester '" + harvester.constructor.name + "' or harvestObj '" + harvestObj.constructor.name + "' ");
			return false;
		}
	}
	
	static transferFood(sender, receiverProxy, foodWantingToGiveAway, allObjects){
		if (!receiverProxy.canBeInteractedWith(sender)){
			console.log("Trying to give food to something out of range!")
			return false;
		}

		var receiver = this.getRealObjOfID(receiverProxy.getID(), allObjects);

		if (receiver.constructor.name == "Hive" 
		|| receiver.constructor.name == "HiveGenetic"
		|| receiver.constructor.name == "Ant"
		|| receiver.constructor.name == "AntGenetic"){
			var foodPossibleToGive = sender.getFoodStorage();
			var foodPossibleToReceive = receiver.getFoodMaxStorage() - receiver.getFoodStorage();
			var amountBeingTransferred = Math.min(Math.min(foodWantingToGiveAway, foodPossibleToGive), foodPossibleToReceive);
			receiver.receiveFood(amountBeingTransferred, allObjects);
			sender.giveAwayFood(amountBeingTransferred);
			return true;
		}
		else{
			console.log("Could not transfer food from '" + sender.constructor.name + "' to '" + receiver.constructor.name + "' ");
			return false;
		}
	}

	static attack(hunter, preyProxy, allObjects) {
		if (!preyProxy.canBeInteractedWith(hunter)){
			console.log("Trying to attack something out of range!")
			return false;
		}

		// first get real obj to proxy obj
		var prey = this.getRealObjOfID(preyProxy.getID(), allObjects);

		// check if prey can be attacked
		if (prey.receiveAttack){
			prey.receiveAttack(hunter.getAttackDamage());
			return true;
		}
		else{
			console.log("You cannot attack '" + prey.constructor.name);
			return false;
		}
	}
	
	static createPheromone(animal, allObjects){
		// is animal able to create pheromones?
		if (animal.createPheromone){
			animal.createPheromone(allObjects);
			return true;
		}
		else {
			console.log(animal.constructor.name + " can't create pheromones!");
			return false;
		}
	}

}

});