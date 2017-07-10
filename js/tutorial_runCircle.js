class TutorialRunCircle extends Simulation {
	constructor(){
		super();
		this.checkAreasBottom = [];
		this.checkAreasTop = [];
		this.checks = [];
		this.checkStates = [];
	}
	
	init(){
		var context = this.canvas.getContext("2d");
		var width  = this.canvas.width;
		var height = this.canvas.height;
		var pos = [[width/2,  height/2  ],
				   [width/4,  height/4  ],
				   [width/4  ,height/4*3],
				   [width/4*3,height/4  ],
				   [width/4*3,height/4*3]]
		for (var i=0; i<5; i++){
			var stonePos = math.matrix([pos[i][0],pos[i][1]]);
			var newStone = new ColliderStone(this.canvas, stonePos, 15, this.collisionObjects);
			this.environmentObjs.push(newStone);
			this.collisionObjects.push(newStone);

			var antPos = math.matrix([pos[i][0],pos[i][1] + 25]);
			var newAnt = new AntCustom(this.canvas, antPos, 0, this.settings, this.collisionObjects)
			this.ants.push(newAnt);
			this.collisionObjects.push(newAnt);
			
			// bottom
			var checkAreaPos = math.matrix([pos[i][0], pos[i][1] + 20]);
			var checkAreaSize = math.matrix([10,10]);
			var newCheckAreaBottom = new Collider(this.canvas, checkAreaPos, ShapeType.RECTANGLE, checkAreaSize, 0, []);
			this.checkAreasBottom.push(newCheckAreaBottom);
			var checkAreaTopPos = math.matrix([pos[i][0], pos[i][1] - 25]);
			var checkAreaTopSize = math.matrix([10,10]);
			var newCheckAreaTop = new Collider(this.canvas, checkAreaTopPos, ShapeType.RECTANGLE, checkAreaTopSize, 0, []);
			this.checkAreasTop.push(newCheckAreaTop);
			
			this.checks.push(0);
			this.checkStates.push('bottom');
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
			
			if (this.checkStates[i] == 'bottom' && this.ants[i].collidesWith(this.checkAreasBottom[i], this.ants[i].getPosition())){
				this.checkStates[i] = 'top';
				this.checks[i] ++;
			}
			else if (this.checkStates[i] == 'top' && this.ants[i].collidesWith(this.checkAreasTop[i], this.ants[i].getPosition())){
				this.checkStates[i] = 'bottom';
			}
		}
	}
	
	draw(){
		super.draw();
		/*for (var i = 0; i < this.checkAreasBottom.length; i++) {
			this.checkAreasBottom[i].draw();
		}
		for (var i = 0; i < this.checkAreasTop.length; i++) {
			this.checkAreasTop[i].draw();
		}*/
		var ctx = this.canvas.getContext("2d");
		ctx.font = "14px Arial";
		ctx.textAlign = "center";
		ctx.lineWidth = 1;
		ctx.strokeStyle = '#FFFFFF';
		for (var i =0; i< this.checks.length; i++){
			var pos = this.environmentObjs[i].getPosition().valueOf()
			ctx.strokeText(this.checks[i].toString(),pos[0],pos[1]+3); 
			ctx.fillStyle = 'black';
			ctx.fillText(this.checks[i].toString(),pos[0],pos[1]+3);
		}
	}
}