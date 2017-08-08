define(['smellableObject'], function(SmellableObject) {

return class Pheromone extends SmellableObject {
	constructor(canvas, position, parentID, size, smellingFactor, decayProb, type){
		super(canvas, position, size, smellingFactor, []);
		this._objectType = ObjectType.PHEROMONE;
		this._life = 100;
		this._parentID = parentID;
		this._maxLife = this._life;
		this._pheromoneType = type;
		this._decayProb = decayProb;
	}
	
	getPheromoneType(){ return this._pheromoneType; }
	getLife(){ return this._life; }
	getParentID(){ return this._parentID; }
	
	iterate(){
		this.age();
	}
	
	age(){	
		if (rand(0,1.0 + this._decayProb) >= 1.0)
			this._life -= 1;
	}
	
	draw(){
		if (Debug.getShowPheromones() && this._life > 0){
			var pos = this.getPosition();
			this._context.beginPath();
			var lifePerc = this._life/this._maxLife;
			this._context.arc(pos.x, pos.y, this._sizeSmellingFactor*this.getSize()*(lifePerc*lifePerc) , 0, 2 * Math.PI, false);
			this._context.strokeStyle = '#bbbbff';
			this._context.stroke();
		}
	}
}

});