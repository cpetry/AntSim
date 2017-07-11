class SettingsGlobal
{
	// simulation related settings
	static setFramesPerSecond(fps){ this.fps = fps; }
	static getFramesPerSecond(){ return this.fps; }

	static setAutoIterateFrames(enabled){ this.autoIterateFrames=enabled; }
	static getAutoIterateFrames(){ return this.autoIterateFrames; }

	static setShowUI(enabled){ this.showUI=enabled; }
	static getShowUI(){ return this.showUI; }
}