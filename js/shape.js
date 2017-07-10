var ShapeType = {
	CIRCLE : 1,
	SQUARE : 2,
	RECTANGLE : 3
}


class Shape {
	constructor(position, size, shapeType, rotation){
		this[_shapeType] = shapeType;
		this[_size] = size;
		this[_rotation] = rotation;
		this[_position] = position;		
	}
	getSize(){return this[_size];}	
	getPosition() {return this[_position];}	
	getRotation(){return this[_rotation];}
	getShapeType(){return this[_shapeType]};
}