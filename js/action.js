var ActionType = {
	NONE : 0,
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
			Action.harvest(obj, parameter1, parameter2, colObjs);
		}
		else if (type == ActionType.GIVEFOOD){
			Action.transferFood(obj, parameter1, parameter2, colObjs);
		}
		else if (type == ActionType.ATTACK){
			Action.attack(obj, parameter1, colObjs);
		}
	}

	static walk(obj, direction, rotation, colObjs){
		// check parameters
		if (!isNaN(rotation)){
			obj.setNewHeading(obj.getRotation() + rotation);
			obj.move(direction, colObjs);
		}
	}

	static harvest(harvester, harvestObjProxy, amount, colObjs){
		
		// first get real obj to proxy obj
		var objID = harvestObjProxy.getRefID();
		var harvestObj;
		for (var i=0; i< colObjs.length; i++)
			if (colObjs[i].getID() == objID){
				harvestObj = colObjs[i];
				break;
			}
		
		// now check if it can be harvested and grab food
		if (harvestObj instanceof Food && harvester instanceof Ant){
			var additionalFoodPossibleToCarry = harvester.getMaxFoodStorage() - harvester.getFoodStorage();
			var foodPossibleToHarvest = Math.min(harvestObj.getAmount(), harvester.getMaxHarvestAmount());
			var amountBeingHarvested = Math.min(Math.min(additionalFoodPossibleToCarry, foodPossibleToHarvest),amount);
			harvestObj.harvest(amountBeingHarvested);
			harvester.receiveFood(amountBeingHarvested);
		}
	}
	
	static transferFood(sender, receiverProxy, foodWantingToGiveAway, colObjs){
		var objID = receiverProxy.getRefID();
		var receiver;
		for (var i=0; i< colObjs.length; i++)
			if (colObjs[i].getID() == objID){
				receiver = colObjs[i];
				break;
			}

		if (receiver instanceof Hive || receiver instanceof Ant){
			var foodPossibleToGive = sender.getFoodStorage();
			var foodPossibleToReceive = receiver.getFoodMaxStorage() - receiver.getFoodStorage();
			var amountBeingTransferred = Math.min(Math.min(foodWantingToGiveAway, foodPossibleToGive), foodPossibleToReceive);
			receiver.receiveFood(amountBeingTransferred);
			sender.giveAwayFood(amountBeingTransferred);
		}
	}

	static attack(hunter, preyProxy, colObjs) {
		// first get real obj to proxy obj
		var objID = preyProxy.getRefID();
		var prey;
		for (var i=0; i< colObjs.length; i++)
			if (colObjs[i].getID() == objID){
				prey = colObjs[i];
				break;
			}

		if (prey instanceof Ant)
			prey.receiveAttack();

	}

}
