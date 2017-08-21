define([ 'external/synaptic/synaptic'],
function(synaptic) {

/**
 *
 * Some comments beforehand:
 *
 * - this class is messy, don't expect it to look good for now.
 *   I will fix that later on.
 * - Not everything is perfect in here, but, however, it should
 *   work so far.
 * - If you have any improvements, recommendations or whatever,
 *   feel free to add those here.
 *
 * Greetz,
 *     Alex.
 */

 /*
 * TODO:
 *  - Add real documentation!
 */
return class NeuralNetwork {
	constructor(){
		this.synaptic = synaptic;

		this.network = null;
		this.trainer = null;

		this.shouldTrain = false;
		
		this.networkMemory = [];
		this.trainSet = [];
		this.realChosen = [];
		this.firstChoice = [];
	}

	initNetwork(numInput, numHidden, numOutput) {
		this.network = new this.synaptic.Architect.Perceptron(numInput, numHidden, numOutput);
		this.setActivation(this.synaptic.Neuron.squash.RELU);
		this.setXavier();
		this.trainer = new this.synaptic.Trainer(this.network);
		console.log("Initiated!");
	}
		
	setActivation(activation) {
		for (var i = 0; i < this.network.layers.hidden.length; ++i)
			for (var j = 0; j < this.network.layers.hidden[i].list.length; ++j)
				this.network.layers.hidden[i].list[j].squash = activation;
		for (var j = 0; j <this.network.layers.output.list.length; ++j)
			this.network.layers.output.list[j].squash = activation;
	}

	setXavier() {
		for (var i = 0; i < this.network.layers.hidden.length; ++i) {
			var layerVariance = 0;
			for (var j = 0; j < this.network.layers.hidden[i].list.length; ++j) {

				var inputKeys = Object.keys(this.network.layers.hidden[i].list[j].connections.inputs);
				var nIn = inputKeys.length;

				// Check if we calculated layer variance already
				if (layerVariance == 0) {
					layerVariance = 2. / (nIn);
				}

				for (var k = 0; k < nIn; k++)
					this.network.layers.hidden[i].list[j].connections.inputs[inputKeys[k]].weight = rand(-layerVariance,layerVariance);

			}
		}
		var layerVariance = 0;
		for (var j = 0; j < this.network.layers.output.list.length; ++j) {
			var inputKeys = Object.keys(this.network.layers.output.list[j].connections.inputs);
			var nIn = inputKeys.length;

			// Check if we calculated layer variance already
			if (layerVariance == 0) {
				layerVariance = 2. / (nIn);
			}

			for (var k = 0; k < nIn; k++)
				this.network.layers.output.list[j].connections.inputs[inputKeys[k]].weight = rand(-layerVariance,layerVariance);
		}

	}
}

});
