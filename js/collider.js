const _position = Symbol('position');
const _size = Symbol('size');
const _shape = Symbol('shape');
const _rotation = Symbol('rotation');
const _canvas = Symbol('canvas');

var Shape = {
	CIRCLE : 1,
	SQUARE : 2,
	RECTANGLE : 3
}

class Collider {
	constructor(canvas, position, shape, size, rotation, colObjs)
	{
		this[_canvas] = canvas;
		this._context = canvas.getContext("2d");
		this[_shape] = shape;
		this[_size] = size;
		this[_rotation] = rotation;
		while(this.checkCollision(position, colObjs)){
			position = math.add(math.matrix([rand(-10,10),rand(-10,10)]), position);
		}
		this[_position] = position;
	}
	
	getCanvas(){return this[_canvas];}	
	getSize(){return this[_size];}	
	getPosition() {return this[_position];}	
	getRotation(){return this[_rotation];}

	canInteractWith(obj){
		var distance = math.norm(math.subtract(obj.getPosition(),this.getPosition()), 2) - obj.getSize() - this.getSize();
		return (distance < 10);
	}

	setNewHeading(newHeading){
		this[_rotation] = newHeading;
		this[_rotation] = this.getRotation() % (Math.PI*2);
	}
		
	setPosition(newPos, colObjs)
	{
		var distance = math.norm(math.subtract(newPos, this.getPosition()),2);
		
		//if (this instanceof AntSimle)
		//	console.log("AntSimple")
		
		if (distance > 10){
			console.log("This is cheating! Please only use heading and direction!");
		}
		
		if (!this.checkCollision(newPos, colObjs)){
			// 
			this[_position] = newPos;
		}
		else {
			// object is not allowed to walk into stuff! :C
		}
	}
	
	checkCollision(newPos, colObjs)
	{
		var collision = false;
		collision = !this.inside(newPos);
		for (var i=0; i < colObjs.length; i++)
		{
			if (this != colObjs[i]
			&& this.collidesWith(colObjs[i], newPos))
				collision = true;
		}
		return collision;
	}
	
	collidesWith(colObj, pos)
	{
		var colSize = colObj.getSize();
		var colPosition = colObj.getPosition();
		if (pos.valueOf()[0] + this.getSize() > colPosition.valueOf()[0] - colSize 
		&&  pos.valueOf()[1] + this.getSize() > colPosition.valueOf()[1] - colSize
		&&  pos.valueOf()[0] - this.getSize() < colPosition.valueOf()[0] + colSize
		&&  pos.valueOf()[1] - this.getSize() < colPosition.valueOf()[1] + colSize){
			//console.log("Collision!");
			return true;
		}
		else
			return false;
	}
	
	inside(pos){
		//console.log(position.valueOf());
		if (pos.valueOf()[0] + this.getSize() < this.getCanvas().width 
		&& pos.valueOf()[1] + this.getSize() < this.getCanvas().height
		&& pos.valueOf()[0] - this.getSize() > 0
		&& pos.valueOf()[1] - this.getSize() > 0)
			return true;
		else
			return false;
	}

	
	getDistanceToObject(obj){
		var fromTo = math.subtract(obj.getPosition(), this.getPosition());
		return math.norm(fromTo,2);
	}
	
}