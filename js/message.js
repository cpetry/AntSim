class Message {
	static showMessage(){
		document.getElementById('floatingContainer').style.display = 'block';
	}
	static hideMessage(){
		document.getElementById('floatingContainer').style.display = 'none';
	}
	static about(){
		this.showMessage();
		var text = `
		<h2>What is AntSim?</h2>
		<p>AntSim is a survival programming simulation.<br/> You will have to write code for your ants to survive as long as possible.</p>`;
		this.container.innerHTML = text + this.closeButton();
	}
	
	static tutorial0(){
		this.showMessage();
		var text = `Introduction`
		this.container.innerHTML = text + this.closeButton();
	}
	
	static closeButton(){
		return `<input id="closeButton" type="button" value="close" onclick="document.getElementById('floatingContainer').style.display = 'none';">`
	}
}