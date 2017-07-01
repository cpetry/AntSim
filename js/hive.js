class Hive extends Collider {
	constructor(canvas, position, size, collisionObjs){
		super(canvas, position, size, collisionObjs);
	}

	draw(){
		//console.log("Draw Hive!")
		var lineWidth = 2;
		this.context.beginPath();
		this.context.arc(this.position.valueOf()[0], this.position.valueOf()[1], this.size - lineWidth, 0, 2 * Math.PI, false);
		this.context.fillStyle = 'brown';
		this.context.fill();
		this.context.lineWidth = lineWidth;
		this.context.strokeStyle = '#003300';
		this.context.stroke();
	}
}