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


var canvas       = document.getElementById("terrarium"),
	context      = canvas.getContext("2d"),
	width        = canvas.width,
	height       = canvas.height;
var now;
var then = Date.now();
var delta;

var collisionObjects = [];
var hive;
var ants = [];
var food = [];

Settings.setFramesPerSecond(document.getElementById('fps').value);
Settings.setAutoIterateFrames(document.getElementById('autoFrame').checked);

Debug.setVisibility(document.getElementById('debugVisibility').checked);
Debug.setShowFoodAmount(document.getElementById('debugFoodAmount').checked);
Debug.setShowSmellingDistance(document.getElementById('debugSmellingDistance').checked);
Debug.setShowSmelledObjects(document.getElementById('debugSmelledObjects').checked);

function init(){
	var hivePos = math.matrix([width/2,height/2]);
	var hiveSize = Settings.getHiveSize();
	hive = new Hive(canvas, hivePos, hiveSize, collisionObjects);
	collisionObjects.push(hive);
	for (var i=0; i< Settings.getAntStartNumber(); i++){
		var posDistace = Settings.getAntPositionDistance();
		var antPos = math.add(math.matrix([rand(-posDistace,posDistace),rand(-posDistace,posDistace)]), hivePos);
		var newAnt = new AntCustom(canvas, antPos, collisionObjects)
		ants.push(newAnt);
		collisionObjects.push(newAnt);
	}
}

function simulate(){
	for (var i = 0; i < ants.length; i++) {
		ants[i].setVisibleObjects(collisionObjects);
		ants[i].setSmelledObjects(collisionObjects);
		ants[i].iterate();
		ants[i].move(collisionObjects);
	}
	
	for (var i = 0; i < food.length; i++) {
		food[i].decay();
		// remove food if it is "empty"
		if (food[i].isEmpty() && i > -1){
			for (var a =0; a < collisionObjects.length; a++){
				if (collisionObjects[a] == food[i])	
					collisionObjects.splice(a, 1);
			}
			food.splice(i, 1);
		}
	}
	var createFood = Math.floor(rand(0,1+Settings.getFoodCreationPropability()));
	if (createFood && food.length < Settings.getFoodMaxSiteNumber()){
		// food is positioned all over the ground
		var foodPos = math.matrix([rand(0,canvas.width),rand(0,canvas.height)]);
		var newFood = new Food(canvas, foodPos, Settings.getFoodAmount(), collisionObjects)
		food.push(newFood);
		collisionObjects.push(newFood);
	}
	
}

function draw(){
	now = Date.now();
	delta = now - then;
	var interval = 1000/Settings.getFramesPerSecond();
	if(delta > interval) {
		then = now - (delta % interval);
		simulate();
		
		//Clear screen
		context.clearRect(0, 0, width, height);
		hive.draw();

		for (var i = 0; i < food.length; i++) {
			food[i].draw();
		}
		for (var i = 0; i < ants.length; i++) {
			ants[i].draw();
		}
	}
	
	if (Settings.getAutoIterateFrames())
		requestAnimationFrame(draw);
}
	
window.onload = function(){
	init();
	draw();
	requestAnimationFrame(draw);
}