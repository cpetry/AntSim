class Graph {
	constructor(){
		this.container = document.getElementById('graphs');
		this.d1 = [],
		// Second data series:
		// A couple flotr configuration options:
		this.options = {
		  xaxis: {
			minorTickFreq: 4
		  },
		};
		this.updateView();
		/*
		Flotr.EventAdapter.observe(this.container, 'flotr:select', function(area) {
			// Draw selected area
			this.options.xaxis = {
					min: area.x1,
					max: area.x2,
					mode: 'time',
					labelsAngle: 45};
			this.options.yaxis = {
					min: area.y1,
					max: area.y2};
			this.updateView();
		});

		// When graph is clicked, draw the graph with default area.
		Flotr.EventAdapter.observe(this.container, 'flotr:click', function() {
			this.updateView();
		});*/

	}
	
	addPoint(iteration, nmbAnts){
		this.d1.push([ iteration, nmbAnts ]);
	}
	
	updateView(){
		if (this.container.style.display == "block")
			this.g = Flotr.draw(this.container, [this.d1], this.options);
	}
}