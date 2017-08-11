define(function() {

return class Graph {
	constructor(){
		this.d1 = []
	}
	
	addPoint(iteration, hive, nmbAnts){
		if (this.d1.length <= hive)
			this.d1.push([])
		this.d1[hive].push([ iteration, nmbAnts ]);
	}

	setStats(hiveStats){
		var stats=[];
		var ticks=[];
		var counter=0;
		// get tick description
		for (var stat in hiveStats[0]){
			if (stat == "failedActions")
				continue;
			ticks.push([counter++, stat]);
		}
		var maxValues=[];
		for (var hive in hiveStats){
			for (var stat in hiveStats[hive]){
				if (!maxValues[stat])
					maxValues[stat] = hiveStats[hive][stat];
				maxValues[stat] = Math.max(maxValues[stat], hiveStats[hive][stat])
			}
		}		
		for (var hive in hiveStats){
			var counter=0;
			var statList=[];
			for (var stat in hiveStats[hive]){
				if (stat == "failedActions")
					continue;
				var v = ( maxValues[stat]==0 ? 0 : hiveStats[hive][stat] / maxValues[stat]);
				statList.push([counter++, v]);
			}
			var statDict = {label : hive, data : statList};
			stats.push(statList);
		}
		
		// Fill series s1 and s2.
		var graph, ticks;		

		// Draw the graph.
		var graph = Flotr.draw(document.getElementById('graphStats'), stats, {
		radar : { show : true}, 
		grid  : { circular : true, minorHorizontalLines : true}, 
		yaxis : { min : 0, max : 1.2, minorTickFreq : 1, noTicks : 1}, 
		xaxis : { ticks : ticks}
		});
	}

	updateView(){
		var options = {
			colors: ['#000000','#ff0000','#00ff00','#0000ff'],
		  xaxis: {
			minorTickFreq: 4
		  },
		}
		//console.log(this.d1)
		var graph = Flotr.draw(document.getElementById('graphAnts'), this.d1, options);
	}
}

});