class AntControllerCustom extends AntController{
	constructor(ant){
	    super(ant);
	}

	getAction(){
		//eval('(' + document.getElementById("customIterate").value + ')');
		var result = [ActionType.NONE, 0, 0];
		try{
			var newResult;
			var func = userFunction.bind(this);
			try{
				newResult = func();
			}
			catch (runtimeError) {
				console.error("legal code; unforeseen result: ", runtimeError);
				console.info(runtimeError.name ,"-", runtimeError.message);
				SettingsGlobal.setAutoIterateFrames(false);
			}
			//console.log(result);
			if (newResult == null) {throw "no result value given!"; }
			if (newResult.length != 3){throw "User input incorrect - return value needs 3 elements!"; }
			if (newResult[0] < 0 || newResult[0] > 4){throw "User input incorrect - First element has to be a ActionType!"; }
		}
		catch (syntaxError) {
			console.error("illegal code; syntax errors: ", syntaxError);
			console.info(syntaxError.name ,"-", syntaxError.message);
			SettingsGlobal.setAutoIterateFrames(false);
		}
		return result;
	}
}
