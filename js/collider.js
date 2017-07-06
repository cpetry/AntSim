const _position = Symbol('position');
const _size = Symbol('size');

class Collider {
	constructor(canvas, position, size, colObjs)
	{
		this._canvas = canvas;
		this._context = canvas.getContext("2d");
		this[_size] = size;
		while(this.checkCollision(position, colObjs)){
			position = math.add(math.matrix([rand(-10,10),rand(-10,10)]), position);
		}
		this[_position] = position;
	}
	
	getSize()
	{
		return this[_size];
	}
	
	getPosition()
	{
		return this[_position];
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
		collision = !inside(newPos, this.getSize(), this._canvas);
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
	
	
	getDistanceToObject(obj){
		var fromTo = math.subtract(obj.getPosition(), this.getPosition());
		return math.norm(fromTo,2);
	}
	
}