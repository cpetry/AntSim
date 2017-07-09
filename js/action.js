var ActionType = {
	WALK : 1,
	HARVEST : 2,
	ATTACK : 3,
	GIVEFOOD: 4
}


class Action {
	static apply(obj, type, parameter1, parameter2, colObjs){
		if (type == ActionType.WALK){
			Action.walk(obj, parameter1, parameter2, colObjs);
		}
		else if (type == ActionType.HARVEST){
			Action.harvest(obj, parameter1, parameter2);			
		}
		else if (type == ActionType.GIVEFOOD){
			Action.transferFood(obj, parameter1, parameter2);
		}
	}
	
	static walk(obj, direction, rotation, colObjs){
		// check parameters
		if (!isNaN(rotation)){
			obj.setNewHeading(rotation);
			obj.move(direction, colObjs);
		}
	}
	
	static harvest(harvester, harvestObj, amount){
		//console.log("harvesting")
		if (harvestObj instanceof Food && harvester instanceof Ant){
			var additionalFoodPossibleToCarry = harvester.getMaxFoodStorage() - harvester.getFoodStorage();
			var foodPossibleToHarvest = harvestObj.getAmount();
			var amountBeingHarvested = Math.min(Math.min(additionalFoodPossibleToCarry, foodPossibleToHarvest),amount);
			harvestObj.harvest(amountBeingHarvested);
			harvester.receiveFood(amountBeingHarvested);
		}
	}
	
	static transferFood(sender, receiver, foodWantingToGiveAway){
		if (receiver instanceof Hive || receiver instanceof Ant){
			var foodPossibleToGive = sender.getFoodStorage();
			var foodPossibleToReceive = receiver.getFoodMaxStorage() - receiver.getFoodStorage();
			var amountBeingTransferred = Math.min(Math.min(foodWantingToGiveAway, foodPossibleToGive), foodPossibleToReceive);
			receiver.receiveFood(amountBeingTransferred);
			sender.giveAwayFood(amountBeingTransferred);
		}
	}
}