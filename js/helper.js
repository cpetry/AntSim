
function rand(min, max){
	return Math.random() * (max - min) + min;
}

function degToRad(degrees){
	return degrees * Math.PI / 180;
}

function radToDeg(radians){
	return radians * 180 / Math.PI;
}

function getDistance(a, b){
	var dx = (a.x-b.x);
	var dy = (a.y-b.y);
	return Math.sqrt(dx*dx+dy*dy);
}

// reference to math behind this: http://www.euclideanspace.com/maths/algebra/vectors/angleBetween/issues/index.htm
function angleBetweenVectorsRad(fromVec, toVec){
	var nFromVec = normalize(fromVec);
	var nToVec = normalize(toVec);
	var angle = Math.atan2(nToVec.y,nToVec.x) - Math.atan2(nFromVec.y,nFromVec.x);
	if (angle >= Math.PI)
		angle -= Math.PI*2;
	else if (angle <= -Math.PI)
		angle += Math.PI*2;
	return angle;
}

function angleBetweenVectorsDeg(fromVec, toVec){
	return radToDeg(angleBetweenVectorsRad(fromVec,toVec));
}

function rotateVector(vec, radians)
{
    var xNew = vec.x * Math.cos(radians) - vec.y * Math.sin(radians);
    var yNew = vec.x * Math.sin(radians) + vec.y * Math.cos(radians);
    return { x: xNew, y: yNew };
}

function normalize(vec){
	var length = getDistance({x:0,y:0}, vec);
	var normalizedVec = {x: vec.x/length, y: vec.y/length};
	return normalizedVec;
}

// setZeroTimeout
(function() {
	var timeouts = [];
	var messageName = "zero-timeout-message";

	// Like setTimeout, but only takes a function argument.  There's
	// no time argument (always zero) and no arguments (you have to
	// use a closure).
	function setZeroTimeout(fn) {
		timeouts.push(fn);
		window.postMessage(messageName, "*");
	}

	function handleMessage(event) {
		if (event.source == window && event.data == messageName) {
			event.stopPropagation();
			if (timeouts.length > 0) {
				var fn = timeouts.shift();
				fn();
			}
		}
	}

	window.addEventListener("message", handleMessage, true);

	// Add the one thing we want added to the window object.
	window.setZeroTimeout = setZeroTimeout;
})();
