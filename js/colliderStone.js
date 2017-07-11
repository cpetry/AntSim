class ColliderStone extends Collider {
	constructor(canvas, position, size, colObjs)
	{
		super(canvas, position, ShapeType.CIRCLE, size, 0, colObjs);
	}
	
	draw(){
		var pos = this.getPosition();
		this._context.beginPath();
		this._context.arc(pos.x, pos.y, this.getSize(), 0, 2 * Math.PI, false);
		this._context.fillStyle = '#dddddd';
		this._context.fill();
	}
}