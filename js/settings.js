class Settings
{
	constructor(){
		this.autoIterateFrames = true;
		this.showDirection = false;
		this.fps = 10;
	}
	setFramesPerSecond(fps){
		console.log(fps)
		this.fps = fps;
	}
	
	getFramesPerSecond(){
		return this.fps;
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