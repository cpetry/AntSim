const _amount = Symbol('amount');

class Food extends SmellableObject {
	constructor(canvas, position, settings, collisionObjs){
		super(canvas, position, settings.getFoodAmount() * settings.getFoodSize(), settings.getSizeSmellingFactor(), collisionObjs);
		this[_amount] = settings.getFoodAmount();
	}
	
	getAmount(){
		return this[_amount];
	}
	
	decay(){
		this[_amount]--;
	}
	
	isEmpty(){
		return (this.getAmount() <= 0);
	}
	
	harvest(harvestAmount){
		// if there is still enough amount
		if (harvestAmount>this.getAmount()){
			this[_amount] -= harvestAmount;
			return harvestAmount;
		}
		// take all that is left
		else{
			var rest = this.getAmount();
			this[_amount] = 0;
			return rest;
		}
	}

	draw(){
		var pos = this.getPosition().valueOf();
		var lineWidth = 2;
		if (Debug.getShowSmellingDistance()){
			super.draw();
		}
		this._context.beginPath();
		this._context.arc(pos[0], pos[1], this.getSize() - lineWidth, 0, 2 * Math.PI, false);
		this._context.fillStyle = 'green';
		this._context.fill();
		this._context.lineWidth = lineWidth;
		this._context.strokeStyle = '#003300';
		this._context.stroke();
		if (Debug.getShowFoodAmount()){
			this._context.font = "14px Arial";
			this._context.textAlign = "center";
			this._context.lineWidth = 1;
			this._context.strokeStyle = '#FFFFFF';
			this._context.strokeText(this.getAmount().toString(),pos[0],pos[1]); 
			this._context.fillStyle = 'black';
			this._context.fillText(this.getAmount().toString(),pos[0],pos[1]);
		}
	}
}