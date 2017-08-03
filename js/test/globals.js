QUnit.module( "Globals", function(){

	QUnit.test( "rand()", function( assert ) {
	  var passed = true;
	  for (var i=0; i<1000; i++)
		  if(rand(0,i) < 0 
		  || rand(0,i) > i)
			passed = false;
	  assert.ok( passed == true, "Passed!" );
	});

	QUnit.test( "degToRad()", function( assert ) {
	  assert.close( degToRad(180),  3.1415, 0.01  , "Passed!" );
	  assert.close( degToRad(90),   1.5707, 0.01  , "Passed!" );
	  assert.close( degToRad(45),   0.7853, 0.01  , "Passed!" );
	  assert.close( degToRad(-180), -3.1415, 0.01 , "Passed!" );
	  assert.close( degToRad(-90),  -1.5707, 0.01 , "Passed!" );
	  assert.close( degToRad(-45),  -0.7853, 0.01 , "Passed!" );
	});

	QUnit.test( "radToDeg()", function( assert ) {
	  assert.close( radToDeg(3.1415), 180,  0.01, "Passed!" );
	  assert.close( radToDeg(1.5707), 90,   0.01, "Passed!" );
	  assert.close( radToDeg(0.7853), 45,   0.01, "Passed!" );
	  assert.close( radToDeg(-3.1415), -180,0.01, "Passed!" );
	  assert.close( radToDeg(-1.5707), -90, 0.01, "Passed!" );
	  assert.close( radToDeg(-0.7853), -45, 0.01, "Passed!" );
	});

	QUnit.test( "getDistance()", function( assert ) {
	  assert.equal( getDistance({x:0, y:0},   {x:3,y:4}), 5 , "Passed!" );
	  assert.equal( getDistance({x:-1, y:-2}, {x:2,y:2}), 5 , "Passed!" );
	  assert.equal( getDistance({x:2, y:2}, {x:-1,y:-2}), 5 , "Passed!" );
	  assert.equal( getDistance({x:-3, y:-4}, {x:0,y:0}), 5 , "Passed!" );
	});

	QUnit.test( "angleBetweenVectorsDeg()", function( assert ) {
	  assert.equal( angleBetweenVectorsDeg({x:1,y:0}, {x:1,y:1}), 45, "Passed!" );
	  assert.equal( angleBetweenVectorsDeg({x:1,y:0}, {x:0,y:1}), 90, "Passed!" );
	  assert.equal( angleBetweenVectorsDeg({x:1,y:0}, {x:-1,y:1}), 135, "Passed!" );
	  
	  assert.equal( angleBetweenVectorsDeg({x:1,y:0}, {x:1,y:-1}), -45, "Passed!" );
	  assert.equal( angleBetweenVectorsDeg({x:1,y:0}, {x:0,y:-1}), -90, "Passed!" );
	  assert.equal( angleBetweenVectorsDeg({x:1,y:0}, {x:-1,y:-1}), -135, "Passed!" );

	  assert.equal( angleBetweenVectorsDeg({x:0,y:1}, {x:1,y:1}), -45, "Passed!" );
	  assert.equal( angleBetweenVectorsDeg({x:0,y:1}, {x:-1,y:1}), 45, "Passed!" );
	  assert.equal( angleBetweenVectorsDeg({x:0,y:1}, {x:-1,y:0}), 90, "Passed!" );
	  assert.equal( angleBetweenVectorsDeg({x:0,y:1}, {x:-1,y:-1}), 135, "Passed!" );
	});

	QUnit.test( "rotateVector()", function( assert ){
	  assert.close( rotateVector({x:1,y:0}, degToRad(45)), normalize({x:1, y:1}), 0.000001, "Passed!");
	  assert.close( rotateVector({x:1,y:0}, degToRad(90)), normalize({x:0, y:1}), 0.000001, "Passed!");
	  assert.close( rotateVector({x:1,y:0}, degToRad(135)), normalize({x:-1, y:1}), 0.000001, "Passed!");
	  assert.close( rotateVector({x:1,y:0}, degToRad(-45)), normalize({x:1, y:-1}), 0.000001, "Passed!");
	  assert.close( rotateVector({x:1,y:0}, degToRad(-90)), normalize({x:0, y:-1}), 0.000001, "Passed!");
	  assert.close( rotateVector({x:1,y:0}, degToRad(-135)), normalize({x:-1, y:-1}), 0.000001, "Passed!");
	});
});