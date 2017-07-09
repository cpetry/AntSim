const _foodStorageHive = Symbol('foodStorageHive');
const _foodMaxHive = Symbol('foodMaxHive');

class Hive extends SmellableObject {
	constructor(canvas, position, settings, collisionObjs){
		super(canvas, position, settings.getHiveSize(), settings.getSizeSmellingFactor(), collisionObjs);
		this[_foodStorageHive] = 0;
		this[_foodMaxHive] = settings.getFoodMaxHive();
	}
	
	getFoodMaxStorage(){ return this[_foodMaxHive];}
	getFoodStorage(){ return this[_foodStorageHive];}
	
	receiveFood(amount){
		var additionalFood = amount;
		if (amount + this.getFoodStorage() > this.getFoodMaxStorage()){
			// should not happen!
			console.log("ERROR - Too much food received!")
			var tooMuch = (amount + this.getFoodStorage()) % this.getMaxFoodStorage();
			additionalFood = amount - tooMuch;
		}
		this[_foodStorageHive] += additionalFood;
	}

	draw(){
		super.draw();
		var pos = this.getPosition().valueOf();
		//console.log("Draw Hive!")
		var lineWidth = 2;
		this._context.beginPath();
		this._context.arc(pos[0], pos[1], this.getSize() - lineWidth, 0, 2 * Math.PI, false);
		this._context.fillStyle = 'brown';
		this._context.fill();
		this._context.lineWidth = lineWidth;
		this._context.strokeStyle = '#003300';
		this._context.stroke();
		if (Debug.getShowFoodAmount()){
			this._context.font = "14px Arial";
			this._context.textAlign = "center";
			this._context.lineWidth = 1;
			this._context.strokeStyle = '#FFFFFF';
			this._context.strokeText(this.getFoodStorage().toString(),pos[0],pos[1]); 
			this._context.fillStyle = 'black';
			this._context.fillText(this.getFoodStorage().toString(),pos[0],pos[1]);
		}

	}
}