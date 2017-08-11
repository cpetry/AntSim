define(['controller'], 
function(Controller) {

/**
 * The AntController enables the user to program his/hers ants behaviour.<br>
 * It has limited access to some of the ants current values.<br>
 * The action for the upcoming iteration is to be written by the user.<br>
 * @class
 * @augments Controller
 */
return class AntController extends Controller {
    /**
    * @ignore 
    */
	constructor(ant, userAntFunction){
		super(ant);
		this.parentID = 0;
		this.food = 0;
		this.foodMax = 0;
		// simulation constructor is called directly
		this.userAntFunction = userAntFunction;
		
		this.setAttributes(ant);
	}

	setAttributes(ant){
		super.setAttributes(ant);
		this.parentID = ant.getParentID();
		this.food = ant.getFoodStorage();
		this.foodMax = ant.getMaxFoodStorage();
		this.maxRotation = ant.getMaxRotation();
		this.genes = { 
			'strength' : ant.getStrength(),
			'agility' : ant.getAgility(),
			'sensitivity' : ant.getSensitivity()
		};
	}	
	
	getAction(){
		//eval('(' + document.getElementById("customIterate").value + ')');
		var result = [ActionType.NONE, 0, 0];
		try{
			var newResult;
			try{
				newResult = this.userAntFunction.call(this);
			}
			catch (runtimeError) {
				console.error("legal code; unforeseen result: ", runtimeError);
				console.info(runtimeError.name ,"-", runtimeError.message);
				window.cancelAnimationFrame(requestID);
				requestID = undefined;
			}
			//console.log(result);
			if (newResult == null) {throw "no result value given!"; }
			if (newResult[0] < 0 || newResult[0] > ActionType.length){throw "User input incorrect - First element has to be a ActionType!"; }
			else
				result = newResult;
		}
		catch (syntaxError) {
			console.error("illegal code; syntax errors: ", syntaxError);
			console.info(syntaxError.name ,"-", syntaxError.message);
			window.cancelAnimationFrame(requestID);
			requestID = undefined;
		}
		//console.log(result);
		return result;
	}
	
	/**
	* Get the ID of the ants hive
	* @return {number} parentID.
	*/
	getParentID(){return this.parentID;}

	/**
	* Get the current food the ant carries around.
	* @return {number} food.
	*/
	getFoodStorage(){return this.food;}

	/**
	* Get the maximum amount of food the ant can carry.
	* @return {number} maximum food.
	*/
	getMaxFoodStorage(){return this.foodMax;}

	/**
	* Checks if the ant has food capacity left or not.
	* @return {bool} is full.
	*/
	isFull(){return this.food==this.foodMax;}
	
	getMaximumRotation(){ return this.maxRotation;}
	
	/**
	* Gets this ants genetic configuration. Access the attributes strength, agility and sensitivity like this:
	* <ant>.getGenes().strength.
	* @return {dict} gene dictionary.
	*/
	getGenes() {return this.genes;}
	
	getNearestEnemyAnt(){
		var minDist = 1000;
		var prey = null;
		for (var id in this.visibleObjs){
			if(this.visibleObjs[id].getObjectType() == ObjectType.ANT
			&& this.visibleObjs[id].getParentID() != this.getParentID()
			&& this.visibleObjs[id].getDistanceToObj() < minDist){
				minDist = this.visibleObjs[id].getDistanceToObj();
				var prey = this.visibleObjs[id];
			}
		}
		if(prey==null){
			for (var id in this.smelledObjs){
				if(this.smelledObjs[id].getObjectType() == ObjectType.ANT
				&& this.smelledObjs[id].getParentID() != this.getParentID()
				&& this.smelledObjs[id].getDistanceToObj() < minDist){
					minDist = this.smelledObjs[id].getDistanceToObj();
					var prey = this.smelledObjs[id];
				}
			}
		}
		return prey;
	}
	
	getNextPheromoneOfType(type){
		var minRot = 360;
		var pheromone = null;
		for (var id in this.smelledObjs){
			if(this.smelledObjs[id].getObjectType() == ObjectType.PHEROMONE
			&& this.smelledObjs[id].getPheromoneType() == type
			&& Math.abs(this.smelledObjs[id].getRotationToObj()) < minRot){
				minRot = Math.abs(this.smelledObjs[id].getRotationToObj())
				var pheromone = this.smelledObjs[id];
			}
		}
		return pheromone;
	}
	
	getOwnHive(){
		var hive = null;
		for (var id in this.visibleObjs){
			if (this.visibleObjs[id].getObjectType() == ObjectType.HIVE
			&& this.visibleObjs[id].getParentID() == this.getParentID()){
				hive = this.visibleObjs[id];
			}
		}
		
		// no food visible -> try smelling
		if (hive == null){
			for (var id in this.smelledObjs){
				if (this.smelledObjs[id].getObjectType() == ObjectType.HIVE
				&& this.smelledObjs[id].getParentID() == this.getParentID()){
					hive = this.smelledObjs[id];
				}
			}
		}	
		return hive;
	}
}

});