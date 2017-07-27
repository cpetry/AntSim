class HiveGenetic extends Hive {
	constructor(canvas, position, settings, collisionObjs){	
		// Super constructor
		super(canvas, position, settings, collisionObjs);
	}
	
	
	createAnt(){
		var posDistace = this.settings.getAntPositionDistance();
		var antPos = { x: rand(-posDistace,posDistace) + this.getPosition().x , y: rand(-posDistace,posDistace) + this.getPosition().y };
		var rotation = rand(0, 3.14*2); // 0 - 360°

		var newGenes = this.controller.getNewGeneCombination();
		var newAnt = new AntGenetic(this.getCanvas(), antPos, rotation, this.settings, newGenes, this.collisionObjs, this.getID());
		this.ants.push(newAnt);
	}
}