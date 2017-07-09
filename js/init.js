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

	
window.onload = function(){
	sim = new Simulation();
	sim.init();
	sim.draw();
	requestAnimationFrame(sim.draw.bind(sim));
}