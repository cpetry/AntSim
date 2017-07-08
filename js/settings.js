class Settings
{
	// simulation related settings
	static setFramesPerSecond(fps){ this.fps = fps; }
	static getFramesPerSecond(){ return this.fps; }
	
	static setShowDirection(enabled){ this.showDirection=enabled; }
	static getShowDirection(){ return this.showDirection; }

	static setAutoIterateFrames(enabled){ this.autoIterateFrames=enabled; }
	static getAutoIterateFrames(){ return this.autoIterateFrames; }

	// attribute related settings
	static getTerrariumSize(){ return this.terrariumSize; }
	static getHiveSize(){ return this.hiveSize; }
	static getAntSize(){ return this.antSize; }
	static getAntStartNumber(){ return this.antStartNumber; }
	static getAntPositionDistance(){ return this.antStartPositionDistance; }
	static getFoodSize(){ return this.foodSize; }
	static getFoodAmount(){ return this.foodAmount; }
	static getFoodCreationPropability(){ return this.foodCreationPropability; }
	static getFoodMaxSiteNumber(){ return this.foodMaxSiteNumber; }
	
	static getSizeSmellingFactor() { return this.sizeSmellingFactor; }
}

// sizes in px
Settings.terrariumWidth = 800;
Settings.terrariumHeight = 600;
Settings.hiveSize = 12;
Settings.antSize = 2;
Settings.antStartNumber = 10;
Settings.antStartPositionDistance = 30;
Settings.foodAmount = 1000;
Settings.foodSize = 0.01; // percentage of food amount
Settings.foodCreationPropability = 0.05; // 5% chance for each iteration 
Settings.foodMaxSiteNumber = 10; // maximum number of food sites 
Settings.sizeSmellingFactor = 7; 