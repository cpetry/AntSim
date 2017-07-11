class SmellableObjectProxy {
	constructor(canvas, position, type){
		this._context = canvas.getContext("2d");
		this.position = position;
		this.type = type;
	}

	getPosition(){ return this.position; }
	getPositionMat() { return convertPointToMat(this.position); }
	getType(){ return this.type; }
	
	draw(){
		var pos = this.position.valueOf();
		this._context.beginPath();
		this._context.arc(pos.x, pos.y, 5, 0, 2 * Math.PI, false);
		this._context.fillStyle = '#eeeeee';
		this._context.fill();
		this._context.lineWidth = 2;
		this._context.strokeStyle = '#886688';
		this._context.stroke();
	}
}