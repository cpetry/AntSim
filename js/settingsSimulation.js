class SettingsSimulation
{
	constructor(antType, hiveType=HiveType.DEFAULT){
		this.hiveSize = 14;
		this.antType = antType;
		this.hiveType = hiveType;
		this.antSize = 5;
		this.antStartNumber = 20;
		this.antStartPositionDistance = 40;
		this.antLife = 100;
		this.antSpeed = 2.5;
		this.antAttackDamage = 1;
		this.antSpeedRotation = 0.2; // radians
		this.antDecayProb = 0.05; // probability of "ageing" -> dying
		this.antFoodBonusProb = -0.005; // bonus probability to reduce "ageing" when carrying food
		this.antSmellingDistance = 50;
		this.antVisibilityDistance = 30;
		this.antVisibilityRange = 0.8;
		this.foodAmount = 1000;
		this.foodAmountDeadAnt = 50;
		this.foodSize = 0.005; // percentage of food amount
		this.foodCreationPropability = 0.05; // chance for each iteration to create food
		this.foodMaxSiteNumber = 10; // maximum number of food sites
		this.foodMaxHive = 100; // food till next ant
		this.foodMaxAnt = 35;
		this.foodMaxHarvestAmountAnt = 1;
		this.spiderSize = 10;
		this.spiderSizeLevelFactor = 3;
		this.spiderLife = 1000;
		this.spiderSpeed = 1;
		this.spiderSpeedRotation = 0.05; // radians
		this.spiderAttackDamage = 3;
		this.spiderDecayProb = 0.05;
		this.spiderSmellingDistance = 50;
		this.spiderVisibilityDistance = 30;
		this.spiderVisibilityRange = 0.8;
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
	getAntLife(){ return this.antLife; }
	getAntSpeed(){ return this.antSpeed; }
	getAntSpeedRotation(){ return this.antSpeedRotation; }
	getAntAttackDamage() { return this.antAttackDamage; }
	getAntPositionDistance(){ return this.antStartPositionDistance; }
	getAntSmellingDistance() { return this.antSmellingDistance; }
	getAntVisibilityDistance() { return this.antVisibilityDistance; }
	getAntVisibilityRange() { return this.antVisibilityRange; }
	getSpiderSize() { return this.spiderSize; }
	getSpiderSizeLevelFactor() { return this.spiderSizeLevelFactor; }
	getSpiderLife(){ return this.spiderLife; }
	getSpiderSpeed(){ return this.spiderSpeed; }
	getSpiderSpeedRotation(){ return this.spiderSpeedRotation; }
	getSpiderAttackDamage() { return this.spiderAttackDamage; }
	getSpiderDecayProb(){ return this.spiderDecayProb; }
	getSpiderSmellingDistance() { return this.spiderSmellingDistance; }
	getSpiderVisibilityDistance() { return this.spiderVisibilityDistance; }
	getSpiderVisibilityRange() { return this.spiderVisibilityRange; }
	getFoodSize(){ return this.foodSize; }
	getFoodAmount(){ return this.foodAmount; }
	getFoodAmountDeadAnt(){ return this.foodAmountDeadAnt; }
	getFoodCreationPropability(){ return this.foodCreationPropability; }
	getFoodMaxSiteNumber(){ return this.foodMaxSiteNumber; }
	getFoodMaxHive(){ return this.foodMaxHive; }
	getFoodMaxAnt(){ return this.foodMaxAnt; }
	getFoodMaxHarvestAmountAnt(){ return this.foodMaxHarvestAmountAnt; }
	getSizeSmellingFactor() { return this.sizeSmellingFactor; }
}
