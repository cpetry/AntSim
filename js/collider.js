const _position = Symbol('position');
const _size = Symbol('size');
const _shapeType = Symbol('shapeType');
const _rotation = Symbol('rotation');
const _canvas = Symbol('canvas');

class Collider {
	constructor(canvas, position, shapeType, size, rotation, colObjs)
	{
		this[_canvas] = canvas;
		this._context = canvas.getContext("2d");
		this[_shapeType] = shapeType;
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
	getShapeType(){return this[_shapeType]};

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
		var canvasCenter = math.matrix([this.getCanvas().width/2, this.getCanvas().height/2]);
		var canvasSize   = math.matrix([this.getCanvas().width-15,   this.getCanvas().height-15]); // 10 border
		var canvasArea = new Shape(canvasCenter, canvasSize, ShapeType.RECTANGLE, 0);
		collision = !this.inside(canvasArea, newPos);
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
		if (colObj.getShapeType() == ShapeType.RECTANGLE && this.getShapeType() == ShapeType.RECTANGLE){
			try{
				if (colSize.valueOf().length != 2) throw "rectangle size has to be matrix!";
				if (pos.valueOf()[0] + this.getSize().valueOf()[0]/2 > colPosition.valueOf()[0] - colSize.valueOf()[0]/2
				&&  pos.valueOf()[1] + this.getSize().valueOf()[1]/2 > colPosition.valueOf()[1] - colSize.valueOf()[1]/2
				&&  pos.valueOf()[0] - this.getSize().valueOf()[0]/2 < colPosition.valueOf()[0] + colSize.valueOf()[0]/2
				&&  pos.valueOf()[1] - this.getSize().valueOf()[1]/2 < colPosition.valueOf()[1] + colSize.valueOf()[1]/2){
					return true;
				}
				else
					return false;
			}catch(err) {
				console.log(err);
			}	
		}
		else if (colObj.getShapeType() == ShapeType.RECTANGLE && this.getShapeType() == ShapeType.CIRCLE){
			try{
				if (colSize.valueOf().length != 2) throw "rectangle size has to be matrix!";
				if (pos.valueOf()[0] + this.getSize() > colPosition.valueOf()[0] - colSize.valueOf()[0]/2
				&&  pos.valueOf()[1] + this.getSize() > colPosition.valueOf()[1] - colSize.valueOf()[1]/2
				&&  pos.valueOf()[0] - this.getSize() < colPosition.valueOf()[0] + colSize.valueOf()[0]/2
				&&  pos.valueOf()[1] - this.getSize() < colPosition.valueOf()[1] + colSize.valueOf()[1]/2){
					return true;
				}
				else
					return false;
			}catch(err) {
				console.log("Input is " + err);
			}	
		}
		else if (colObj.getShapeType() == ShapeType.CIRCLE && this.getShapeType() == ShapeType.RECTANGLE){
			try{
				if (colSize.valueOf().length != 2) throw "rectangle size has to be matrix!";
				if (pos.valueOf()[0] + this.getSize().valueOf()[0]/2 > colPosition.valueOf()[0] - colSize
				&&  pos.valueOf()[1] + this.getSize().valueOf()[1]/2 > colPosition.valueOf()[1] - colSize
				&&  pos.valueOf()[0] - this.getSize().valueOf()[0]/2 < colPosition.valueOf()[0] + colSize
				&&  pos.valueOf()[1] - this.getSize().valueOf()[1]/2 < colPosition.valueOf()[1] + colSize){
					return true;
				}
				else
					return false;
			}catch(err) {
				console.log(err);
			}	
		}

		else if (colObj.getShapeType() == Shape.CIRCLE && this.getShapeType() == ShapeType.CIRCLE){
			var distance = math.norm(math.subtract(pos, colPosition),2);
			if (distance < this.getSize() + colSize)
				return true;
			else
				return false;
		}
		else
			return false;
	}
	
	inside(colObj, pos){
		return this.collidesWith(colObj, pos);
	}

	
	getDistanceToObject(obj){
		var fromTo = math.subtract(obj.getPosition(), this.getPosition());
		return math.norm(fromTo,2);
	}
	
	draw(){
		var pos = this.getPosition().valueOf();
		this._context.beginPath();
		if (this.getShapeType() == ShapeType.CIRCLE)
			this._context.arc(pos[0], pos[1], this.getSize(), 0, 2 * Math.PI, false);
		else if (this.getShapeType() == ShapeType.RECTANGLE);
			this._context.rect(pos[0], pos[1], this.getSize().valueOf()[0], this.getSize().valueOf()[1])
		this._context.fillStyle = '#eeaaaa';
		this._context.fill();
	}
}