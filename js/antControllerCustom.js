class AntControllerCustom extends AntController{
	constructor(ant){
	    super(ant);
	}

	getAction(){
		//eval('(' + document.getElementById("customIterate").value + ')');
		var result = [ActionType.NONE, 0, 0];
		try{
			var newResult;
			var func = userAntFunction.bind(this);
			try{
				newResult = func();
			}
			catch (runtimeError) {
				console.error("legal code; unforeseen result: ", runtimeError);
				console.info(runtimeError.name ,"-", runtimeError.message);
				window.cancelAnimationFrame(requestID);
				requestID = undefined;
			}
			//console.log(result);
			if (newResult == null) {throw "no result value given!"; }
			if (newResult.length != 3){throw "User input incorrect - return value needs 3 elements!"; }
			if (newResult[0] < 0 || newResult[0] > 4){throw "User input incorrect - First element has to be a ActionType!"; }
			else
				result = newResult;
		}
		catch (syntaxError) {
			console.error("illegal code; syntax errors: ", syntaxError);
			console.info(syntaxError.name ,"-", syntaxError.message);
			window.cancelAnimationFrame(requestID);
			requestID = undefined;
		}
		return result;
	}
}
