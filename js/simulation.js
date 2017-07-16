class Simulation {
	constructor(){

		this.canvas = document.getElementById("terrarium");

		this.now;
		this.delta;
		this.then = Date.now();

		this.iteration = 0;

		this.numHives;
		this.hives = [];

		this.food = [];
		this.collisionObjects = [];
		this.environmentObjs = [];

		this.settings = new SettingsSimulation();
		this.graph = new Graph();
	}

	init(numHives=2) {
		var hiveConfigurations = [
						[{x: this.canvas.width / 2, y: this.canvas.height / 2}], // One hive
						[{x: 50, y: this.canvas.height / 2},{x: this.canvas.width - 50, y: this.canvas.height / 2}] // Two hives
						// TODO ... to be continued, but actually there should be found a better way to do this.
					];

		/*
		 * TODO As well, this code part has to adapted to only
		 *      be thrown when there is no space left or something.
		 */
		if (hiveConfigurations.length < numHives)
			throw "Number of hives selected is higher than possible!"

		// Hive creation
		for (var i = 0; i < numHives; ++i) {

			// Get hive position (with regard to hive configuration)
			var hivePos = hiveConfigurations[numHives-1][i];

			// Create hive
			this.hives.push(new Hive(this.canvas, hivePos, this.settings, this.collisionObjects)); // i = hiveNumber
		}
		
		// first hives need their ids, then ants can be created
		for (var i = 0; i < this.hives.length; ++i) {
			this.hives[i].initAnts();
		}
	}

	simulate(){

		// Iterate through all hives
		for (var i = 0; i < this.hives.length; ++i)
			this.hives[i].iterate();

		// Update food (and in case create new one)
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
		var maxFoodNmb = this.settings.getFoodMaxSiteNumber();
		var reduceByTime = this.iteration/1000.0*this.settings.getFoodCreationPropability()/10;
		var reduceBySiteNumber = (maxFoodNmb-this.food.length)/maxFoodNmb;
		var probability = (this.settings.getFoodCreationPropability()-reduceByTime)*reduceBySiteNumber;
		var createFood = Math.floor(rand(0,1+probability));
		if (createFood && this.food.length < this.settings.getFoodMaxSiteNumber()){
			// food is positioned all over the ground
			var foodPos = { x: rand(0,this.canvas.width), y: rand(0,this.canvas.height) };
			var newFood = new Food(this.canvas, foodPos, this.settings, this.collisionObjects);
			this.food.push(newFood);
			this.collisionObjects.push(newFood);
		}
	}

	getNumAnts(hiveNumber) {

		return this.hives[hiveNumber].getAnts().length;

	}

	getTotalNumAnts() {

		var totalNumAnts = 0;
		for (var i = 0; i < this.hives.length; ++i)
			totalNumAnts += getNumAnts(i);

		return totalNumAnts

	}

	clear(){
		this.canvas.getContext("2d").clearRect(0, 0, this.canvas.width, this.canvas.height);
	}

	loop(){

		// Check for game ended
		var numLivingHives = 0
		for (var i = 0; i < this.hives.length; ++i)
			if (this.hives[i].getAnts().length > 0)
				++numLivingHives;

		if (numLivingHives == 1 && this.hives.length > 1
			  || numLivingHives == 0)
		{
			this.clear();
			this.draw();
			document.getElementById('frame').value = this.iteration;
			showGraph();
			this.updateGraph();
			return;
		}

		this.now = Date.now();
		this.delta = this.now - this.then;
		var interval = 1000/SettingsGlobal.getFramesPerSecond();
		if (SettingsGlobal.getShowUI()){
			if(this.delta > interval) {
				this.then = this.now - (this.delta % interval);
				this.simulate();
				this.clear();
				this.draw();
				for (var i = 0; i < this.hives.length; ++i)
					this.graph.addPoint(this.iteration, i, this.getNumAnts(i));
				
				this.iteration++;
				document.getElementById('frame').value = this.iteration;
			}

			if (SettingsGlobal.getAutoIterateFrames())
				requestID = requestAnimationFrame(this.loop.bind(this));

		}
		else {
			this.simulate();
			for (var i = 0; i < this.hives.length; ++i)
				this.graph.addPoint(this.iteration, i, this.getNumAnts(i));
			window.setZeroTimeout(this.loop.bind(this));
			
			this.iteration++;
			if (SettingsGlobal.getShowUI() || this.iteration % 50 == 0 )
				document.getElementById('frame').value = this.iteration;
			
		}

		this.iteration++;
		if (SettingsGlobal.getShowUI() || this.iteration % 50 == 0 )
			document.getElementById('frame').value = this.iteration;
	}

	draw()
	{

		for (var i = 0; i < this.environmentObjs.length; i++)
			this.environmentObjs[i].draw();

		for (var i = 0; i < this.food.length; i++)
			this.food[i].draw();

		if (this.hives.length > 0)
			for (var i = 0; i < this.hives.length; ++i)
				this.hives[i].draw();

		for (var i = 0; i < this.hives.length; ++i)
			if (this.hives[i] instanceof Hive)
				for (var j = 0; j < this.hives[i].getAnts().length; j++)
					this.hives[i].getAnts()[j].draw();

	}

	updateGraph(){
		this.graph.updateView();
	}

}
