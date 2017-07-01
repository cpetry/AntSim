class Ant extends Collider {
	constructor(canvas, position, collisionObjs){
		super(canvas, position, 2, collisionObjs);
		this.directionRad = getRandomArbitrary(0,3.14);
		this.speed = 2.5;
	}
	
	// checks and walks if possible
	walkTo(newDirection, colObjs){
		var newPos = math.add(this.position, math.multiply(newDirection, this.speed));
		
		var collision = false;
		collision = !inside(newPos, this.size, this.canvas);
		for (var i=0; i < colObjs.length; i++)
		{
			if (this != colObjs[i]
			&& this.collidesWith(colObjs[i], newPos))
				collision = true;
		}
		if (!collision)
			this.position = newPos;
		else {
			// ant is not allowed to walk into stuff! :C
		}
	}
	
	// One function the user should be able to write him/herself
	getNewDirection(){
		this.directionRad += getRandomArbitrary(-0.5,0.5);
		var direction = math.matrix([math.cos(this.directionRad), math.sin(this.directionRad)]);
		return direction;
	}
	
	draw(){
		//console.log("Draw Ant!")
		this.context.beginPath();
		this.context.arc(this.position.valueOf()[0], this.position.valueOf()[1], this.size, 0, 2 * Math.PI, false);
		this.context.fillStyle = 'black';
		this.context.fill();
		this.context.lineWidth = 2;
		this.context.strokeStyle = '#003300';
		this.context.stroke();
	}
}