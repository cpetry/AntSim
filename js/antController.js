// a class to contain all attributes the user has !readable! access to.
// changing these attributes while running won't do anything
class AntController {
	constructor(ant){
		this.parentID = 0;
		this.life = 0;
		this.food = 0;
		this.foodMax = 0;
		this.visibleObjs = {};
		this.smelledObjs = {};
		this.memory = { };
		
		this.setAttributes(ant);
	}
	
	static getAutoCompletionWordList(){
		return ["getParentID()",
				"getLife()", 
				"getFoodStorage()", 
				"getMaxFoodStorage()",
				"getVisibleObjs()", 
				"getSmelledObjs()"];
	}
	
	setAttributes(ant){
		this.parentID = ant.getParentID();
		this.life = ant.getLife();
		this.food = ant.getFoodStorage();
		this.foodMax = ant.getMaxFoodStorage();
		this.visibleObjs = ant.visibleObjs;
		this.smelledObjs = ant.smelledObjs;
	}
	
	getParentID(){return this.parentID;}
	getLife(){return this.life;}
	getFoodStorage(){return this.food;}
	getMaxFoodStorage(){return this.foodMax;}
	getVisibleObjs(){return this.visibleObjs;}
	getSmelledObjs(){return this.smelledObjs;}
	
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