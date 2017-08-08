define(function() {

return class Action {

	constructor() {
		if (new.target === Action) {
			throw new TypeError("Cannot construct Action instances directly");
			return null;
		}
	}
	
	static apply(obj, action, allObjects){
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

		if (type == ActionType.MOVE){
			if (action.length != 3)
				throw new TypeError("ActionType.MOVE needs a direction and a rotation!");
			return Action.move(obj, parameter1, parameter2, allObjects);
		}
		else if (type == ActionType.HARVEST){
			if (action.length != 2)
				throw new TypeError("ActionType.HARVEST needs an object to harvest!");
			return Action.harvest(obj, parameter1, allObjects);
		}
		else if (type == ActionType.ATTACK){
			if (action.length != 2)
				throw new TypeError("ActionType.ATTACK needs an enemy!");
			return Action.attack(obj, parameter1, allObjects);
		}
		else if (type == ActionType.TRANSFER){
			if (action.length != 3)
				throw new TypeError("ActionType.TRANSFER needs a receiver and the amount to transfer!");
			return Action.transferFood(obj, parameter1, parameter2, allObjects);
		}
		else if (type == ActionType.PHEROMONE){
			if (action.length != 2)
				throw new TypeError("ActionType.PHEROMONE needs an additional PheromoneType argument!");
			return Action.createPheromone(obj, parameter1, allObjects);
		}
		else
			throw new TypeError("Unknown ActionType ("+ type +")!");
		return false;
	}

	/**
	* rotation is in degree relative to current heading
	*/
	static move(obj, direction, rotation, allObjects){
		// check parameters
		if (!isNaN(rotation)){
			obj.move(direction, degToRad(rotation), allObjects);
			return true;
		}
		else{
			throw new TypeError("MOVE command: direction ("+direction+") and/or rotation ("+rotation+") not set correctly!");
			return false;
		}
	}

	static harvest(harvester, harvestObjProxy, allObjects){
		if (!harvestObjProxy.canBeInteractedWith(harvester)){
			console.log("Trying to harvest out of range!")
			return false;
		}
		
		// first get real obj to proxy obj
		var harvestObj = this.getRealObjOfID(harvestObjProxy.getID(), allObjects);
		
		// now check if it can be harvested and grab food
		if (harvestObj.getObjectType() == ObjectType.FOOD
		&&  harvester.getObjectType() == ObjectType.ANT){
			var additionalFoodPossibleToCarry = harvester.getMaxFoodStorage() - harvester.getFoodStorage();
			var foodPossibleToHarvest = Math.min(harvestObj.getAmount(), harvester.getMaxHarvestAmount());
			var amountBeingHarvested = Math.min(additionalFoodPossibleToCarry, foodPossibleToHarvest);
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

		if (receiver.getObjectType() == ObjectType.HIVE
		|| receiver.getObjectType() == ObjectType.ANT){
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
	
	static createPheromone(animal, type, allObjects){
		// is animal able to create pheromones?
		if (animal.createPheromone
		&& (type == PheromoneType.ATTACK
		|| type == PheromoneType.DEFEND
		|| type == PheromoneType.FOOD
		|| type == PheromoneType.DANGER)){
			animal.createPheromone(type, allObjects);
			return true;
		}
		else {
			console.log(animal.constructor.name + " can't create pheromones!");
			return false;
		}
	}

}

});