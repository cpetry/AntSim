class SettingsSimulation
{
	constructor(antType){
		this.hiveSize = 14;
		this.antType = antType;
		if (document.getElementById('HiveType').value == 'Custom')
			this.hiveType = HiveType.CUSTOM;
		else
			this.hiveType = HiveType.DEFAULT;
		this.antSize = 5;
		this.antStartNumber = 20;
		this.antStartPositionDistance = 40;
		this.antDecayProb = 0.05; // probability of "ageing" -> dying
		this.antFoodBonusProb = -0.005; // bonus probability to reduce "ageing" when carrying food
		this.antSmellingDistance = 50;
		this.antVisibilityDistance = 30;
		this.antVisibilityRange = 0.8;
		this.foodAmount = 1000;
		this.foodSize = 0.005; // percentage of food amount
		this.foodCreationPropability = 0.05; // chance for each iteration to create food
		this.foodMaxSiteNumber = 10; // maximum number of food sites
		this.foodMaxHive = 100; // food till next ant
		this.foodMaxAnt = 35;
		this.foodMaxHarvestAmountAnt = 1;
		this.sizeSmellingFactor = 6;
	}
	// attribute related settings
	getTerrariumWidth(){ return this.terrariumWidth; }
	getTerrariumHeight(){ return this.terrariumHeight; }
	getHiveType(){ return this.hiveType; }
	getHiveSize(){ return this.hiveSize; }
	getAntType(){ return this.antType; }
	getAntDecayProb(){ return this.antDecayProb; }
	getAntFoodBonusProb(){ return this.antFoodBonusProb; }
	getAntSize(){ return this.antSize; }
	getAntStartNumber(){ return this.antStartNumber; }
	getAntPositionDistance(){ return this.antStartPositionDistance; }
	getAntSmellingDistance() { return this.antSmellingDistance; }
	getAntVisibilityDistance() { return this.antVisibilityDistance; }
	getAntVisibilityRange() { return this.antVisibilityRange; }
	getFoodSize(){ return this.foodSize; }
	getFoodAmount(){ return this.foodAmount; }
	getFoodCreationPropability(){ return this.foodCreationPropability; }
	getFoodMaxSiteNumber(){ return this.foodMaxSiteNumber; }
	getFoodMaxHive(){ return this.foodMaxHive; }
	getFoodMaxAnt(){ return this.foodMaxAnt; }
	getFoodMaxHarvestAmountAnt(){ return this.foodMaxHarvestAmountAnt; }
	getSizeSmellingFactor() { return this.sizeSmellingFactor; }
}
