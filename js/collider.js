define(['shape'], function(Shape) {

/**
 * An object that can collide with another one.
 */
return class Collider {
	
	/**
	* Creates a collider object
	* @constructor
	* @abstract
	* @param {object} canvas - The canvas used to draw.
    * @param {object} position - 2D position of where the object shall be created (if no collision occurs).
    * @param {ShapeType} shapeType - Type of shape the object has.
    * @param {number} size - Size of the objects collider.
    * @param {number} rotation - Rotation in radians.
	* @param {Objects[]} collisionObjs - Objects in simulation that can collide with this.
	*/
	constructor(canvas, position, shapeType, size, rotation, colObjs)
	{
		
		this._id = Collider.getNewID();
		this._canvas = canvas;
		this._context = canvas.getContext("2d");
		this._shapeType = shapeType;
		this._size = size;
		this._rotation = rotation;
		this._isEntering = this.constructor.name == "Spider"; // only used for spiders
		
		// Pheromones can not collide!
		if (this.constructor.name == "Pheromone"){
			this._position = position;
		}
		else {
			// try creating the object without colliding with sth
			var tests = 0;
			var maxTests = 300;
			
			while(this.checkCollision(position, colObjs) != null && tests < maxTests){
				position = { x: position.x + rand(-20,20), y: position.y + rand(-20,20) };
				tests +=1;
			}
			if (tests==maxTests)
				console.log("ERROR positioning object!");
			this._position = position;
			
			colObjs.push(this);
		}
	}
	
	static getNewID(){ 
		if (this.idCounter == null)
			this.idCounter=0;
		else
			this.idCounter+=1;
		return this.idCounter;
	}
	
	getID(){return this._id;}
	getCanvas(){return this._canvas;}	
	getSize(){return this._size;}	
	getPosition() {return this._position;}
	getPositionMat() { return convertPointToMat(this._position); }
	getRotation(){return this._rotation;}
	getShapeType(){return this._shapeType};
	isEntering(){return this._isEntering};
	
	canInteractWith(obj){
		var distance = getDistance(obj.getPosition(),this.getPosition()) - obj.getSize() - this.getSize();
		return (distance < 10);
	}

	setNewRotation(newRotation){
		this._rotation = newRotation;
		this._rotation = this.getRotation() % (Math.PI*2);
	}
		
	setPosition(newPos, colObjs)
	{
		var distance = getDistance(newPos, this.getPosition());
		
		if (distance > 10){
			console.log("This is cheating! Please only use heading and direction!");
		}
		
		var collider = this.checkCollision(newPos, colObjs);
		if (collider == null){
			this._position = newPos;
			return null;
		}
		else {
			return collider;
			// object is not allowed to walk into stuff! :C
		}
	}
	
	checkCollision(newPos, colObjs)
	{
		// To be able to check if object is inside canvas simply reduce canvas width and height by 3*size!
		var canvasRect = { x: this.getCanvas().width/2, y: this.getCanvas().height/2, 
							w: this.getCanvas().width-this.getSize()*3, h: this.getCanvas().height - this.getSize()*3};
		var canvasArea = new Shape(canvasRect, Shape.Type.RECTANGLE, 0);
		var collider = this.collidesWith(canvasArea, newPos);
		
		// spiders spawn from outside the canvas! 
		// They are not supposed to collide with canvas.
		if (this.constructor.name == "Spider" && this._isEntering){
			if (collider != null)
				this._isEntering = false;
			return null;
		}
		// every other object has to collide with the canvas.
		else if (collider == null){
			return { getID(){ return -1000;} };
		}
		
		for (var i=0; i < colObjs.length; i++)
		{
			if (this != colObjs[i]){
				collider = this.collidesWith(colObjs[i], newPos);
				if (collider != null)
					return collider;
			}
		}
		return null;
	}
	
	
	collidesWith(colObj, pos = this.getPosition())
	{
		var colSize = colObj.getSize();
		var colPosition = colObj.getPosition();
		var colShape = colObj.getShapeType();
		var thisShape = this.getShapeType();
		var thisSize = this.getSize();
		if (colShape == Shape.Type.RECTANGLE && thisShape == Shape.Type.RECTANGLE){
			try{
				if (!('w' in colSize)        || !('h' in colSize))        throw "rectangle size has to have two sizes!";
				if (!('w' in thisSize) || !('h' in thisSize)) throw "rectangle size has to have two sizes!";
				var polyA = Collider.convertRectToPoly(pos, thisSize, this.getRotation());
				var polyB = Collider.convertRectToPoly(colPosition, colSize, colObj.getRotation());
				if (Collider.checkPolygonCollision(polyA, polyB))
					return colObj;
				else
					return null;
				
			}catch(err) {
				console.log(err);
			}	
		}
		else if (colShape == Shape.Type.RECTANGLE && thisShape == Shape.Type.CIRCLE){
			try{
				if (!('w' in colSize) || (!'h' in colSize)) throw "rectangle size has to have two sizes!";
				if (pos.x + thisSize > colPosition.x - colSize.w/2
				&&  pos.y + thisSize > colPosition.y - colSize.h/2
				&&  pos.x - thisSize < colPosition.x + colSize.w/2
				&&  pos.y - thisSize < colPosition.y + colSize.h/2){
					return colObj;
				}
				else
					return null;
			}catch(err) {
				console.log("Input is " + err);
			}	
		}
		else if (colShape == Shape.Type.CIRCLE && thisShape == Shape.Type.RECTANGLE){
			try{
				if (!('x' in thisSize) || !('x' in thisSize)) throw "rectangle size has to have two sizes!";
				if (pos.x + thisSize.w/2 > colPosition.x - colSize
				&&  pos.y + thisSize.h/2 > colPosition.y - colSize
				&&  pos.x - thisSize.w/2 < colPosition.x + colSize
				&&  pos.y - thisSize.h/2 < colPosition.y + colSize){
					return colObj;
				}
				else
					return null;
			}catch(err) {
				console.log(err);
			}	
		}

		else if (colShape == Shape.Type.CIRCLE && thisShape == Shape.Type.CIRCLE){
			var distance = getDistance(pos,colPosition);
			if (distance < thisSize + colSize)
				return colObj;
			else
				return null;
		}
		else{
			//console.log(colObj.getShapeType() + " " + this.getShapeType())
			return null;
		}
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
	
	static checkPolygonCollision(polyA, polyB){
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
				var size = this.getSize();
				this._context.rect(pos.x-size.w/2, pos.y-size.h/2, size.w, size.h)
			}
			this._context.fillStyle = '#eeaaaa';
			this._context.fill();
		}
	}
}

});