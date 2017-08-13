/**
 * The Controller enables the user to program his/hers ants behaviour.<br>
 * It has limited access to some of the ants current values.<br>
 * The action for the upcoming iteration is to be written by the user.<br>
 * @module Controller
 */
define(function() {

return class Controller {
	/**
     * @ignore 
     */
	constructor(animal){
		this.life = 0;
		this.size = 0;
		this.collidedWithID = -1;
		this.visibleObjs = {};
		this.smelledObjs = {};
		
		this.collidedWithID = -1;
		this.wasAttacked = false;
		
		this.memory = { };
		
		this.setAttributes(animal);
	}
	
	/**
     * @ignore 
     */
	setAttributes(animal){
		this.life = animal.getLife();
		this.size = animal.getSize();
		this.visibleObjs = animal.getVisibleObjs();
		this.smelledObjs = animal.getSmelledObjs();
		this.collidedWithID = (animal.hasCollidedWith() != null ? animal.hasCollidedWith().getID() : -1);
		this.wasAttacked = animal.wasAttacked();
		this.interactionDistance = animal.getInteractionDistance();
		this.interactionRange = animal.getInteractionRange();
	}

	/**
	* Get the current health of the ant (max: 100)
	* @return {number} life.
	*/
	getLife(){return this.life;}

	/**
	* Get the current health of the ant (max: 100)
	* @return {number} life.
	*/
	getSize(){return this.size;}

	/**
	* Get a list of all visible objects.
	* @return {Object[]} visible objects.
	*/
	getVisibleObjs(){return this.visibleObjs;}

	/**
	* Get a list of all smelled objects.
	* @return {Object[]} smelled objects.
	*/
	getSmelledObjs(){return this.smelledObjs;}

	/**
	* Get the maximum distance ants can interact with stuff
	* @return {number} distance.
	*/
	getInteractionDistance(){return this.interactionDistance;}

	/**
	* Get the maximum range ants can interact with stuff
	* @return {number} range in rad.
	*/
	getInteractionRange(){return this.interactionRange;}
	
	/**
	* Checks if the ant has collided with something in the previous iteration and returns its id.
	* Returns -1 if no collision has occured.
	* @return {number} Collision object ID.
	*/
	hasCollidedWithID() {return this.collidedWithID;}
	
	/**
	* Returns the action the ant should do in the upcoming iteration.<br>
	* This has to be an array with an ActionType and parameters.<br>
	* Some examples:<br>
	* - [ActionType.MOVE, Direction.NONE, 0] // walks straight forward<br>
	* - [ActionType.HARVEST, foodObj, 10]    // wants to harvest 10 food from foodObj<br>
	* - [ActionType.GIVEFOOD, hive, 10]      // wants to give 10 food to hive<br>
	* - [ActionType.ATTACK, enemy]           // wants to attack an enemy<br>
	* @return {number[]} Array with type and parameters.
	*/
	getAction(){
		
	}
		
	getObjectOfID(searchID){
		var searchObj = null;
		// is object of searchID visible?
		for (var id in this.visibleObjs){
			if(this.visibleObjs[id].getID() == searchID){
				searchObj = this.visibleObjs[id];
			}
		}
		
		if (searchObj == null){
			for (var id in this.smelledObjs){
				if(this.smelledObjs[id].getID() == searchID){
					searchObj = this.smelledObjs[id];
				}
			}
		}
		
		return searchObj;
	}
	
	//convenience functions for user
	getNearestObjectType(objType){
		var minDist = 1000;
		var nearestOfObjType = null;
		for (var id in this.visibleObjs){
			if (this.visibleObjs[id].getObjectType() == objType
			&& this.visibleObjs[id].getDistanceToObj() < minDist){
				minDist = this.visibleObjs[id].getDistanceToObj();
				nearestOfObjType = this.visibleObjs[id];
			}
		}
		
		if (nearestOfObjType == null){
			for (var id in this.smelledObjs){
				if (this.smelledObjs[id].getObjectType() == objType
				&& this.smelledObjs[id].getDistanceToObj() < minDist){
					minDist = this.smelledObjs[id].getDistanceToObj();
					nearestOfObjType = this.smelledObjs[id];
				}
			}
		}
		
		return nearestOfObjType;
	}
}

});