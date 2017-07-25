/**
 * The AntController enables the user to program his/hers ants behaviour.<br>
 * It has limited access to some of the ants current values.<br>
 * The action for the upcoming iteration is to be written by the user.<br>
 */
class AntController {
  /**
   * @ignore 
   */
	constructor(ant){
		this.parentID = 0;
		this.life = 0;
		this.food = 0;
		this.foodMax = 0;
		this.collidedWithID = -1;
		this.visibleObjs = {};
		this.smelledObjs = {};
		
		this.collidedWithID = -1;
		this.wasAttacked = false;
		
		this.memory = { };
		
		this.setAttributes(ant);
	}
	
	static getAutoCompletionWordList(){
		return ["getFoodStorage()",
				"getLife()", 
				"getMaxFoodStorage()",
				"getNearestEnemyAnt()",
				"getNearestObjectType()",
				"getObjectOfID()",
				"getOwnHive()",
				"getParentID()",
				"getSmelledObjs()",
				"getVisibleObjs()", 
				];
	}
	
	setAttributes(ant){
		this.parentID = ant.getParentID();
		this.life = ant.getLife();
		this.food = ant.getFoodStorage();
		this.foodMax = ant.getMaxFoodStorage();
		this.visibleObjs = ant.visibleObjs;
		this.smelledObjs = ant.smelledObjs;
		this.collidedWithID = (ant.hasCollidedWith() != null ? ant.hasCollidedWith().getID() : -1);
		this.wasAttacked = ant.wasAttacked();
	}
	
	/**
	* Get the ID of the ants hive
	* @return {number} parentID.
	*/
	getParentID(){return this.parentID;}

	/**
	* Get the current health of the ant (max: 100)
	* @return {number} life.
	*/
	getLife(){return this.life;}

	/**
	* Get the current food the ant carries around.
	* @return {number} food.
	*/
	getFoodStorage(){return this.food;}

	/**
	* Get the maximum amount of food the ant can carry.
	* @return {number} maximum food.
	*/
	getMaxFoodStorage(){return this.foodMax;}

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
	* Checks if the ant has collided with something in the previous iteration and returns its id.
	* Returns -1 if no collision has occured.
	* @return {number} Collision object ID.
	*/
	hasCollidedWithID() {return this.collidedWithID;}
	
	/**
	* Returns the action the ant should do in the upcoming iteration.<br>
	* This has to be an array with an ActionType and parameters.<br>
	* Some examples:<br>
	* - [ActionType.WALK, Direction.NONE, 0] // walks straight forward<br>
	* - [ActionType.HARVEST, foodObj, 10]    // wants to harvest 10 food from foodObj<br>
	* - [ActionType.GIVEFOOD, hive, 10]      // wants to give 10 food to hive<br>
	* - [ActionType.ATTACK, enemy]           // wants to attack an enemy<br>
	* @return {number[]} Array with type and parameters.
	*/
	getAction(){
		
	}
	
	getNearestEnemyAnt(){
		var minDist = 1000;
		var prey = null;
		for (var id in this.visibleObjs){
			if(this.visibleObjs[id].getType() == ObjectType.ANT
			&& this.visibleObjs[id].getParentID() != this.getParentID()
			&& this.visibleObjs[id].getDistanceToObj() < minDist){
				minDist = this.visibleObjs[id].getDistanceToObj();
				var prey = this.visibleObjs[id];
			}
		}
		if(prey==null){
			for (var id in this.smelledObjs){
				if(this.smelledObjs[id].getType() == ObjectType.ANT
				&& this.smelledObjs[id].getParentID() != this.getParentID()
				&& this.smelledObjs[id].getDistanceToObj() < minDist){
					minDist = this.smelledObjs[id].getDistanceToObj();
					var prey = this.smelledObjs[id];
				}
			}
		}
		return prey;		
	}
	
	getOwnHive(){
		var hive = null;
		for (var id in this.visibleObjs){
			if (this.visibleObjs[id].getType() == ObjectType.HIVE
			&& this.visibleObjs[id].getParentID() == this.getParentID()){
				hive = this.visibleObjs[id];
			}
		}
		
		// no food visible -> try smelling
		if (hive == null){
			for (var id in this.smelledObjs){
				if (this.smelledObjs[id].getType() == ObjectType.HIVE
				&& this.smelledObjs[id].getParentID() == this.getParentID()){
					hive = this.smelledObjs[id];
				}
			}
		}
		
		return hive;
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
		// is some food visible?
		for (var id in this.visibleObjs){
			if (this.visibleObjs[id].getType() == objType
			&& this.visibleObjs[id].getDistanceToObj() < minDist){
				minDist = this.visibleObjs[id].getDistanceToObj();
				nearestOfObjType = this.visibleObjs[id];
			}
		}
		
		// no food visible -> try smelling
		if (nearestOfObjType == null){
			for (var id in this.smelledObjs){
				if (this.smelledObjs[id].getType() == objType
				&& this.smelledObjs[id].getDistanceToObj() < minDist){
					minDist = this.smelledObjs[id].getDistanceToObj();
					nearestOfObjType = this.smelledObjs[id];
				}
			}
		}
		
		return nearestOfObjType;
	}
	
}