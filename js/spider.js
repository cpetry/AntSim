define(['animal', 'spiderController', 'action'], function(Animal, SpiderController, Action) {

return class Spider extends Animal {
	constructor(canvas, enterFromRotation, settings, level, collisionObjs){
		var spiderSize = settings.getSpiderSize() + settings.getSpiderSizeLevelFactor() * level;
		
		// Start position of spider has to be outside of canvas.
		// It then walks towards the center and becomes "active"
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
		this._decayProb           = settings.getSpiderDecayProb();
		this._speed               = settings.getSpiderSpeed();
		this._speedRotation       = settings.getSpiderSpeedRotation();
		this._smellingDistance    = settings.getSpiderSmellingDistance();
		this._visibilityDistance  = settings.getSpiderVisibilityDistance();
		this._visibilityRangeRad  = settings.getSpiderVisibilityRange();
		this._attackDamage        = settings.getSpiderAttackDamage();
		this._interactionDistance = settings.getInteractionDistance();

		this._life = settings.getSpiderLife() * level;
		
		this.setController(new SpiderController(this));
		this.drawIteration = 0;
	}
	
	iterate(allObjects){
		this.drawIteration+=1;
		
		// Spiders enter from outside of the canvas!
		if (this.isEntering()){
			var spiderSizeVec = rotateVector({x:-this.getSize()*2,y:0}, this.getRotation());
			var posBehindSpider = {x:this.getPosition().x+spiderSizeVec.x, y:this.getPosition().y+spiderSizeVec.y};
			var collider = this.checkCollision(posBehindSpider, allObjects);
			// MOVE towards center 
			if (collider == null)
				Action.apply(this, [ActionType.MOVE, DirectionType.FORWARD, 0], allObjects);
		}
		else
			super.iterate(allObjects);
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
		
		// cross on back
		this._context.lineWidth = 2;
		this._context.strokeStyle = '#ff6666';
		this._context.beginPath();
		this._context.moveTo(pos.x - dir.x * this.getSize()/3, pos.y - dir.y * this.getSize()/3);
		this._context.lineTo(pos.x + dir.x * this.getSize()/3, pos.y + dir.y * this.getSize()/3);
		this._context.moveTo(pos.x + dir.y * this.getSize()/4, pos.y - dir.x * this.getSize()/4);
		this._context.lineTo(pos.x - dir.y * this.getSize()/4, pos.y + dir.x * this.getSize()/4);
		this._context.stroke();
		

		// legs
		this._context.lineWidth = 2;
		var legs = [{d:2.5, r:-2.2}, {d:2.8, r:-1.7}, {d:3, r:-1.2}, {d:3, r:-0.8}, 
					{d:3, r:1.2}, {d:3, r:0.8}, {d:2.5, r:2.2}, {d:2.8, r:1.7}];
		for (var i=0; i<legs.length;i++){
			this._context.beginPath();
			var rotTime = ((this.drawIteration % 100)-50) / 50 * Math.PI * Math.PI;
			var legTimeFactor = Math.sin(rotTime) * 0.125 * (i%2 ? -1 : 1);
			var legRotation = legs[i].r + legTimeFactor/2;
			var legDir = rotateVector(dir, legRotation);
			var legSize = (legs[i].d * this.getSize() * 0.3);
			var part1 = { x: pos.x + legDir.x * legSize, y: pos.y + legDir.y * legSize};
			this._context.moveTo(pos.x + legDir.x*this.getSize()*0.6, pos.y + legDir.y*this.getSize()*0.6);
			this._context.lineTo(part1.x,part1.y);

			var legDir = rotateVector(legDir, legs[i].r - (i>=4 ? 1.5 : -1.5) + legTimeFactor/2);
			var part2 = { x: part1.x + legDir.x * legSize/2, y: part1.y + legDir.y * legSize/2};
			this._context.lineTo(part2.x,part2.y);

			this._context.strokeStyle = '#000000';
			this._context.stroke();
		}
	}
}

});