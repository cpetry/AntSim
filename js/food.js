class Food extends Collider {
	constructor(canvas, position, amount, collisionObjs){
		super(canvas, position, amount / 100.0, collisionObjs);
		this.amount = amount;
	}
	
	decay(){
		this.amount--;
	}
	
	isEmpty(){
		return (this.amount <=0);
	}
	
	harvest(harvestAmount){
		// if there is still enough amount
		if (harvestAmount>this.amount){
			this.amount -= harvestAmount;
			return harvestAmount;
		}
		// take all that is left
		else{
			var rest = this.amount;
			this.amount = 0;
			return rest;
		}
	}

	draw(){
		var pos = this.position.valueOf();
		var lineWidth = 2;
		this.context.beginPath();
		this.context.arc(pos[0], pos[1], this.size - lineWidth, 0, 2 * Math.PI, false);
		this.context.fillStyle = 'green';
		this.context.fill();
		this.context.lineWidth = lineWidth;
		this.context.strokeStyle = '#003300';
		this.context.stroke();
		if (Debug.getShowFoodAmount()){
			this.context.font = "14px Arial";
			this.context.textAlign = "center";
			this.context.lineWidth = 1;
			this.context.strokeStyle = '#FFFFFF';
			this.context.strokeText(this.amount.toString(),pos[0],pos[1]); 
			this.context.fillStyle = 'black';
			this.context.fillText(this.amount.toString(),pos[0],pos[1]);
		}			
	}
}