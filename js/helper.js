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