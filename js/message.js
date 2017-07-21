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
		<h2 id="message_header">What is AntSim?</h2>
		<div id="message_content">
			<div style="width:40%;float:left;margin:auto;">
				<p>
					AntSim is a free survival programming simulation.<br/>
					You will have to write code for your ants to survive as long as possible.<br/>
					They fight, harvest and multiply to ensure survival of their own species.<br/>
				</p>
				<p>
					But only as good as you code.<br/>
					<!-- image of ant with questionmark -->
				</p>
				<p>
					<b>Easy to learn, hard to master.</b><br/>
					Try the tutorial to get a hang of it!
				</p>
			</div>
			<!-- insert cool image here -->
			<img src="./images/overview.png" style="height:270px;float:right;margin:auto;" />
			
		</div>`;
		this.container.innerHTML = text + "<div id='message_bottom'>" + this.startTutorialButton() + this.closeButton() + "</div>";
	}
	
	static tutorial0(){
		this.showMessage();
		var text = `<h2 id="message_header">Tutorial 1</h2>
			<div id="message_content">
				<p>Goal of this first tutorial is to understand programming ants.</p>
					
					Ants can do each iteration exactly one of the following things:<br/>
					<ul><li>Walk</li>
					<li>Harvest</li>
					<li>Give food (to another ant or the queen)</li>
					<li>Use pheromones</li>
					<li>Attack</li>
					</ul>
				<p>	 
					Key to survival is using these action commands the best way possible.<br/>
					So lets learn about each of them step by step...
				</p>
			</div>`
		this.container.innerHTML = text + "<div id='message_bottom'>" + this.nextButton("Message.tutorial01()") + this.closeButton() + "</div>";
	}
	static tutorial01(){
		this.showMessage();
		var text = `<h2 id="message_header">Tutorial 1 - Walking</h2>
			<div id="message_content">
				<p>
					Ants neither have a map or a gps navigation system. <br/>
					They can turn and walk.
					- Turning:
					
					- Walking:
					
				</p>
			</div>`
		this.container.innerHTML = text + "<div id='message_bottom'>" + this.nextButton() + this.closeButton() + "</div>";
	}
	
	static closeButton(){
		return `<input id="closeButton" type="button" value="close" onclick="document.getElementById('floatingContainer').style.display = 'none';">`
	}
	
	static previousButton(prevFunc){
		return `<input id="previousButton" type="button" value="previous" onclick="prevFunc();">`
	}
	static nextButton(nextFunc){
		return '<input id="nextButton" type="button" value="next" onclick="' + nextFunc + ';">'
	}
	static startTutorialButton(){
		return `<input id="startTutorial" type="button" value="Start tutorial" onclick="tutorialClicked();">`
	}
}