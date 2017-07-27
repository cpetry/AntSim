
class Spider extends Animal {
	constructor(canvas, enterFromRotation, settings, level, collisionObjs){
		var spiderSize = settings.getSpiderSize() + settings.getSpiderSizeLevelFactor() * level;
		var position = { x: canvas.width/2, y: canvas.height/2 }; 
		super(canvas, position, spiderSize, settings.getSizeSmellingFactor(), collisionObjs, enterFromRotation);
		
		// Abilities
		this[_decayProb]          = settings.getSpiderDecayProb();
		this[_speed]              = settings.getSpiderSpeed();
		this[_speedRotation]      = settings.getSpiderSpeedRotation();
		this[_smellingDistance]   = settings.getSpiderSmellingDistance();
		this[_visibilityDistance] = settings.getSpiderVisibilityDistance();
		this[_visibilityRangeRad] = settings.getSpiderVisibilityRange();
		this[_attackDamage]       = settings.getSpiderAttackDamage();

		this[_life] = settings.getSpiderLife() * level;
		
		this[_controller] = new SpiderController(this);
	}
	
	draw(){
		super.draw();
		var pos = this.getPosition();

		// body
		this._context.beginPath();
		this._context.arc(pos.x, pos.y, this.getSize()*0.50, 0, 2 * Math.PI, false);
		this._context.fillStyle = '#000000';
		this._context.fill();

		// head
		var dir = { x: Math.cos(this.getRotation()), y:  Math.sin(this.getRotation()) };
		var headPos = { x: pos.x + dir.x*this.getSize()*0.65, y: pos.y + dir.y*this.getSize()*0.65 };
		this._context.beginPath();
		this._context.arc(headPos.x, headPos.y, this.getSize()*0.25, 0, 2 * Math.PI, false);
		this._context.fillStyle = '#000000';
		this._context.fill();
	}
}