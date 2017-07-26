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
class NeuralNetwork {
	constructor(){
		this.synaptic = synaptic;

		this.network = undefined;
		this.trainer = undefined;

		var shouldTrain = false;
		var newNetwork = false;

		this.numInputs = 39;
		this.numHidden = 20;
		this.numOutputs = 6;
		
		this.initNetwork();
	}

	initNetwork() {
		if (localStorage.getItem("network")==null)
			this.newNetwork = true;

		if (this.newNetwork) {
			this.network = this.createNetwork();
			console.dir(this.network);
			this.setActivation(this.synaptic.Neuron.squash.RELU);
			this.setXavier();
			this.newNetwork = false;
		} else
			this.network = this.synaptic.Network.fromJSON(JSON.parse(localStorage.getItem("network")));

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

	createNetwork() {
		return new this.synaptic.Architect.Perceptron(this.numInputs, this.numHidden, this.numOutputs);
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