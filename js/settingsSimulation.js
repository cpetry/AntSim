class SettingsSimulation
{
	constructor(){
		this.hiveSize = 14;
		this.antType = AntType.SIMPLE;
		this.antSize = 5;
		this.antStartNumber = 10;
		this.antStartPositionDistance = 40;
		this.antDecayProb = 0.05; // probability of "ageing" -> dying
		this.antFoodBonusProb = -0.02; // bonus probability to reduce "ageing" when carrying food
		this.foodAmount = 1000;
		this.foodSize = 0.005; // percentage of food amount
		this.foodCreationPropability = 0.03; // chance for each iteration to create food 
		this.foodMaxSiteNumber = 10; // maximum number of food sites 
		this.foodMaxHive = 200; // food till next ant
		this.foodMaxAnt = 20;
		this.foodMaxHarvestAmountAnt = 2;
		this.sizeSmellingFactor = 7;
	}
	// attribute related settings
	getTerrariumWidth(){ return this.terrariumWidth; }
	getTerrariumHeight(){ return this.terrariumHeight; }
	getHiveSize(){ return this.hiveSize; }
	getAntType(){ return this.antType; }
	getAntDecayProb(){ return this.antDecayProb; }
	getAntFoodBonusProb(){ return this.antFoodBonusProb; }
	getAntSize(){ return this.antSize; }
	getAntStartNumber(){ return this.antStartNumber; }
	getAntPositionDistance(){ return this.antStartPositionDistance; }
	getFoodSize(){ return this.foodSize; }
	getFoodAmount(){ return this.foodAmount; }
	getFoodCreationPropability(){ return this.foodCreationPropability; }
	getFoodMaxSiteNumber(){ return this.foodMaxSiteNumber; }
	getFoodMaxHive(){ return this.foodMaxHive; }
	getFoodMaxAnt(){ return this.foodMaxAnt; }
	getFoodMaxHarvestAmountAnt(){ return this.foodMaxHarvestAmountAnt; }
	getSizeSmellingFactor() { return this.sizeSmellingFactor; }
}