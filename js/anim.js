define(['class', 'shared'], function(Class, Shared){
  ret = Class.extend({
	init: function(sheetRef, dims, sequence, cycleCB) {
	  if(!sheetRef || typeof sheetRef !== 'object') {
		throw new Error("Bad sprite sheet reference passed to anim");
	  }
	
	  this.sheet = sheetRef;
	  this.dims = {
		x: dims.x || 16,
		y: dims.y || 16
	  };
	  this.sequence = sequence;
	  this.cb = cycleCB;
	  
	  this.ctr = 0;
	  this.ptr = 0;
	},
	render: function(x,y) {
	},
	rewind: function() {
	  
	}
  });
  
  return ret;
});