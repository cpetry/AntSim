class SettingsSimulation
{
	constructor(){
		this.hiveSize = 12;
		this.antSize = 2;
		this.antStartNumber = 10;
		this.antStartPositionDistance = 30;
		this.foodAmount = 1000;
		this.foodSize = 0.005; // percentage of food amount
		this.foodCreationPropability = 0.05; // 5% chance for each iteration 
		this.foodMaxSiteNumber = 10; // maximum number of food sites 
		this.foodMaxHive = 1000;
		this.foodMaxAnt = 20;
		this.foodMaxHarvestAmountAnt = 2;
		this.sizeSmellingFactor = 7;
	}
	// attribute related settings
	getTerrariumWidth(){ return this.terrariumWidth; }
	getTerrariumHeight(){ return this.terrariumHeight; }
	getHiveSize(){ return this.hiveSize; }
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