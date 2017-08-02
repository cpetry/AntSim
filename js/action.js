define(function() {

return class Action {

	constructor() {
		if (new.target === Action) {
			throw new TypeError("Cannot construct Action instances directly");
		}
	}
	
	static apply(obj, type, parameter1, parameter2, allObjects){
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
		
		if (type == ActionType.WALK){
			Action.walk(obj, parameter1, parameter2, allObjects);
		}
		else if (type == ActionType.HARVEST){
			Action.harvest(obj, parameter1, parameter2, allObjects);
		}
		else if (type == ActionType.ATTACK){
			Action.attack(obj, parameter1, allObjects);
		}
		else if (type == ActionType.GIVEFOOD){
			Action.transferFood(obj, parameter1, parameter2, allObjects);
		}
		else if (type == ActionType.SETPHEROMONE){
			Action.createPheromone(obj, allObjects);
		}
		else
			console.log("ActionType: " + type + " unknown!");
	}

	static walk(obj, direction, rotation, allObjects){
		// check parameters
		if (!isNaN(rotation)){
			obj.setNewRotation(obj.getRotation() + rotation);
			obj.move(direction, allObjects);
		}
	}

	static harvest(harvester, harvestObjProxy, amount, allObjects){
		if (!harvestObjProxy.canBeInteractedWith(harvester)){
			console.log("Trying to harvest out of range!")
			return;
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
		}
		else{
			console.log("wrong harvester '" + harvester.constructor.name + "' or harvestObj '" + harvestObj.constructor.name + "' ");
		}
	}
	
	static transferFood(sender, receiverProxy, foodWantingToGiveAway, allObjects){
		if (!receiverProxy.canBeInteractedWith(sender)){
			console.log("Trying to give food to something out of range!")
			return;
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
		}
	}

	static attack(hunter, preyProxy, allObjects) {
		if (!preyProxy.canBeInteractedWith(hunter)){
			console.log("Trying to attack something out of range!")
			return;
		}

		// first get real obj to proxy obj
		var prey = this.getRealObjOfID(preyProxy.getID(), allObjects);

		// do we need this check?
		if (prey.constructor.name == "Ant"
		|| prey.constructor.name == "AntGenetic"
		|| prey.constructor.name == "Spider")
			prey.receiveAttack(hunter.getAttackDamage());

	}
	
	static createPheromone(ant, allObjects){
		if (ant instanceof Ant){
			ant.createPheromone(allObjects);
		}
		else {
			throw new TypeError("Only ants can create pheromones!");
		}
	}

}

});