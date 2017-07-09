class SmellableObjectProxy {
	constructor(position, type){
		this.position = position;
		this.type = type;
	}

	getPosition(){
		return this.position;
	}
	
	getType(){
		return this.type;
	}
	
	draw(){
		var pos = this.position.valueOf();
		this._context.beginPath();
		this._context.arc(pos[0], pos[1], 5, 0, 2 * Math.PI, false);
		this._context.fillStyle = '#eeeeee';
		this._context.fill();
		this._context.lineWidth = 2;
		this._context.strokeStyle = '#886688';
		this._context.stroke();
	}
}