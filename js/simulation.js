define(['hiveGenetic', 'antDead', 'spider', 'spiderDead', 'collider', 'graph', 'food', 'pheromone'], 
function(HiveGenetic, AntDead, Spider, SpiderDead, Collider, Graph, Food, Pheromone) {

return class Simulation {
	constructor(canvas, settings, finishedFunc = null){
		if (typeof(showGraph) !== 'undefined' )
			showGraph(false);
		Simulation.isFinished = false;
		this.canvas = canvas;
		this.finishedFunc = finishedFunc;

		this.now;
		this.delta;
		this.then = Date.now();
		this.iteration = 0;

		Collider.idCounter = null; 		// reset id counter
		this.hives = [];
		this.food = [];
		this.allObjects = [];
		this.spiders = [];
		this.settings = settings;

		// simulation constructor is called directly
		if (new.target === Simulation) {
			this.graph = new Graph();
			this.init();
			this.clear();
			this.draw();
			this.loop();
		}
	}

	init(numHives=2) {
		var hiveConfigurations = [
						[{x: this.canvas.width / 2, y: this.canvas.height / 2}], // One hive
						[{x: 50, y: this.canvas.height / 2},{x: this.canvas.width - 50, y: this.canvas.height / 2}], // Two hives
						[{x: this.canvas.width * 1 / 3, y: this.canvas.height * 2 / 3},{x: this.canvas.width * 2 / 3, y: this.canvas.height * 2 / 3},{x: this.canvas.width / 2, y: this.canvas.height * 1 / 3}], // Three hives
						[{x: this.canvas.width * 1 / 4, y: this.canvas.height * 3 / 4},{x: this.canvas.width * 3 / 4, y: this.canvas.height * 3 / 4},{x: this.canvas.width * 1 / 4, y: this.canvas.height * 1 / 4},{x: this.canvas.width * 3 / 4, y: this.canvas.height * 1 / 4}]  // Four hives
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
	
	getHiveIndexFromParentID(parentID){
		for (var i = 0; i < this.hives.length; ++i){
			if (this.hives[i].getID() == parentID)
				return i;
		}
		throw new TypeError("No hive found that matches ants parentID");
	}

	getAntIndexFromID(parentID, ID){
		var ants = this.hives[parentID].getAnts();
		for (var i = 0; i < ants.length; ++i){
			if (ants[i].getID() == ID)
				return i;
		}
		throw new TypeError("No ant found that matches ants ID");
	}
	
	getIndex(array, obj){
		for (var i = 0; i < array.length; ++i){
			if (array[i] == obj)
				return i;
		}
		throw new TypeError("No food found that matches obj");
	}
	
	iterate(){
		// Iterate through all objects
		for (var i = 0; i < this.allObjects.length; ++i){
			var obj = this.allObjects[i];
			
			// all living objects can die
			if (obj.getLife && obj.getLife() <= 0){
				// is an ant
				if (obj.getObjectType() == ObjectType.ANT){
					var h = this.getHiveIndexFromParentID(obj.getParentID())
					var a = this.getAntIndexFromID(h, obj.getID())
					if (obj.wasAttacked()){
						obj.createPheromone(PheromoneType.DANGER, this.allObjects);
					}
					this.hives[h].removeAnt(obj, a, this.allObjects);
					this.food.push(new AntDead(obj, this.settings, this.allObjects));
				}
				else if (obj.getObjectType() == ObjectType.PHEROMONE){
					this.allObjects.splice(i, 1);
				}
				// is a spider
				else if (obj.getObjectType() == ObjectType.SPIDER){
					var s = this.getIndex(this.spiders, obj)
					this.food.push(new SpiderDead(obj, this.settings, this.allObjects));
					this.allObjects.splice(i, 1);
					this.spiders.splice(s, 1);
				}
			}
			// is empty food
			else if (obj.getObjectType() == ObjectType.FOOD && obj.isEmpty()){
				this.allObjects.splice(i, 1);
				this.food.splice(this.getIndex(this.food, obj), 1);
			}
			
			// all living objects that can do sth now do it!
			else if (obj.iterate)
				obj.iterate(this.allObjects);
		}
	}

	simulate(){
		this.iterate();

		this.spiderCreation();
		this.foodCreation();
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
		ctx.fillStyle = "#f7f6ed";
		ctx.fillRect(0,0, this.canvas.width, this.canvas.height);
	}

	loop(){

		// Check for game ended
		var numLivingClans = 0
		for (var i = 0; i < this.hives.length; ++i)
			if (this.hives[i].getAnts().length > 0)
				++numLivingClans;

		if (numLivingClans == 1 && this.hives.length > 1
		  || numLivingClans == 0)
		{
			// create a list of hive stats
			var hiveStats = [];
			for (var i = 0; i < this.hives.length; ++i){
				this.hives[i].sumupStats();
				hiveStats.push(this.hives[i]._stats);
			}			
			Simulation.isFinished = true;
			this.clear();
			this.draw();
			document.getElementById('frame').value = this.iteration;

			if (typeof(showGraph) !== 'undefined' )
				showGraph(true);
			this.graph.setStats(hiveStats);
			this.updateGraph();

			if (this.finishedFunc != null)
				this.finishedFunc()

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
				this.iteration++;
				document.getElementById('frame').value = this.iteration;
				
				for (var i = 0; i < this.hives.length; ++i)
					this.graph.addPoint(this.iteration, i, this.getNumAnts(i));

			}

			requestID = requestAnimationFrame(this.loop.bind(this));

		}
		else {
			this.simulate();
			this.iteration++;
			document.getElementById('frame').value = this.iteration;
			
			for (var i = 0; i < this.hives.length; ++i)
				this.graph.addPoint(this.iteration, i, this.getNumAnts(i));

			
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

});
