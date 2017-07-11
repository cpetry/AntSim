class TutorialRunCircle extends Simulation {
	constructor(){
		super();
		this.ants = [];
		this.checkAreasBottom = [];
		this.checkAreasTop = [];
		this.checks = [];
		this.checkStates = [];
	}
	
	init(){
		var context = this.canvas.getContext("2d");
		var width  = this.canvas.width;
		var height = this.canvas.height;
		var pos = [{x: width/2,  y: height/2  },
				   {x: width/4,  y: height/4  },
				   {x: width/4  ,y: height/4*3},
				   {x: width/4*3,y: height/4  },
				   {x: width/4*3,y: height/4*3}]
		for (var i=0; i<5; i++){
			var stonePos = { x: pos[i].x, y: pos[i].y };
			var newStone = new ColliderStone(this.canvas, stonePos, 15, this.collisionObjects);
			this.environmentObjs.push(newStone);
			this.collisionObjects.push(newStone);

			var antPos = {x: pos[i].x, y: pos[i].y + 25};
			var newAnt = new AntCustom(this.canvas, antPos, 0, this.settings, this.collisionObjects)
			this.ants.push(newAnt);
			this.collisionObjects.push(newAnt);
			
			// bottom
			var checkAreaPos = { x: pos[i].x, y: pos[i].y + 35 };
			var checkAreaSize = { w: 10, h: 30 };
			var newCheckAreaBottom = new Collider(this.canvas, checkAreaPos, ShapeType.RECTANGLE, checkAreaSize, 0, []);
			this.checkAreasBottom.push(newCheckAreaBottom);
			var checkAreaTopPos = { x: pos[i].x, y: pos[i].y - 35 };
			var checkAreaTopSize = { w: 10, h: 30 };
			var newCheckAreaTop = new Collider(this.canvas, checkAreaTopPos, ShapeType.RECTANGLE, checkAreaTopSize, 0, []);
			this.checkAreasTop.push(newCheckAreaTop);
			
			this.checks.push(0);
			this.checkStates.push('top');
		}
	}
	
	simulate(){
		for (var i = 0; i < this.ants.length; i++) {
			// setting sight and smell
			this.ants[i].setVisibleObjects(this.collisionObjects);
			this.ants[i].setSmelledObjects(this.collisionObjects);
			// get action
			let [action, parameter1, parameter2] = this.ants[i].iterate();
			// apply action
			Action.apply(this.ants[i], action, parameter1, parameter2, this.collisionObjects);
			
			if (this.checkStates[i] == 'bottom' 
			&& this.ants[i].collidesWith(this.checkAreasBottom[i], this.ants[i].getPosition())){
				this.checkStates[i] = 'top';
				this.checks[i] ++;
			}
			else if (this.checkStates[i] == 'top' 
			&& this.ants[i].collidesWith(this.checkAreasTop[i], this.ants[i].getPosition())){
				this.checkStates[i] = 'bottom';
			}
		}
	}
	
	draw(){
		if (Debug.getShowCollider()){
			for (var i = 0; i < this.checkAreasBottom.length; i++) {
				this.checkAreasBottom[i].draw();
			}
			for (var i = 0; i < this.checkAreasTop.length; i++) {
				this.checkAreasTop[i].draw();
			}
		}
		super.draw();
		for (var i = 0; i < this.ants.length; i++) {
			this.ants[i].draw();
		}
		var ctx = this.canvas.getContext("2d");
		ctx.font = "14px Arial";
		ctx.textAlign = "center";
		ctx.lineWidth = 1;
		ctx.strokeStyle = '#FFFFFF';
		for (var i =0; i< this.checks.length; i++){
			var pos = this.environmentObjs[i].getPosition()
			ctx.strokeText(this.checks[i].toString(),pos.x,pos.y+3); 
			ctx.fillStyle = 'black';
			ctx.fillText(this.checks[i].toString(),pos.x,pos.y+3);
		}
	}
	
	showMessage(){
		$.fancybox.open([`<div class="info" style="overflow:hidden;font-family:Georgia" align="left">		
				<h1>Tutorial 1</h1>
				<p>
					Goal of this first tutorial is to understand handling ants.
					
					Ants can do each iteration exactly one of the following things:
					- Walk
					- Harvest
					- Give food (to another ant or the queen)
					
					So lets learn about that one at a time...
				</p>`, 
				`<div style="overflow:hidden;font-family:Georgia" align="left">		
				<h1>Tutorial 1</h1>
				<p>
					Goal of this first tutorial is to understand handling ants.
					
					Ants can do each iteration exactly one of the following things:
					- Walk
					- Harvest
					- Give food (to another ant or the queen)
					
					So lets learn about that one at a time...
				</p>`]);
	}
}