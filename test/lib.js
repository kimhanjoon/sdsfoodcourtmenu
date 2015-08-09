var GNM = GNM || {};
GNM.GRID = (function() {
  var gnm_grid = {};
  gnm_grid.getrowcount = function(id) {
    if( id === "t" ) {
      return 3;
    }
    else {
      return 4;
    }
  };
  return gnm_grid;
})();