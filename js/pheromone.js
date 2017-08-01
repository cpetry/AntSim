define(['smellableObject'], function(SmellableObject) {

return class Pheromone extends SmellableObject {
	constructor(canvas, position, allObjects){
		var size = 1;
		var sizeSmellingFactor = 100;
		super(canvas, position, size, sizeSmellingFactor, allObjects);
		this.life = 100;
	}
	
	iterate(){
		age();
	}
	
	age(){	
		if (rand(0,1.0 + this[_decayProb]) >= 1.0)
			this[_life]-=1;
	}
}

});