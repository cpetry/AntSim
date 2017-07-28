const _strength = Symbol('strength');
const _agility = Symbol('agility');
const _sensitivity = Symbol('sensitivity');

class AntGenetic extends Ant {
	constructor(canvas, position, rotation, settings, newGenes, allObjects, parentID){
		super (canvas, position, rotation, settings, allObjects, parentID);
		
		// Genes / attributes
		// Test if genes are chosen correctly and fair. Correct if not.
		// If all are equally chosen -> Str = Agi = Sen = 1 !
		var aThird = 1.0/3.0;
		var total = newGenes[0] + newGenes[1] + newGenes[2];
		var genes = [newGenes[0]/total/aThird, newGenes[1]/total/aThird, newGenes[2]/total/aThird]

		this[_strength]    = genes[0]; // [0.0 - 3.0]
		this[_agility]     = genes[1]; // [0.0 - 3.0]
		this[_sensitivity] = genes[2]; // [0.0 - 3.0]
		
		// Abilities
		// Strength type
		this[_decayProb]     *= (1/this[_strength]);
		this[_foodBonusProb] *= (1/this[_strength]); // less life loss when carrying food
		this[_foodMaxAnt]    *= this[_strength];
		this[_foodMaxHarvestAmount] *= this[_strength];
		// Agility type
		this[_speed]        *= this[_agility];
		this[_speedRotation] *= this[_agility]; // radians
		// Sensitivity type
		this[_smellingDistance]   *= this[_sensitivity];
		this[_visibilityDistance] *= this[_sensitivity];
		this[_visibilityRangeRad] *= this[_sensitivity];
	}
	
}