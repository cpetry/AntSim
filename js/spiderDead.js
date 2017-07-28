class AntDead extends Food {
	constructor(spider, settings, collisionObjs){
		super(spider.getCanvas(), spider.getPosition(), spider.getSize(), settings, collisionObjs);
		this[_amount] = settings.getFoodAmountDeadSpider();
	}
	
	draw(){
		var pos = this.getPosition();

		// body
		this._context.beginPath();
		this._context.arc(pos.x, pos.y, this.getSize()*0.50, 0, 2 * Math.PI, false);
		this._context.fillStyle = '#aaaaaa';
		this._context.fill();

		// head
		var dir = { x: Math.cos(this.getRotation()), y:  Math.sin(this.getRotation()) };
		var headPos = { x: pos.x + dir.x*this.getSize()*0.65, y: pos.y + dir.y*this.getSize()*0.65 };
		this._context.beginPath();
		this._context.arc(headPos.x, headPos.y, this.getSize()*0.25, 0, 2 * Math.PI, false);
		this._context.fillStyle = '#aaaaaa';
		this._context.fill();
		
		// cross on back
		this._context.lineWidth = 2;
		this._context.strokeStyle = '#ff9999';
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

			var legDir = rotateVector(legDir, legs[i].r - (i>=4 ? -1.5 : 1.5) + legTimeFactor/2);
			var part2 = { x: part1.x + legDir.x * legSize/2, y: part1.y + legDir.y * legSize/2};
			this._context.lineTo(part2.x,part2.y);

			this._context.strokeStyle = '#000000';
			this._context.stroke();
		}
		
		if (Debug.getShowFoodAmount()){
			this._context.font = "14px Arial";
			this._context.textAlign = "center";
			this._context.lineWidth = 1;
			this._context.strokeStyle = '#FFFFFF';
			this._context.strokeText(this.getAmount().toString(),pos.x,pos.y); 
			this._context.fillStyle = 'black';
			this._context.fillText(this.getAmount().toString(),pos.x,pos.y);
		}
	}
}