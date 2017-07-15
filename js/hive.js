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
		this.collisionObjs.push(this);
		this.settings = settings;
	}
	
	initAnts(antStartNumber = this.settings.getAntStartNumber()){
		// Ant creation
		for (var i=0; i < antStartNumber; i++)
			this.createAnt();
	}

	getFoodMaxStorage(){ return this[_foodMaxHive];}
	getFoodStorage(){ return this[_foodStorageHive];}
	getAnts() {return this.ants;}

	iterate(){
		for (var i = 0; i < this.ants.length; i++) {
			// setting sight and smell
			this.ants[i].setVisibleObjects(this.collisionObjs);
			this.ants[i].setSmelledObjects(this.collisionObjs);
			// get action
			let [action, parameter1, parameter2] = this.ants[i].iterate();
			// apply action
			Action.apply(this.ants[i], action, parameter1, parameter2, this.collisionObjs);

			// set decay
			this.ants[i].age();
			
			if (this.ants[i].getLife() <= 0)
				this.removeAnt(this.ants[i], i);
		}
	}

	createAnt(){

		var posDistace = this.settings.getAntPositionDistance();
		var antPos = { x: rand(-posDistace,posDistace) + this.getPosition().x , y: rand(-posDistace,posDistace) + this.getPosition().y };
		var rotation = rand(0, 3.14*2);

		var newAnt;
		newAnt = new Ant(this.getCanvas(), antPos, rotation, this.settings, this.collisionObjs, this.getID());
		this.ants.push(newAnt);
		this.collisionObjs.push(newAnt);

	}

	removeAnt(ant, index){
		for (var a =0; a < this.collisionObjs.length; a++){
			if (this.collisionObjs[a] == ant[index])
				this.collisionObjs.splice(a, 1);
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
