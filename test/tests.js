QUnit.test( "grid test", function( assert ) {
  
  assert.ok( GNM.GRID.getrowcount("t") == 3, "Passed!" );
  assert.ok( GNM.GRID.getrowcount("s") == 4, "Passed!" );
});