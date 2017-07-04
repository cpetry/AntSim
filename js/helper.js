function inside(position, size, canvas){
	//console.log(position.valueOf());
	if (position.valueOf()[0] + size < canvas.width 
	&& position.valueOf()[1] + size < canvas.height
	&& position.valueOf()[0] - size > 0
	&& position.valueOf()[1] - size > 0)
		return true;
	else
		return false;
}

function rand(min, max){
	return Math.random() * (max - min) + min;
}

function degToRad(degrees){
	return degrees * Math.PI / 180;
}

function radToDeg(radians){
	return radians * 180 / Math.PI;
}

function angleBetweenVectorsRad(fromVec, toVec){
	var fromVecLength = math.norm(fromVec,2);
	var fromVecNorm = math.divide(fromVec, fromVecLength).valueOf();
	var toVecLength = math.norm(toVec,2);
	var toVecNorm = math.divide(toVec, toVecLength).valueOf();
	return math.atan2(toVecNorm[1],toVecNorm[0]) - math.atan2(fromVecNorm[1],fromVecNorm[0]);
}

function angleBetweenVectorsDeg(fromVec, toVec){
	return radToDeg(angleBetweenVectorsRad());
}