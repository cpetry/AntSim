class SettingsGlobal
{
	// simulation related settings
	static setFramesPerSecond(fps){ this.fps = fps; }
	static getFramesPerSecond(){ return this.fps; }
	
	static setShowDirection(enabled){ this.showDirection=enabled; }
	static getShowDirection(){ return this.showDirection; }

	static setAutoIterateFrames(enabled){ this.autoIterateFrames=enabled; }
	static getAutoIterateFrames(){ return this.autoIterateFrames; }

	// attribute related settings
	static getTerrariumWidth(){ return this.terrariumWidth; }
	static getTerrariumHeight(){ return this.terrariumHeight; }
}

// sizes in px
SettingsGlobal.terrariumWidth = 800;
SettingsGlobal.terrariumHeight = 600;