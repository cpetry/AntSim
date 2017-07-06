class Hive extends Collider {
	constructor(canvas, position, size, collisionObjs){
		super(canvas, position, size, collisionObjs);
	}

	draw(){
		//console.log("Draw Hive!")
		var lineWidth = 2;
		this._context.beginPath();
		this._context.arc(this.getPosition().valueOf()[0], this.getPosition().valueOf()[1], this.getSize() - lineWidth, 0, 2 * Math.PI, false);
		this._context.fillStyle = 'brown';
		this._context.fill();
		this._context.lineWidth = lineWidth;
		this._context.strokeStyle = '#003300';
		this._context.stroke();
	}
}