class SettingsGlobal
{
	// simulation related settings
	static setFramesPerSecond(fps){ this.fps = fps; }
	static getFramesPerSecond(){ return this.fps; }

	static setShowUI(enabled){ this.showUI=enabled; }
	static getShowUI(){ return this.showUI; }
}