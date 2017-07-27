var HiveType = {
	DEFAULT : 0,
	CUSTOM : 1
}

const _foodStorageHive = Symbol('foodStorageHive');
const _foodMaxHive = Symbol('foodMaxHive');

class Hive extends SmellableObject {
	constructor(canvas, position, settings, collisionObjs){

		// Super constructor
		super(canvas, position, settings.getHiveSize(), settings.getSizeSmellingFactor(), collisionObjs);

		// Hive specific stuff
		this[_foodStorageHive] = 0;
		this[_foodMaxHive] = settings.getFoodMaxHive();

		this.ants = [];
		this.collisionObjs = collisionObjs;
		this.settings = settings;
		
		if (settings.getHiveType() == HiveType.DEFAULT)
			this.controller = new HiveController();
		else if (settings.getHiveType() == HiveType.CUSTOM)
			this.controller = new HiveControllerCustom();
	}
	
	getFoodMaxStorage(){ return this[_foodMaxHive];}
	getFoodStorage(){ return this[_foodStorageHive];}
	getAnts() {return this.ants;}

	iterate(collisionObjs){
		for (var i = 0; i < this.ants.length; i++) {
			this.ants[i].iterate(collisionObjs);
		}
	}
	
	createAnt(collisionObjs){
		var posDistace = this.settings.getAntPositionDistance();
		var antPos = { x: rand(-posDistace,posDistace) + this.getPosition().x , y: rand(-posDistace,posDistace) + this.getPosition().y };
		var rotation = rand(0, 3.14*2); // 0 - 360°

		var newAnt = new Ant(this.getCanvas(), antPos, rotation, this.settings, collisionObjs, this.getID());
		this.ants.push(newAnt);
	}

	removeAnt(ant, index, collisionObjs){
		for (var a =0; a < collisionObjs.length; a++){
			if (collisionObjs[a] == this.ants[index])
				collisionObjs.splice(a, 1);
		}
		this.ants.splice(index, 1);
	}

	receiveFood(amount){
		var additionalFood = amount;
		if (amount + this.getFoodStorage() >= this.getFoodMaxStorage()){
			var tooMuch = (amount + this.getFoodStorage()) % this.getFoodMaxStorage();
			this[_foodStorageHive] = tooMuch;
			this.createAnt()
		}
		this[_foodStorageHive] += additionalFood;
	}

	draw(){
		super.draw();
		var pos = this.getPosition();
		//console.log("Draw Hive!")
		var lineWidth = 2;
		this._context.beginPath();
		this._context.arc(pos.x, pos.y, this.getSize() - lineWidth, 0, 2 * Math.PI, false);
		this._context.fillStyle = 'brown';
		this._context.fill();
		this._context.lineWidth = lineWidth;
		this._context.strokeStyle = '#003300';
		this._context.stroke();

		// show food storage
		this._context.beginPath();
		this._context.arc(pos.x, pos.y, this.getSize(),
				1.57,
				1.57+(Math.PI*2 * this.getFoodStorage()/this.getFoodMaxStorage()), false);
		this._context.strokeStyle = '#66bb66';
		this._context.stroke();


		if (Debug.getShowFoodAmount()){
			this._context.font = "14px Arial";
			this._context.textAlign = "center";
			this._context.lineWidth = 1;
			this._context.strokeStyle = '#FFFFFF';
			this._context.strokeText(this.getFoodStorage().toString(),pos.x,pos.y);
			this._context.fillStyle = 'black';
			this._context.fillText(this.getFoodStorage().toString(),pos.x,pos.y);
		}

	}
}
