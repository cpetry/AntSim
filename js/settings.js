class Settings
{
	constructor(){
		this.autoIterateFrames = true;
		this.showDirection = false;
	}
	
	static setShowDirection(enabled){
		this.showDirection=enabled;
	}
	static getShowDirection(){
		return this.showDirection;
	}

	static setAutoIterateFrames(enabled){
		this.autoIterateFrames=enabled;
	}
	static getAutoIterateFrames(){
		return this.autoIterateFrames;
	}
}