requirejs.config({
    //By default load any module IDs from js
    baseUrl: './js',
});

requirejs(['collider'],
function   (Collider) {
	QUnit.module( "Collider", function(collider){
		collider.beforeEach( function() {
			Collider.idCounter = null;
			this.allObjects = [];
			this.canvas = document.createElement('canvas');
			this.canvas.width  = 100;
			this.canvas.height = 100;
		});
		
		QUnit.test( "getNewID()", function( assert ) {
			for (var i=0; i< 100; i++)
				assert.equal( Collider.getNewID(), i, "Passed!");
		});
		
		QUnit.test( "constructor()", function( assert ) {
			var a = new Collider(this.canvas, {x: 10,  y:10 }, ShapeType.CIRCLE, 10, 0, this.allObjects);
			assert.equal( a.getID(), 0, "Passed!" );
			assert.notEqual( a, null, "Passed!" );
			var b = new Collider(this.canvas, {x: -20,  y:-20 }, ShapeType.CIRCLE, 10, 0, this.allObjects);
			assert.equal( b.getID(), 1, "Passed!" );
			assert.notEqual( b, null, "Passed!" );
			assert.notEqual( new Collider(this.canvas, {x: 10, y:10}, ShapeType.CIRCLE, 10, 0, this.allObjects), null, "Passed!" );
		});

		QUnit.test( "checkCollision()", function( assert ) {
			var a = new Collider(this.canvas, {x: 10,  y:10 }, ShapeType.CIRCLE, 10, 0, this.allObjects);
			assert.equal( a.getID(), 0, "Passed!" );
			assert.equal( a.checkCollision({x:10,y:10}, this.allObjects), null, "Passed!" );
			var b = new Collider(this.canvas, {x: 30,  y:10 }, ShapeType.CIRCLE, 10, 0, this.allObjects);
			assert.equal( b.getID(), 1, "Passed!" );
			assert.equal( b.checkCollision({x:10,y:10}, this.allObjects).getID(), 0, "Passed!" );
			assert.equal( b.checkCollision({x:29,y:10}, this.allObjects).getID(), 0, "Passed!" );
			assert.equal( b.checkCollision({x:30,y:10}, this.allObjects), null, "Passed!" );
		});

		QUnit.test( "convertRectToPoly()" , function(assert) {
			var polyA = Collider.convertRectToPoly({x:10,  y:10}, {w:10, h:10}, 0);
			assert.equal( polyA[0].x, 5, "Passed!" );
			assert.equal( polyA[0].y, 5, "Passed!" );
			assert.equal( polyA[1].x, 15, "Passed!" );
			assert.equal( polyA[1].y, 5, "Passed!" );
			assert.equal( polyA[2].x, 15, "Passed!" );
			assert.equal( polyA[2].y, 15, "Passed!" );
			assert.equal( polyA[3].x, 5, "Passed!" );
			assert.equal( polyA[3].y, 15, "Passed!" );
		});
		
		QUnit.test( "checkPolygonCollision()" , function(assert) {
			var polyA = Collider.convertRectToPoly({x:10,  y:10}, {w:10, h:10}, 0);
			var polyB = Collider.convertRectToPoly({x:20,  y:10}, {w:10, h:10}, 0);
			assert.equal( Collider.checkPolygonCollision(polyA, polyB), true, "Passed!" );

			var polyC = Collider.convertRectToPoly({x:21,  y:10}, {w:10, h:10}, 0);
			assert.equal( Collider.checkPolygonCollision(polyA, polyC), false, "Passed!" );
		});

		QUnit.test( "collidesWith()" , function( assert) {
			// test collisions on circle-circle
			var a = new Collider(this.canvas, {x: 10,  y:10 }, ShapeType.CIRCLE, 10, 0, this.allObjects);
			var b = new Collider(this.canvas, {x: 10,  y:30 }, ShapeType.CIRCLE, 10, 0, this.allObjects);
			assert.equal( b.getID(), 1, "Passed!" );
			assert.equal( b.collidesWith(a, {x:10, y:10}) == a, true, "Passed!" );
			assert.equal( b.collidesWith(a, {x:10, y:29}) == a, true, "Passed!" );
			assert.equal( b.collidesWith(a, {x:10, y:30}) == a, false, "Passed!" );

			// reset objects
			this.allObjects = []

			// test collisions on rectangle-rectangle
			var c = new Collider(this.canvas, {x:20, y:20}, ShapeType.RECTANGLE, {w:10, h:10}, 0, this.allObjects);
			var d = new Collider(this.canvas, {x:40, y:20}, ShapeType.RECTANGLE, {w:10, h:10}, 0, this.allObjects);
			
			assert.equal( d.collidesWith(c, {x:29, y:20}) == c, true, "Passed!" );
			assert.equal( d.collidesWith(c, {x:30, y:20}) == c, true, "Passed!" );
			assert.equal( d.collidesWith(c, {x:31, y:20}) == c, false, "Passed!" );
			assert.equal( d.collidesWith(c, {x:20, y:29}) == c, true, "Passed!" );
			assert.equal( d.collidesWith(c, {x:20, y:30}) == c, true, "Passed!" );
			assert.equal( d.collidesWith(c, {x:20, y:31}) == c, false, "Passed!" );
			assert.equal( d.collidesWith(c, {x:30, y:30}) == c, true, "Passed!" );

			// reset objects
			this.allObjects = []

			// test collisions on rectangle-rectangle
			var e = new Collider(this.canvas, {x:10, y:10}, ShapeType.CIRCLE, 10, 0, this.allObjects);
			var f = new Collider(this.canvas, {x:40, y:40}, ShapeType.RECTANGLE, {w:10, h:10}, 0, this.allObjects);
			assert.equal( f.collidesWith(e, {x:20, y:10}) == e, true, "Passed!" );
			assert.equal( f.collidesWith(e, {x:10, y:20}) == e, true, "Passed!" );
			assert.equal( f.collidesWith(e, {x:25, y:25}) == e, false, "Passed!" );
			assert.equal( f.collidesWith(e, {x:10+Math.sqrt(200), y:10+Math.sqrt(200)}) == e, true, "Passed!" );
			assert.equal( f.collidesWith(e, {x:11+Math.sqrt(200), y:11+Math.sqrt(200)}) == e, false, "Passed!" );
		});
		
		QUnit.test("setNewRotation()", function(assert){
			var a = new Collider(this.canvas, {x: 10,  y:10 }, ShapeType.CIRCLE, 10, 0, this.allObjects);
			a.setNewRotation(0.1);
			assert.equal( a.getRotation(), 0.1, "Passed!" );
			a.setNewRotation(3.14);
			assert.equal( a.getRotation(), 3.14, "Passed!" );
			a.setNewRotation(3.15);
			assert.equal( a.getRotation(), 3.15 - Math.PI*2, "Passed!" );
			a.setNewRotation(-0.1);
			assert.equal( a.getRotation(), -0.1, "Passed!" );
			a.setNewRotation(-3.15);
			assert.equal( a.getRotation(), Math.PI*2-3.15, "Passed!" );
		});
		
		QUnit.test( "setPosition()" , function(assert) {
			var a = new Collider(this.canvas, {x: 10,  y:10 }, ShapeType.CIRCLE, 10, 0, this.allObjects);
			var b = new Collider(this.canvas, {x: 10,  y:30 }, ShapeType.CIRCLE, 10, 0, this.allObjects);
			assert.equal( b.getID(), 1, "Passed!" );
			assert.equal( b.setPosition({x:10,y:25}), true, "Passed!" );
			assert.equal( b.getPosition().x, 10, "Passed!" );
			assert.equal( b.getPosition().y, 25, "Passed!" );
			assert.equal( b.setPosition({x:10,y:20}), true, "Passed!" );
			assert.equal( b.getPosition().x, 10, "Passed!" );
			assert.equal( b.getPosition().y, 20, "Passed!" );
			assert.equal( b.setPosition({x:10,y:32}), false, "Passed!" ); // cheated! distance unrealistic
			assert.equal( b.getPosition().x, 10, "Passed!" );
			assert.equal( b.getPosition().y, 20, "Passed!" );
		});
		
	});
});