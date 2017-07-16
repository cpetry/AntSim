QUnit.test( "rand()", function( assert ) {
  var passed = true;
  for (var i=0; i<1000; i++)
	  if(rand(0,i) < 0 
      || rand(0,i) > i)
		passed = false;
  assert.ok( passed == true, "Passed!" );
});

QUnit.test( "degToRad()", function( assert ) {
  assert.ok( degToRad(180) >= 3.1415 && degToRad(180) <= 3.1416 , "Passed!" );
  assert.ok( degToRad(90)  >= 1.5707 && degToRad(90)  <= 1.5708 , "Passed!" );
  assert.ok( degToRad(45)  >= 0.7853 && degToRad(45)  <= 0.7854 , "Passed!" );
  assert.ok( degToRad(-180) <= -3.1415 && degToRad(-180) >= -3.1416 , "Passed!" );
  assert.ok( degToRad(-90)  <= -1.5707 && degToRad(-90)  >= -1.5708 , "Passed!" );
  assert.ok( degToRad(-45)  <= -0.7853 && degToRad(-45)  >= -0.7854 , "Passed!" );
});

QUnit.test( "radToDeg()", function( assert ) {
  assert.ok( radToDeg(3.1415) <= 180   && radToDeg(3.1416) >= 180 , "Passed!" );
  assert.ok( radToDeg(1.5707) <= 90    && radToDeg(1.5708) >= 90 , "Passed!" );
  assert.ok( radToDeg(0.7853) <= 45    && radToDeg(0.7854) >= 45 , "Passed!" );
  assert.ok( radToDeg(-3.1415) >= -180 && radToDeg(-3.1416) <= -180 , "Passed!" );
  assert.ok( radToDeg(-1.5707) >= -90  && radToDeg(-1.5708) <= -90 , "Passed!" );
  assert.ok( radToDeg(-0.7853) >= -45  && radToDeg(-0.7854) <= -45 , "Passed!" );
});