// a class to contain all attributes the user has !readable! access to.
// changing these attributes while running won't do anything
class HiveController {
	constructor(/*ants ?!*/){
		this.genes = [0.33,0.33,0.33];
	}
	
	setNewGeneCombination(newGenes){
		this.genes = newGenes;
	}
	
	getNewGeneCombination(){
		return this.genes;
	}
}
