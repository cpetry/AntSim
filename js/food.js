define(['smellableObject'], function(SmellableObject) {

const _amount = Symbol('amount');
const _foodSize = Symbol('foodSize');

return class Food extends SmellableObject {
	constructor(canvas, position, size, settings, collisionObjs){
		super(canvas, position, size, settings.getSizeSmellingFactor(), collisionObjs);
		this._objectType = ObjectType.FOOD;
		this._amount = settings.getFoodAmount();
		this._foodSize = settings.getFoodSize();
		this._decayProb = settings.getFoodDecayProb();
	}
	
	getAmount()  {return this._amount;}
	getFoodSize(){return this._foodSize;}
	
	iterate(){
		if (rand(0,1.0 + this._decayProb) >= 1.0)
			this._amount--;
	}
	
	isEmpty(){
		return (this.getAmount() <= 0);
	}
	
	harvest(harvestAmount){
		if (harvestAmount > this.getAmount()){
			throw new TypeError("Error! Harvest food amount not possible!");
		}
		else {
			this._amount -= harvestAmount;
		}
	}

	draw(){
		super.draw();
		var pos = this.getPosition();
		var lineWidth = 1;
		this._context.beginPath();
		this._context.arc(pos.x, pos.y, this.getAmount()*this.getFoodSize() + 2, 0, 2 * Math.PI, false);
		this._context.fillStyle = '#22bb00';
		this._context.fill();
		this._context.lineWidth = lineWidth;
		this._context.strokeStyle = '#003300';
		this._context.stroke();
		if (Debug.getShowFoodAmount()){
			this._context.font = "14px Arial";
			this._context.textAlign = "center";
			this._context.lineWidth = 1;
			this._context.strokeStyle = '#FFFFFF';
			this._context.strokeText(this.getAmount().toFixed(2),pos.x,pos.y); 
			this._context.fillStyle = 'black';
			this._context.fillText(this.getAmount().toFixed(2),pos.x,pos.y);
		}
	}
}

});