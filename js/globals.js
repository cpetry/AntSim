/**
 * Enum for ActionType
 * @readonly
 * @enum {number}
 */
 const ActionType = {
	NONE : 0,
	MOVE : 1,
	HARVEST : 2,
	ATTACK : 3,
	TRANSFER: 4,
	PHEROMONE: 5
};

/**
 * Enum for DirectionType
 * @readonly
 * @enum {number}
 */
const DirectionType = {
  FORWARD: 1,
  BACKWARD: 2,
  NONE: 3
};

/**
 * Enum for PheromoneType
 * @readonly
 * @enum {number}
 */
const PheromoneType = {
	NONE : 0,
	ATTACK : 1,
	DEFEND : 2,
	FOOD : 3,
	DANGER: 4
};

/**
 * Enum for ObjectType
 * @readonly
 * @enum {number}
 */
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
	CUSTOM: 0,
	SIMPLE: 1,
	NEURALNET : 2
}

const HiveType = {
	DEFAULT : 0,
	CUSTOM : 1
}

const SimulationMode = {
	SOLO : 0,
	COMPETITIVE : 1
}

const _FILL_STYLE_TABLE = ['#000000','#ff0000','#00ff00','#0000ff']; // Ant color per hive

/**
 * Returns a random value between min and max.
 * @param {number} min - Lower threshold.
 * @param {number} max - Upper threshold.
 * @return {number} random number.
 */
function rand(min, max){
	return Math.random() * (max - min) + min;
}

/** 
 * Returns a number converted from radians to degree.
 * @param {number} degree.
 * @return {number} radians.
 */
function degToRad(degrees){
	return degrees * Math.PI / 180;
}

/** 
 * Returns a number converted from degree to radians.
 * @param {number} radians.
 * @return {number} degree.
 */
function radToDeg(radians){
	return radians * 180 / Math.PI;
}

/** 
 * Gets the distance between to points.
 * @param {dict} Point a.
 * @param {dict} Point b.
 * @return {number} distance.
 */
function getDistance(a, b){
	var dx = (a.x-b.x);
	var dy = (a.y-b.y);
	return Math.sqrt(dx*dx+dy*dy);
}

/** 
 * Gets the angle in radians between to vectors [-PI,PI].
 * @param {dict} Vector a.
 * @param {dict} Vector b.
 * @return {number} angle in radians.
 */
function angleBetweenVectorsRad(fromVec, toVec){
	// reference to math behind this: http://www.euclideanspace.com/maths/algebra/vectors/angleBetween/issues/index.htm
	var nFromVec = normalize(fromVec);
	var nToVec = normalize(toVec);
	var angle = Math.atan2(nToVec.y,nToVec.x) - Math.atan2(nFromVec.y,nFromVec.x);
	if (angle >= Math.PI)
		angle -= Math.PI*2;
	else if (angle <= -Math.PI)
		angle += Math.PI*2;
	return angle;
}

/** 
 * Gets the angle in degree between to vectors [-180,180].
 * @param {dict} Vector a.
 * @param {dict} Vector b.
 * @return {number} angle in degree.
 */
function angleBetweenVectorsDeg(fromVec, toVec){
	return radToDeg(angleBetweenVectorsRad(fromVec,toVec));
}

/** 
 * Rotates a vector by given radians.
 * @param {dict} Vector.
 * @param {number} Rotation given in radians.
 * @return {dict} Rotated vector.
 */
function rotateVector(vec, radians)
{
    var xNew = vec.x * Math.cos(radians) - vec.y * Math.sin(radians);
    var yNew = vec.x * Math.sin(radians) + vec.y * Math.cos(radians);
    return { x: xNew, y: yNew };
}

/** 
 * Gets the normalized vector.
 * @param {dict} Vector.
 * @return {dict} Normalized vector.
 */
function normalize(vec){
	var length = getDistance({x:0,y:0}, vec);
	var normalizedVec = {x: vec.x/length, y: vec.y/length};
	return normalizedVec;
}

/** 
 * Gets the position inside a list of the maximum value.
 * @param {list} List of numbers.
 * @return {number} Position of the maximum value.
 */
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

/** 
 * Gets the maximum value in a list.
 * @param {list} List of numbers.
 * @return {number} Maximum value.
 */
function maxElement(tlist) {
	var max = -9e8;
	for (var i = 0; i < tlist.length; ++i) {
		if (tlist[i] > max) {
			max = tlist[i];
		}
	}
	return max;
}

function createEditor(elementID, defaultValue){
	var antControllerWordCompleter = {
		getCompletions: function(editor, session, pos, prefix, callback) {
			var wordList = AntController.getAutoCompletionWordList();
			callback(null, wordList.map(function(word) {
				return {
					caption: word,
					value: word,
					meta: "This ant"
				};
			}));
		}
	}
	var globalWordCompleter = {
		getCompletions: function(editor, session, pos, prefix, callback) {
			var wordList = ["this."];
			callback(null, wordList.map(function(word) {
				return {
					caption: word,
					value: word,
					meta: "global"
				};
			}));
		}
	}
	ace.require("ace/ext/language_tools");
	var customAntEditor = ace.edit(elementID);
	customAntEditor.$blockScrolling = Infinity;
	customAntEditor.setTheme("ace/theme/chrome");
	customAntEditor.session.setMode("ace/mode/javascript");
	customAntEditor.setOptions({
		enableBasicAutocompletion: true,
		enableLiveAutocompletion: true
	});
	customAntEditor.completers = [globalWordCompleter, antControllerWordCompleter];
	customAntEditor.setValue(defaultValue, -1); // -1 set cursor to begin
	return customAntEditor;
}

function isFunction(functionToCheck) {
  var getType = {};
  return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}