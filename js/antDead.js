class AntDead extends Food {
	constructor(canvas, position, settings, collisionObjs){
		super(canvas, position, settings.getAntSize(), settings, collisionObjs);
		this[_amount] = settings.getFoodAmountDeadAnt();
	}
	
	draw(){
		var pos = this.getPosition();
		this._context.beginPath();
		this._context.arc(pos.x, pos.y, this.getSize()*0.7, 0, 2 * Math.PI, false);
		this._context.fillStyle = '#aa2211';
		this._context.fill();
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