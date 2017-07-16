class Tutorial extends Simulation {
	constructor(part=0){
		super();
		// defines the part of the tutorial
		this.part = part;
		
		// first check if ant has reached food location
		this.checkAreaFood;
		
		// then check if ant has reached hive location with food
		this.checkAreaHive;
		
	}
	
	init(){
		// don't let ants age
		this.settings.antDecayProb = 0;
		
		var foodPos = {x: this.canvas.width / 2, y: this.canvas.height / 2};
		var newFood = new Food(this.canvas, foodPos, this.settings, this.collisionObjects);
		this.food.push(newFood);
		
		var hivePos = {x: this.canvas.width / 4, y: this.canvas.height / 2};
		this.hives.push(new Hive(this.canvas, hivePos, this.settings, this.collisionObjects));
		
		this.checkAreaFood = new Collider(this.canvas, foodPos, ShapeType.CIRCLE, 20, 0, []);
		this.checkAreaHive = new Collider(this.canvas, hivePos, ShapeType.CIRCLE, 20, 0, []);			
		
		// First ant should be some kind of a scout.
		// Explain vision, smell and basic action concept.
		// Let it find the food and walk to it.
		this.hives[0].controller.setNewGeneCombination([0.05,0.15,0.8]);
		this.hives[0].initAnts(1);
		
		// Tutorial 2 should fortify this concept and the scout is to harvest 
		// and return back to the hive with food.
		// Explain that the hive can produce ants.
		if (this.part >= 1){
			
		}

		// In tutorial 3 create different ants good for harvesting and carrying food.
		// Introduce queen advising concept to user. This time though decide for "worker type"
		// Give hive some extra food and create 3 worker ants
		if (this.part >= 2){
			
		}
		
		// For tutorial 4 create strong soldier ants to fight off spider.
		// The scout ant should help them find the spider and fight it off.
		// let the user do that by "advising" the queen.
		if (this.part >= 3){
			
		}
	}
	
	simulate(){
		// Iterate through all hives
		this.hives[0].iterate();
		
		var firstAnt = this.hives[0].getAnts()[0];
		if (firstAnt.collidesWith(this.checkAreaFood) && this.part == 0){
			// Ant has reached food 
			// end the first tutorial
			//StartTutorialPart(this.part++);
		}
		
		else if (firstAnt.collidesWith(this.checkAreaHive) && this.part == 1
		&& firstAnt.getFoodStorage() == firstAnt.getMaxFoodStorage()){
			// Ant is back at the hive
			// end the second tutorial
		}
		
		else if (firstAnt.collidesWith(this.checkAreaHive) && this.part == 2
		&& firstAnt.getFoodStorage() == firstAnt.getMaxFoodStorage()){
			// Ant has "called" other ants with pheromones to food
			// they have returned all of the food back to the hive
			// end the third tutorial
		}
		
		else if (firstAnt.collidesWith(this.checkAreaHive) && this.part == 3
		&& firstAnt.getFoodStorage() == firstAnt.getMaxFoodStorage()){
			// Spider has been killed
			// end the fourth tutorial
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