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
}