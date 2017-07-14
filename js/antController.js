// a class to contain all attributes the user has !readable! access to.
// changing these attributes while running won't do anything
class AntController {
	constructor(ant){
		this.food = 0;
		this.foodMax = 0;
		this.visibleObjs = [];
		this.smelledObjs = [];
		
		this.setAttributes(ant);
	}
	
	setAttributes(ant){
		this.food = ant.getFoodStorage();
		this.foodMax = ant.getMaxFoodStorage();
		this.visibleObjs = ant.visibleObjs;
		this.smelledObjs = ant.smelledObjs;
	}
	
	getFood(){return this.food;}
	getFoodMax(){return this.foodMax;}
	getVisibleObjs(){return this.visibleObjs;}
	getSmelledObjs(){return this.smelledObjs;}
	
	getAction(){
		
	}
}