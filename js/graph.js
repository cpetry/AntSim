class Graph {
	constructor(){
		this.container = document.getElementById('graphs');
		this.dataset = new vis.DataSet([{x:0, y:0}]);
		this.ants = [];
		this.options = {
			width:  '600px',
			height: '400px',
			start: 0,
			//interpolation: false,
			shaded: {
			  orientation: 'bottom' // top, bottom
			},
			drawPoints: false,
		};
		this.graph2d = new vis.Graph2d(this.container, this.dataset, this.options);
	}
	
	addPoint(iteration, nmbAnts){
		this.ants.push({ x: iteration, y: nmbAnts });
	}
	
	updateView(){
		this.graph2d.setItems(this.ants);
		this.graph2d.fit();
	}
}