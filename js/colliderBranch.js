define(['collider'], function() {

class ColliderBranch extends Collider {
	constructor(canvas, position, size, rotation, colObjs)
	{
		super(canvas, position, Shape.RECTANGLE, size, rotation, colObjs);
	}
}

});