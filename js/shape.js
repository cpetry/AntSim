define(function() {

return class Shape {
	constructor(dimensions, shapeType, rotation){
		this._shapeType = shapeType;
		this._size = { w: dimensions.w, h: dimensions.h };
		this._rotation = rotation;
		this._position = { x: dimensions.x, y: dimensions.y };		
	}	
	
	getSize(){return this._size ;}	
	getPosition() {return this._position;}	
	getRotation(){return this._rotation;}
	getShapeType(){return this._shapeType};
}

});