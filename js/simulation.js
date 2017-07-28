class Simulation {
	constructor(antType){
		this.canvas = document.getElementById("terrarium");

		this.now;
		this.delta;
		this.then = Date.now();
		this.iteration = 0;
		
		Collider.idCounter = null; 		// reset id counter
		this.hives = [];
		this.food = [];
		this.allObjects = [];
		this.spiders = [];

		this.settings = new SettingsSimulation(antType);
		this.graph = new Graph();
		
		// simulation constructor is called directly
		if (new.target === Simulation) {
			this.init();
			this.clear();
			this.draw();
			this.loop();
		}
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
			this.hives.push(new HiveGenetic(this.canvas, hivePos, this.settings, this.allObjects)); // i = hiveNumber
		}
		
		// first hives need their ids, then ants can be created
		for (var i = 0; i < this.hives.length; ++i) 
			for (var a=0; a < this.settings.getAntStartNumber(); a++)
				this.hives[i].createAnt(this.allObjects);
	}

	simulate(){

		// Iterate through all hives
		for (var i = 0; i < this.hives.length; ++i){
			this.hives[i].iterate(this.allObjects);
			
			for (var a = 0; a < this.hives[i].getAnts().length; a++) {
				var ant = this.hives[i].getAnts()[a];
				if (ant.getLife() <= 0){
					this.hives[i].removeAnt(ant, a, this.allObjects);
					this.food.push(new AntDead(ant, this.settings, this.allObjects));
				}
			}
		}
		
		for (var i = 0; i < this.spiders.length; ++i){
			var spider = this.spiders[i]
			spider.iterate(this.allObjects);
			if (spider.getLife() <= 0){
				this.food.push(new SpiderDead(spider, this.settings, this.allObjects));
				for (var a = 0; a < this.allObjects.length; a++){
					if (allObjects[a] == spider)
					allObjects.splice(a, 1);
				}
				this.spiders.splice(i, 1);
	
			}
		}
		this.spiderCreation();

		
		// Update food (and in case create new one)
		this.foodDecay();
		this.foodCreation();
	}

	foodDecay(){

		for (var i = 0; i < this.food.length; i++) {

			this.food[i].decay();

			// remove food if it is "empty"
			if (this.food[i].isEmpty()){
				for (var a =0; a < this.allObjects.length; a++){
					if (this.allObjects[a] == this.food[i])
						this.allObjects.splice(a, 1);
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
			var size = this.settings.getFoodAmount() * this.settings.getFoodSize();
			var newFood = new Food(this.canvas, foodPos, size, this.settings, this.allObjects);
			this.food.push(newFood);
		}
	}
	
	spiderCreation(){
		var maxSpiderNmb = 2;
		var spiderCreationProb = 0.02;
		var reduceByTime = this.iteration/1000.0*spiderCreationProb/10;
		var reduceBySpiderNumber = (maxSpiderNmb-this.spiders.length)/maxSpiderNmb;
		var probability = (spiderCreationProb-reduceByTime)*reduceBySpiderNumber;
		var createSpider = Math.floor(rand(0,1+probability));
		if (createSpider && this.spiders.length < maxSpiderNmb){
			// spiders are positioned outside of canvas
			var enterFromRotation = rand(0,2*Math.PI);
			var level = 1;
			var newSpider = new Spider(this.canvas, enterFromRotation, this.settings, level, this.allObjects);
			this.spiders.push(newSpider);
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
		var ctx = this.canvas.getContext("2d")
		ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		ctx.fillStyle = "#e2decf";
		ctx.fillRect(0,0, this.canvas.width, this.canvas.height);
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

			requestID = requestAnimationFrame(this.loop.bind(this));

		}
		else {
			this.simulate();
			for (var i = 0; i < this.hives.length; ++i)
				this.graph.addPoint(this.iteration, i, this.getNumAnts(i));
			
			this.iteration++;
			if (SettingsGlobal.getShowUI() || this.iteration % 50 == 0 )
				document.getElementById('frame').value = this.iteration;
			
			window.setImmediate(this.loop.bind(this));
		}
	}

	draw()
	{
		for (var i = 0; i < this.allObjects.length; i++)
			this.allObjects[i].draw();
	}

	updateGraph(){
		this.graph.updateView();
	}

}
