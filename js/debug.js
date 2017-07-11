class Debug
{
	static setVisibility(enabled){
		this.visibility = enabled;
	}
	static getVisibility(){
		return this.visibility;
	}
	static setShowLife(enabled){
		this.showLife = enabled;
	}
	static getShowLife(){
		return this.showLife;
	}
	static setShowCollider(enabled){
		this.collider = enabled;
	}
	static getShowCollider(){
		return this.collider
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