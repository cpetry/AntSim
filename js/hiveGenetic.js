define(['hive', 'antGenetic'], function(Hive, AntGenetic) {

return class HiveGenetic extends Hive {
	constructor(canvas, position, settings, allObjects){	
		// Super constructor
		super(canvas, position, settings, allObjects);
	}
	
	createAnt(allObjects){
		var posDistace = this.settings.getAntPositionDistance();
		var antPos = { x: rand(-posDistace,posDistace) + this.getPosition().x , y: rand(-posDistace,posDistace) + this.getPosition().y };
		var rotation = rand(0, 3.14*2); // 0 - 360°

		var newGenes = this.controller.getNewGeneCombination();
		var newAnt = new AntGenetic(this.getCanvas(), antPos, rotation, this.settings, newGenes, allObjects, this.getID());
		this.ants.push(newAnt);
	}
}

});