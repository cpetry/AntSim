class Settings
{
	constructor(){
		this.autoIterateFrames = true;
		this.showDirection = false;
	}
	
	setShowDirection(enabled){
		this.showDirection=enabled;
	}
	getShowDirection(){
		return this.showDirection;
	}

	setAutoIterateFrames(enabled){
		this.autoIterateFrames=enabled;
	}
	getAutoIterateFrames(){
		return this.autoIterateFrames;
	}
}