class Debug
{
	constructor(){
		this.visibility = false;
	}

	static setVisibility(enabled){
		this.visibility = enabled;
	}
	static getVisibility(){
		return this.visibility;
	}
}