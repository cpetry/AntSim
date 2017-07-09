class Debug
{
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
}

new Debug();