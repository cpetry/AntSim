class Debug
{
	constructor(){
		this.visibility = false;
		this.showFoodAmount = false;
	}

	static setVisibility(enabled){
		this.visibility = enabled;
	}
	static getVisibility(){
		return this.visibility;
	}
	static setShowFoodAmount(enabled){
		this.showFoodAmount = enabled;
	}
	static getShowFoodAmount(){
		return this.showFoodAmount;
	}
	static setShowSmellingDistance(enabled){
		this.showSmellingDistance = enabled;
	}
	static getShowSmellingDistance(){
		return this.showSmellingDistance;
	}
	static setShowSmelledObjects(enabled){
		this.showSmelledObjects = enabled;
	}
	static getShowSmelledObjects(){
		return this.showSmelledObjects;
	}
}

new Debug();