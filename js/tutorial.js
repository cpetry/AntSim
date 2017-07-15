class Tutorial extends Simulation {
	constructor(){
		super();
		// first check if ant has reached food location
		this.checkAreaFood;
		
		// then check if ant has reached hive location with food
		this.checkAreaHive;
	}
	
	init(){
		// override smelling factor for an easy tutorial
		this.settings.sizeSmellingFactor = 100;

		var hivePos = {x: this.canvas.width / 4, y: this.canvas.height / 2};
		this.hives.push(new Hive(this.canvas, hivePos, this.settings, this.collisionObjects, 1));

		var foodPos = {x: this.canvas.width / 4*3, y: this.canvas.height / 2};
		var newFood = new Food(this.canvas, foodPos, this.settings, this.collisionObjects);
		this.food.push(newFood);
		
		this.checkAreaFood = new Collider(this.canvas, foodPos, ShapeType.CIRCLE, 20, 0, []);
		this.checkAreaHive = new Collider(this.canvas, hivePos, ShapeType.CIRCLE, 20, 0, []);			
	}
	
	simulate(){
		// Iterate through all hives
		for (var i = 0; i < this.hives.length; ++i)
			this.hives[i].iterate();
		if (this.hives.length>0){
			var firstAnt = this.hives[0].getAnts()[0];
			if (firstAnt.collidesWith(this.checkAreaFood)){
				console.log("Yeah! you found food.")
			}
		}
	}
	
	loop(){
		this.now = Date.now();
		this.delta = this.now - this.then;
		var interval = 1000/SettingsGlobal.getFramesPerSecond();
		if(this.delta > interval) {
			this.then = this.now - (this.delta % interval);
			this.simulate();
			this.clear();
			this.draw();
		}
		if (SettingsGlobal.getAutoIterateFrames()){
			requestID = requestAnimationFrame( this.loop.bind(this) );
		}		
	}
	
	draw(){
		super.draw();
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