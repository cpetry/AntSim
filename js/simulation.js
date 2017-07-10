class Simulation {
	constructor(){
		this.canvas = document.getElementById("terrarium");
		this.now;
		this.then = Date.now();
		this.delta;
		this.collisionObjects = [];
		this.hive;
		this.ants = [];
		this.food = [];
		this.environmentObjs = [];
		this.settings = new SettingsSimulation();
	}

	init(){
		var context = this.canvas.getContext("2d");
		var hivePos = math.matrix([this.canvas.width/2,this.canvas.height/2]);
		this.hive = new Hive(this.canvas, hivePos, this.settings, this.collisionObjects);
		this.collisionObjects.push(this.hive);
		for (var i=0; i< this.settings.getAntStartNumber(); i++){
			var posDistace = this.settings.getAntPositionDistance();
			var antPos = math.add(math.matrix([rand(-posDistace,posDistace),rand(-posDistace,posDistace)]), hivePos);
			var rotation = rand(0, 3.14*2);
			var newAnt = new AntSimple(this.canvas, antPos, rotation, this.settings, this.collisionObjects);
			this.ants.push(newAnt);
			this.collisionObjects.push(newAnt);
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
		}
		this.foodDecay();
		this.foodCreation();
	}
	
	foodDecay(){
		for (var i = 0; i < this.food.length; i++) {
			this.food[i].decay();
			// remove food if it is "empty"
			if (this.food[i].isEmpty() && i > -1){
				for (var a =0; a < this.collisionObjects.length; a++){
					if (this.collisionObjects[a] == this.food[i])	
						this.collisionObjects.splice(a, 1);
				}
				this.food.splice(i, 1);
			}
		}
	}
	
	foodCreation(){
		// food creation
		var createFood = Math.floor(rand(0,1+this.settings.getFoodCreationPropability()));
		if (createFood && this.food.length < this.settings.getFoodMaxSiteNumber()){
			// food is positioned all over the ground
			var foodPos = math.matrix([rand(0,this.canvas.width),rand(0,this.canvas.height)]);
			var newFood = new Food(this.canvas, foodPos, this.settings, this.collisionObjects);
			this.food.push(newFood);
			this.collisionObjects.push(newFood);
		}
	}
	
	clear(){
		this.canvas.getContext("2d").clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
	
	loop(){
		this.now = Date.now();
		this.delta = this.now - this.then;
		var interval = 1000/SettingsGlobal.getFramesPerSecond();
		if(this.delta > interval) {
			this.then = this.now - (this.delta % interval);
			this.simulate();
			this.draw();
		}
			
		if (SettingsGlobal.getAutoIterateFrames()){
			requestID = requestAnimationFrame( this.loop.bind(this) );
		}
	}

	draw()
	{		
		//Clear screen
		this.canvas.getContext("2d").clearRect(0, 0, this.canvas.width, this.canvas.height);
		for (var i = 0; i < this.environmentObjs.length; i++) {
			this.environmentObjs[i].draw();
		}
		if (typeof(this.hive) !== "undefined")
			this.hive.draw();

		for (var i = 0; i < this.food.length; i++) {
			this.food[i].draw();
		}
		for (var i = 0; i < this.ants.length; i++) {
			this.ants[i].draw();
		}
	}
}