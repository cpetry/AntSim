define(['ant'], function(Ant) {

return class AntGenetic extends Ant {
	constructor(canvas, position, rotation, settings, newGenes, allObjects, parentID){
		super (canvas, position, rotation, settings, allObjects, parentID);
		
		// Genes / attributes
		// Test if genes are chosen correctly and fair. Correct if not.
		// If all are equally chosen -> Str = Agi = Sen = 1 !
		var aThird = 1.0/3.0;
		var total = newGenes[0] + newGenes[1] + newGenes[2];
		var genes = [newGenes[0]/total/aThird, newGenes[1]/total/aThird, newGenes[2]/total/aThird]

		this._strength    = genes[0]; // [0.0 - 3.0]
		this._agility     = genes[1]; // [0.0 - 3.0]
		this._sensitivity = genes[2]; // [0.0 - 3.0]
		
		// Abilities
		// Strength type
		this._decayProb     *= (1/this.getStrength());
		this._foodBonusProb *= (1/this.getStrength()); // less life loss when carrying food
		this._foodMaxAnt    *= this.getStrength();
		this._foodMaxHarvestAmount *= this.getStrength();
		// Agility type
		this._speed         *= this.getAgility();
		this._speedRotation *= this.getAgility(); // radians
		// Sensitivity type
		this._smellingDistance   *= this.getSensitivity();
		this._visibilityDistance *= this.getSensitivity();
		this._visibilityRangeRad *= this.getSensitivity();
	}
	
	getStrength(){return this._strength;}
	getAgility(){return this._agility;}
	getSensitivity(){return this._sensitivity;}
	
}

});