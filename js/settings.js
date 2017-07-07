class Settings
{
	static setFramesPerSecond(fps){
		console.log(fps)
		this.fps = fps;
	}
	
	static getFramesPerSecond(){
		return this.fps;
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