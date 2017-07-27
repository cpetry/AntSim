class Spider extends Animal {
	constructor(canvas, enterFromRotation, settings, level, collisionObjs){
		var spiderSize = settings.getSpiderSize() + settings.getSpiderSizeLevelFactor() * level;
		var position = { x: canvas.width/2, y: canvas.height/2 };
		var dir = rotateVector({x:1, y:0}, enterFromRotation);
		var w = canvas.width/2;
		var h = canvas.height/2;
		var length = Math.sqrt(w*w+h*h) + spiderSize + 10;
		dir.x = -dir.x*length;
		dir.y = -dir.y*length;
		position.x = position.x + dir.x;
		position.y = position.y + dir.y;
		super(canvas, position, spiderSize, settings, collisionObjs, enterFromRotation);
		
		// Abilities
		this[_decayProb]          = settings.getSpiderDecayProb();
		this[_speed]              = settings.getSpiderSpeed();
		this[_speedRotation]      = settings.getSpiderSpeedRotation();
		this[_smellingDistance]   = settings.getSpiderSmellingDistance();
		this[_visibilityDistance] = settings.getSpiderVisibilityDistance();
		this[_visibilityRangeRad] = settings.getSpiderVisibilityRange();
		this[_attackDamage]       = settings.getSpiderAttackDamage();
		this[_interactionDistance]= settings.getInteractionDistance();

		this[_life] = settings.getSpiderLife() * level;
		
		this[_controller] = new SpiderController(this);
		this.drawIteration = 0;
	}
	
	iterate(collisionObjs){
		this.drawIteration+=1;
		
		// Spiders enter from outside of the canvas!
		if (this[_isEntering]){
			var spiderSizeVec = rotateVector({x:-this.getSize()*2,y:0}, this.getRotation());
			var posBehindSpider = {x:this.getPosition().x+spiderSizeVec.x, y:this.getPosition().y+spiderSizeVec.y};
			var collider = this.checkCollision(posBehindSpider, collisionObjs);
			// walk towards center 
			if (collider == null)
				Action.walk(this, Direction.FORWARD, 0, collisionObjs);
		}
		else
			super.iterate(collisionObjs);
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
		
		// legs
		var legs = [{d:2, r:-2.2}, {d:5, r:-1.7}, {d:5, r:-1.2}, {d:3, r:-0.8}, 
					{d:5, r:1.2}, {d:3, r:0.8}, {d:2, r:2.2}, {d:5, r:1.7}];
		for (var i=0; i<legs.length;i++){
			this._context.beginPath();
			this._context.moveTo(pos.x, pos.y);
			var rotTime = ((this.drawIteration % 100)-50) / 50 * Math.PI * Math.PI;
			var legDir = rotateVector(dir, legs[i].r + Math.sin(rotTime) * 0.125 * (i%2 ? -1 : 1));
			var legSize = (legs[i].d + this.getSize());
			var part1 = { x: pos.x + legDir.x * legSize, y: pos.y + legDir.y * legSize};
			this._context.lineTo(part1.x,part1.y);
			this._context.strokeStyle = '#000000';
			this._context.stroke();
		}
	}
}