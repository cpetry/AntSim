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

(function(window, document){

    var canvas       = document.getElementById("terrarium"),
        context      = canvas.getContext("2d"),
        width        = canvas.width,
        height       = canvas.height;
    var now;
    var then = Date.now();
	var fps = 10;
	var interval = 1000/fps;
	var delta;
	
	var collisionObjects = [];
	var hive;
	var ants = [];
	
	function init(){
		var hivePos = math.matrix([width/2,height/2]);
		hive = new Hive(canvas, hivePos, 12, collisionObjects);
		collisionObjects.push(hive);
		for (var i=0; i< 10; i++){
			var antPos = math.add(math.matrix([getRandomArbitrary(-50,50),getRandomArbitrary(-50,50)]), hivePos);
			var newAnt = new Ant(canvas, antPos, collisionObjects)
			ants.push(newAnt);
			collisionObjects.push(newAnt);
		}
	}
	init();
			
    function draw(){
        requestAnimationFrame(draw);
		now = Date.now();
		delta = now - then;
		
		if(delta > interval) {
			then = now - (delta % interval);
			//Clear screen
			context.clearRect(0, 0, width, height);
			hive.draw();
			for (var i = 0; i < ants.length; i++) {
				var newDirection = ants[i].getNewDirection();
				ants[i].walkTo(newDirection, collisionObjects);
				ants[i].draw();
			}
        }
        
    }
    draw();

}(this, this.document))