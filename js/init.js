var Mode = {
	TEASER : 0,
	TUTORIAL : 1
}

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
Debug.setColliderVisibility(document.getElementById('debugColliderVisibility').checked);
Debug.setShowFoodAmount(document.getElementById('debugFoodAmount').checked);
Debug.setShowSmellingDistance(document.getElementById('debugSmellingDistance').checked);

var mode;
var sim;
var requestID;
window.onload = function(){
	sim = new Simulation();
	sim.init();
	sim.loop();
	mode = Mode.TEASER;
}

function run(){
	SettingsGlobal.setAutoIterateFrames(true);
	sim.loop();
}

function reset(){
	startTutorial();
	SettingsGlobal.setAutoIterateFrames(false);
	sim.clear();
	sim.draw();
}

function startTutorial(){
	window.cancelAnimationFrame(requestID);
	requestID = undefined;
	SettingsGlobal.setAutoIterateFrames(true);
	sim = new TutorialRunCircle();
	sim.init();
	sim.draw();
	mode = Mode.TUTORIAL;
}