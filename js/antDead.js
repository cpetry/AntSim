define(['food'], function(Food) {

return class AntDead extends Food {
	constructor(ant, settings, collisionObjs){
		super(ant.getCanvas(), ant.getPosition(), ant.getSize(), settings, collisionObjs);
		this._amount = settings.getFoodAmountDeadAnt();
		this._maxAmount = this._amount;
	}
	
	draw(){
		var pos = this.getPosition();
		this._context.beginPath();
		this._context.arc(pos.x, pos.y, this.getSize()*0.7, 0, 2 * Math.PI, false);
		this._context.fillStyle = "rgba(200,30,10, " + (this._amount/this._maxAmount).toString() + ")";
		this._context.fill();
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