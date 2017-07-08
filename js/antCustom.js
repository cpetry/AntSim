class AntCustom extends Ant{
	constructor(canvas, position, settings, collisionObjs){
	    super(canvas, position, settings, collisionObjs);
	}
	
	iterate(){
		eval(document.getElementById("customIterate").value)
	}
}