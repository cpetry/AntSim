const ActionType = {
	NONE : 0,
	MOVE : 1,
	HARVEST : 2,
	ATTACK : 3,
	TRANSFER: 4,
	PHEROMONE: 5
};

const DirectionType = {
  FORWARD: 1,
  BACKWARD: 2,
  NONE: 3
};

const PheromoneType = {
	NONE : 0,
	ATTACK : 1,
	DEFEND : 2,
	FOOD : 3,
	DANGER: 4
};


const ObjectType = {
	NONE : 0,
	HIVE : 1,
	FOOD : 2,
	ANT : 3,
	SPIDER : 4,
	PHEROMONE : 5
};

const ShapeType = {
	CIRCLE : 1,
	SQUARE : 2,
	RECTANGLE : 3
};


const AntType = {
	SIMPLE: 0,
	CUSTOM: 1
}

const HiveType = {
	DEFAULT : 0,
	CUSTOM : 1
}

const _FILL_STYLE_TABLE = ['#000000','#ff0000','#00ff00','#0000ff']; // Ant color per hive


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


function argmax(tlist) {
	var max = -9e8;
	var maxarg = -1;
	for (var i = 0; i < tlist.length; ++i) {
		if (tlist[i] > max) {
			max = tlist[i];
			maxarg = i;
		}
	}
	return maxarg;
}
function maxElement(tlist) {
	var max = -9e8;
	for (var i = 0; i < tlist.length; ++i) {
		if (tlist[i] > max) {
			max = tlist[i];
		}
	}
	return max;
}