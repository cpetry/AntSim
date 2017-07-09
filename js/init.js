// rAF
window.requestAnimationFrame = function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        function(f) {
            window.setTimeout(f,1e3/60);
        }
}();

SettingsGlobal.setFramesPerSecond(document.getElementById('fps').value);
SettingsGlobal.setAutoIterateFrames(document.getElementById('autoFrame').checked);

Debug.setVisibility(document.getElementById('debugVisibility').checked);
Debug.setShowFoodAmount(document.getElementById('debugFoodAmount').checked);
Debug.setShowSmellingDistance(document.getElementById('debugSmellingDistance').checked);
Debug.setShowSmelledObjects(document.getElementById('debugSmelledObjects').checked);

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
			var newAnt = new AntSimple(this.canvas, antPos, this.settings, this.collisionObjects)
			this.ants.push(newAnt);
			this.collisionObjects.push(newAnt);
		}
	}

	simulate(){
		for (var i = 0; i < this.ants.length; i++) {
			this.ants[i].setVisibleObjects(this.collisionObjects);
			this.ants[i].setSmelledObjects(this.collisionObjects);
			
			let [action, parameter1, parameter2] = this.ants[i].iterate();
			
			if (action == Action.WALK){
				// check parameters
				if (!isNaN(parameter2)){
					this.ants[i].setNewHeading(parameter2);
					this.ants[i].move(parameter1, this.collisionObjects);
				}
			}
			else if (action == Action.HARVEST){
				//console.log("harvesting")
				if (parameter1 instanceof Food){
					var foodToHarvest = parameter1;
					var additionalFoodPossibleToCarry = this.ants[i].getMaxFoodStorage() - this.ants[i].getFoodStorage();
					var foodPossibleToHarvest = foodToHarvest.getAmount();
					var amountBeingHarvested = Math.min(Math.min(additionalFoodPossibleToCarry, foodPossibleToHarvest),parameter2);
					foodToHarvest.harvest(amountBeingHarvested);
					this.ants[i].receiveFood(amountBeingHarvested);
				}
			}
			else if (action == Action.GIVEFOOD){
				if (parameter1 instanceof Hive){
					var receiver = parameter1;
					var foodWantingToGiveAway = parameter2;
					var foodPossibleToGive = this.ants[i].getFoodStorage();
					var foodPossibleToReceive = receiver.getFoodMaxStorage() - receiver.getFoodStorage();
					var amountBeingTransferred = Math.min(Math.min(foodWantingToGiveAway, foodPossibleToGive), foodPossibleToReceive);
					receiver.receiveFood(amountBeingTransferred);
					this.ants[i].giveAwayFood(amountBeingTransferred);
				}
			}
		}
		
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
		var createFood = Math.floor(rand(0,1+this.settings.getFoodCreationPropability()));
		if (createFood && this.food.length < this.settings.getFoodMaxSiteNumber()){
			// food is positioned all over the ground
			var foodPos = math.matrix([rand(0,this.canvas.width),rand(0,this.canvas.height)]);
			var newFood = new Food(this.canvas, foodPos, this.settings, this.collisionObjects);
			this.food.push(newFood);
			this.collisionObjects.push(newFood);
		}
		
	}

	draw()
	{
		this.now = Date.now();
		this.delta = this.now - this.then;
		var interval = 1000/SettingsGlobal.getFramesPerSecond();
		if(this.delta > interval) {
			this.then = this.now - (this.delta % interval);
			this.simulate();
			
			//Clear screen
			this.canvas.getContext("2d").clearRect(0, 0, this.canvas.width, this.canvas.height);
			this.hive.draw();

			for (var i = 0; i < this.food.length; i++) {
				this.food[i].draw();
			}
			for (var i = 0; i < this.ants.length; i++) {
				this.ants[i].draw();
			}
		}
		
		if (SettingsGlobal.getAutoIterateFrames()){
			requestAnimationFrame( this.draw.bind(this) );
		}
	}
}
	
window.onload = function(){
	sim = new Simulation();
	sim.init();
	sim.draw();
	requestAnimationFrame(sim.draw.bind(sim));
}