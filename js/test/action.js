requirejs.config({
    //By default load any module IDs from js
    baseUrl: './js',
});

requirejs(['action', 'ant', 'settingsSimulation'],
function   (Action, Ant, SettingsSimulation) {
	QUnit.module( "Action", function(action){
		action.beforeEach( function() {
			this.allObjects = [];
			this.canvas = document.createElement('canvas');
			this.canvas.width  = 100;
			this.canvas.height = 100;
			this.settings = new SettingsSimulation(AntType.CUSTOM, HiveType.DEFAULT);
		});
		
		QUnit.test( "walk()", function(assert) {
			var success;
			this.settings.antSpeed = 2;
			this.settings.antSpeedRotation = Math.PI/2;

			antA = new Ant(this.canvas, {x:10, y:10}, 0, this.settings, this.allObjects, 0);
			// rotate more than allowed
			success = Action.apply(antA, [ActionType.WALK, DirectionType.NONE, Math.PI], this.allObjects);
			assert.equal( antA.getRotation(), Math.PI/2, "Passed!" );
			success = Action.apply(antA, [ActionType.WALK, DirectionType.NONE, -Math.PI], this.allObjects);
			assert.equal( antA.getPosition().x, 10, "Passed!" );
			assert.equal( antA.getPosition().y, 10, "Passed!" );
			assert.equal( antA.getRotation(), 0, "Passed!" );
			// ant is now at {x:10, y:10} with rotation 0 again

			// rotate while walking
			success = Action.apply(antA, [ActionType.WALK, DirectionType.FORWARD, Math.PI], this.allObjects);
			assert.equal( antA.getPosition().x, 10, "Passed!" );
			assert.equal( antA.getPosition().y, 12, "Passed!" );
			success = Action.apply(antA, [ActionType.WALK, DirectionType.BACKWARD, 0], this.allObjects);
			success = Action.apply(antA, [ActionType.WALK, DirectionType.BACKWARD, 0], this.allObjects);
			success = Action.apply(antA, [ActionType.WALK, DirectionType.NONE, -Math.PI], this.allObjects);
			assert.equal( antA.getPosition().x, 10, "Passed!" );
			assert.equal( antA.getPosition().y, 10, "Passed!" );
			assert.equal( antA.getRotation(), 0, "Passed!" );
			
			// walk forward
			success = Action.apply(antA, [ActionType.WALK, DirectionType.FORWARD, 0], this.allObjects);
			assert.equal( success, true, "Passed!" );
			assert.equal( antA.getPosition().x, 12, "Passed!" );
			assert.equal( antA.getPosition().y, 10, "Passed!" );
			// walk backward
			success = Action.apply(antA, [ActionType.WALK, DirectionType.BACKWARD, 0], this.allObjects);
			success = Action.apply(antA, [ActionType.WALK, DirectionType.BACKWARD, 0], this.allObjects);
			assert.equal( success, true, "Passed!" );
			assert.equal( antA.getPosition().x, 10, "Passed!" );
			assert.equal( antA.getPosition().y, 10, "Passed!" );
			// rotate and then walk
			success = Action.apply(antA, [ActionType.WALK, DirectionType.NONE, Math.PI/2], this.allObjects);
			success = Action.apply(antA, [ActionType.WALK, DirectionType.FORWARD, 0], this.allObjects);
			assert.equal( antA.getPosition().x, 10, "Passed!" );
			assert.equal( antA.getPosition().y, 12, "Passed!" );
			assert.equal( success, true, "Passed!" );
			// rotate and then walk
			success = Action.apply(antA, [ActionType.WALK, DirectionType.NONE, Math.PI/2], this.allObjects);
			success = Action.apply(antA, [ActionType.WALK, DirectionType.FORWARD, 0], this.allObjects);
			assert.equal( antA.getPosition().x, 8, "Passed!" );
			assert.equal( antA.getPosition().y, 12, "Passed!" );
		});
	
		/*QUnit.test( "harvest()", function(assert) {
			
		}*/
	});
});