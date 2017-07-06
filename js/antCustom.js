class AntCustom extends Ant{
	constructor(canvas, position, collisionObjs){
	    super(canvas, position, 2, collisionObjs);
	}
	
	iterate(){
		eval(document.getElementById("customIterate").value)
	}
}