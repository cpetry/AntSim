const _position = Symbol('position');
const _size = Symbol('size');
const _shapeType = Symbol('shapeType');
const _rotation = Symbol('rotation');
const _canvas = Symbol('canvas');
const _id = Symbol('id');

class Collider {
	constructor(canvas, position, shapeType, size, rotation, colObjs)
	{
		this[_id] = Collider.getNewID();
		this[_canvas] = canvas;
		this._context = canvas.getContext("2d");
		this[_shapeType] = shapeType;
		this[_size] = size;
		this[_rotation] = rotation;
		var tests = 0;
		while(this.checkCollision(position, colObjs) && tests < 100){
			position = { x: position.x + rand(-20,20), y: position.y + rand(-20,20) };
			tests +=1;
		}
		if (tests==300)
			console.log("ERROR positioning object!");
		this[_position] = position;
	}
	
	static getNewID(){ 
		if (this.idCounter == null)
			this.idCounter=0;
		else
			this.idCounter+=1;
		return this.idCounter;
	}
	
	getID(){return this[_id];}
	getCanvas(){return this[_canvas];}	
	getSize(){return this[_size];}	
	getPosition() {return this[_position];}
	getPositionMat() { return convertPointToMat(this[_position]); }
	getRotation(){return this[_rotation];}
	getShapeType(){return this[_shapeType]};
	
	canInteractWith(obj){
		var distance = getDistance(obj.getPosition(),this.getPosition()) - obj.getSize() - this.getSize();
		return (distance < 10);
	}

	setNewHeading(newHeading){
		this[_rotation] = newHeading;
		this[_rotation] = this.getRotation() % (Math.PI*2);
	}
		
	setPosition(newPos, colObjs)
	{
		var distance = getDistance(newPos, this.getPosition());
		
		if (distance > 10){
			console.log("This is cheating! Please only use heading and direction!");
		}
		
		var collidesWithSth = this.checkCollision(newPos, colObjs);
		if (collidesWithSth == false){
			this[_position] = newPos;
		}
		else {
			// object is not allowed to walk into stuff! :C
		}
	}
	
	checkCollision(newPos, colObjs)
	{
		var collision = false;
		var canvasRect = { x: this.getCanvas().width/2, y: this.getCanvas().height/2, w: this.getCanvas().width-15, h: this.getCanvas().height-15 };
		var canvasArea = new Shape(canvasRect, ShapeType.RECTANGLE, 0);
		collision = !this.inside(canvasArea, newPos);
		if (collision)
			return true;
		//console.log(newPos);
		for (var i=0; i < colObjs.length; i++)
		{
			if (this != colObjs[i]
			&& this.collidesWith(colObjs[i], newPos)){
				return true;
			}
		}
		return false;
	}
	
	collidesWith(colObj, pos = this.getPosition())
	{
		var colSize = colObj.getSize();
		var colPosition = colObj.getPosition();
		if (colObj.getShapeType() == ShapeType.RECTANGLE && this.getShapeType() == ShapeType.RECTANGLE){
			try{
				if (!('w' in colSize)        || !('h' in colSize))        throw "rectangle size has to have two sizes!";
				if (!('w' in this.getSize()) || !('h' in this.getSize())) throw "rectangle size has to have two sizes!";
				var polyA = Collider.convertRectToPoly(pos, this.getSize(), this.getRotation());
				var polyB = Collider.convertRectToPoly(colPosition, colSize, colObj.getRotation());
				return Collider.checkPolygonCollition(polyA, polyB);
				
			}catch(err) {
				console.log(err);
			}	
		}
		else if (colObj.getShapeType() == ShapeType.RECTANGLE && this.getShapeType() == ShapeType.CIRCLE){
			try{
				if (!('w' in colSize) || (!'h' in colSize)) throw "rectangle size has to have two sizes!";
				if (pos.x + this.getSize() > colPosition.x - colSize.w/2
				&&  pos.y + this.getSize() > colPosition.y - colSize.h/2
				&&  pos.x - this.getSize() < colPosition.x + colSize.w/2
				&&  pos.y - this.getSize() < colPosition.y + colSize.h/2){
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
				if (!('x' in this.getSize()) || !('x' in this.getSize())) throw "rectangle size has to have two sizes!";
				if (pos.x + this.getSize().w/2 > colPosition.x - colSize
				&&  pos.y + this.getSize().h/2 > colPosition.y - colSize
				&&  pos.x - this.getSize().w/2 < colPosition.x + colSize
				&&  pos.y - this.getSize().h/2 < colPosition.y + colSize){
					return true;
				}
				else
					return false;
			}catch(err) {
				console.log(err);
			}	
		}

		else if (colObj.getShapeType() == ShapeType.CIRCLE && this.getShapeType() == ShapeType.CIRCLE){
			var distance = getDistance(pos,colPosition);
			if (distance < this.getSize() + colSize)
				return true;
			else
				return false;
		}
		else{
			//console.log(colObj.getShapeType() + " " + this.getShapeType())
			return false;
		}
	}
	
	inside(colObj, pos){
		return this.collidesWith(colObj, pos);
	}
	
	getDistanceToObject(obj){
		var o = obj.getPosition();
		var p = this.getPosition();
		return getDistance(o,p);
	}
	
	static checkRectCircleCollition(circle,rect){
		var distX = Math.abs(circle.x - rect.x);
		var distY = Math.abs(circle.y - rect.y);

		if (distX > (rect.w + circle.r)) { return false; }
		if (distY > (rect.h + circle.r)) { return false; }

		if (distX <= (rect.w)) { return true; } 
		if (distY <= (rect.h)) { return true; }

		var dx=distX-rect.w;
		var dy=distY-rect.h;
		return (dx*dx+dy*dy<=(circle.r*circle.r));
	}
	
	static convertRectToPoly(pos, size, rot){
		//console.log(pos)
		//console.log(size)
		var p = [4];
		p[0] = rotateVector({x: -size.w/2, y:-size.h/2}, rot);
		p[1] = rotateVector({x:  size.w/2, y:-size.h/2}, rot);
		p[2] = rotateVector({x:  size.w/2, y: size.h/2}, rot);
		p[3] = rotateVector({x: -size.w/2, y: size.h/2}, rot);
		for (var i=0; i<4;i++){
			p[i].x += pos.x;
			p[i].y += pos.y;
		}
		return p;
	}
	
	static checkPolygonCollition(polyA, polyB){
		var polygons = [polyA, polyB];
		var minA, maxA, projected, i, i1, j, minB, maxB;

		for (i = 0; i < polygons.length; i++) {

			// for each polygon, look at each edge of the polygon, and determine if it separates
			// the two shapes
			var polygon = polygons[i];
			for (i1 = 0; i1 < polygon.length; i1++) {

				// grab 2 vertices to create an edge
				var i2 = (i1 + 1) % polygon.length;
				var p1 = polygon[i1];
				var p2 = polygon[i2];

				// find the line perpendicular to this edge
				var normal = { x: p2.y - p1.y, y: p1.x - p2.x };

				minA = maxA = undefined;
				// for each vertex in the first shape, project it onto the line perpendicular to the edge
				// and keep track of the min and max of these values
				for (j = 0; j < polyA.length; j++) {
					projected = normal.x * polyA[j].x + normal.y * polyA[j].y;
					if (minA == undefined || projected < minA) {
						minA = projected;
					}
					if (maxA == undefined || projected > maxA) {
						maxA = projected;
					}
				}

				// for each vertex in the second shape, project it onto the line perpendicular to the edge
				// and keep track of the min and max of these values
				minB = maxB = undefined;
				for (j = 0; j < polyB.length; j++) {
					projected = normal.x * polyB[j].x + normal.y * polyB[j].y;
					if (minB == undefined || projected < minB) {
						minB = projected;
					}
					if (maxB  == undefined || projected > maxB) {
						maxB = projected;
					}
				}

				// if there is no overlap between the projects, the edge we are looking at separates the two
				// polygons, and we know there is no overlap
				if (maxA < minB || maxB < minA) {
					return false;
				}
			}
		}
		return true;
	}
	
	draw(){
		if (Debug.getShowCollider()){
			var pos = this.getPosition();
			this._context.beginPath();
			if (this.getShapeType() == ShapeType.CIRCLE){
				this._context.arc(pos.x, pos.y, this.getSize(), 0, 2 * Math.PI, false);
			}
			else if (this.getShapeType() == ShapeType.RECTANGLE){
				var size = this.getSize().valueOf();
				this._context.rect(pos.x-size.w/2, pos.y-size.h/2, size.w, size.h)
			}
			this._context.fillStyle = '#eeaaaa';
			this._context.fill();
		}
	}
}