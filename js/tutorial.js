define([ 'simulation', 'ant', 'antGenetic', 'hive', 'hiveGenetic', 'food', 'collider', 'shape'], 
function(Simulation, Ant, AntGenetic, Hive, HiveGenetic, Food, Collider, Shape) {

return class Tutorial extends Simulation {
	constructor(canvas, settings, finishedFunc, part=0){
		super(canvas, settings);
		// defines the part of the tutorial
		this.finishedFunc = finishedFunc;
		this.isFinished = false;
		this.part = part;
		
		// first check if ant has reached food location
		this.checkAreaFood;
		
		// then check if ant has reached hive location with food
		this.checkAreaHive;

		if (new.target === Tutorial) {
			this.init();
			this.clear();
			this.draw();
			this.loop();
		}		
	}
	
	init(){
		// don't let ants age
		this.settings.antDecayProb = 0;
		this.settings.foodDecayProb = 0;
		
		var foodPos = {x: this.canvas.width / 4*3, y: this.canvas.height / 2};
		var size = this.settings.getFoodAmount() * this.settings.getFoodSize();
		var newFood = new Food(this.canvas, foodPos, size, this.settings, this.allObjects);
		this.food.push(newFood);
		
		var hivePos = {x: this.canvas.width / 4, y: this.canvas.height / 2};
		this.hives.push(new HiveGenetic(this.canvas, hivePos, this.settings, this.allObjects));
		
		this.checkAreaFood = new Collider(this.canvas, foodPos, ShapeType.CIRCLE, newFood.getSize()+5, 0, []);
		this.checkAreaHive = new Collider(this.canvas, hivePos, ShapeType.CIRCLE, this.hives[0].getSize()+5, 0, []);			
		
		// First ant should be some kind of a scout.
		// Explain vision, smell and basic action concept.
		// Let it find the food and MOVE to it.
		var newGenes = [0.15,0.15,0.7];
		var antPos = { x: 30 + this.hives[0].getPosition().x , y: this.hives[0].getPosition().y };
		var rotation = 1.57; // downwards
		var newAnt = new AntGenetic(this.canvas, antPos, rotation, this.settings, newGenes, this.allObjects, this.hives[0].getID());
		this.hives[0].ants.push(newAnt);
		//this.hives[0].createAnt(this.allObjects);
		
		// Tutorial 2 should fortify this concept and the scout is to harvest 
		// and return back to the hive with food.
		// Explain that the hive can produce ants.

		// In tutorial 3 create different ants good for harvesting and carrying food.
		// Introduce queen advising concept to user. This time though decide for "worker type"
		// Give hive some extra food and create 3 worker ants
		if (this.part == 4){
			var newGenes = [0.7,0.15,0.15];
			var antPos = { x: this.hives[0].getPosition().x , y: 30 + this.hives[0].getPosition().y };
			var rotation = 3.14; // left
			for (var i=0; i<2;i++){
				var newAnt = new AntGenetic(this.canvas, antPos, rotation, this.settings, newGenes, this.allObjects, this.hives[0].getID());
				this.hives[0].ants.push(newAnt);
			}
		}
		
		// For tutorial 4 create strong soldier ants to fight off spider.
		// The scout ant should help them find the spider and fight it off.
		// let the user do that by "advising" the queen.
		if (this.part >= 4){
			
		}
	}
	
	simulate(){		
		var firstAnt = this.hives[0].getAnts()[0];
		if (this.part == 1
		&& firstAnt.collidesWith(this.checkAreaFood)
		&& firstAnt.getAngleToPos(this.checkAreaFood.getPosition()) < 0.1
		){
			// Ant has reached food 
			// end the first tutorial
			this.isFinished = true;
			this.finishedFunc();
		}
		
		else if (this.part == 2
		&& firstAnt.collidesWith(this.checkAreaHive) 
		&& firstAnt.getFoodStorage() == firstAnt.getMaxFoodStorage()){
			// Ant is full and back at the hive
			// end the second tutorial
			this.isFinished = true;
			this.finishedFunc();
		}
		
		else if (this.part == 3
		&& this.hives[0].ants.length == 2){
			// Another ant was created! woohoo!
			// end the third tutorial
			this.isFinished = true;
			this.finishedFunc();
		}

		else if (this.part == 4
		&& this.hives[0].ants.length == 5
		&& this.iteration < 1500){
			this.isFinished = true;
			this.finishedFunc();
		}
		
		else if (firstAnt.collidesWith(this.checkAreaHive) && this.part == 4
		&& firstAnt.getFoodStorage() == firstAnt.getMaxFoodStorage()){
			// Spider has been killed
			// end the fourth tutorial
		}
		
		super.iterate();
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
			this.iteration++;
		}
		requestID = requestAnimationFrame( this.loop.bind(this) );		
	}
	
	draw(){
		super.draw();
		var ctx = this.canvas.getContext("2d")
		if (this.isFinished){
			ctx.font = "18px Times New Roman";
			ctx.textAlign = "center";
			ctx.lineWidth = 1;
			ctx.fillStyle = 'black';
			ctx.fillText("Congratulations!",this.canvas.width/2,this.canvas.height/5*4);
		}
	}
}

});