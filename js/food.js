const _amount = Symbol('amount');
const _foodSize = Symbol('foodSize');

class Food extends SmellableObject {
	constructor(canvas, position, settings, collisionObjs){
		var size = settings.getFoodAmount() * settings.getFoodSize();
		super(canvas, position, size, settings.getSizeSmellingFactor(), collisionObjs);
		this[_amount] = settings.getFoodAmount();
		this[_foodSize] = settings.getFoodSize();
		collisionObjs.push(this);
	}
	
	getAmount()  {return this[_amount];}
	getFoodSize(){return this[_foodSize];}
	
	decay(){
		this[_amount]--;
	}
	
	isEmpty(){
		return (this.getAmount() <= 0);
	}
	
	harvest(harvestAmount){
		if (harvestAmount > this.getAmount()){
			console.log("Error! Harvest food amount not possible!");
			this[_amount] = 0;
		}
		else {
			this[_amount] -= harvestAmount;
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
			this._context.strokeText(this.getAmount().toString(),pos.x,pos.y); 
			this._context.fillStyle = 'black';
			this._context.fillText(this.getAmount().toString(),pos.x,pos.y);
		}
	}
}