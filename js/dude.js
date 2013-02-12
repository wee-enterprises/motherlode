define(['entity'], function(Entity) {
  var ret = Entity.extend({
	init: function(params) {
	  var States = [
		'still','still-ladder','left','right','up','down',
		'falling','roping-left','roping-right','dying','winning',
		'dig-left','dig-right'
	  ];
	  this._super(params);
	  this.moveLateral = function(dir) {
		  // if falling - return
		  // else
		  //	check desired new location
		  // 	if collision - return
		  //	if ladder
		  //		if platform tile - center dude on edge of platform tile
		  //		else falling
		  //	if hole - falling, disable controls
		  //	else - move
		  if(dir === 'left') {
			this.loc.xpx -= 1;
		  } else {
			this.loc.xpx += 1;
		  }
	  };
	  
	  this.moveVertical = function(dir) {
	  	if (dir === 'up') {
	  		this.loc.ypx -= 1;
	  	} else {
	  		this.loc.ypx += 1;
	  	}
		  // if falling - return
		  // if not on ladder tile - no
		  // else
		  //	if collision || (top of ladder && up) - return
		  //	else
		  //		if bottom of ladder && down - standing
		  //		else - move
		  //
	  };
	  
	  this.dig = function(dir) {
		  // get target tile
		  // if !diggable - return
		  // dig
	  };
	},
	left: function() {
	  this.moveLateral('left');
	},
	right: function() {
	  this.moveLateral('right');
	},
	up: function() {
	  this.moveVertical('up');
	},
	down: function() {
	  this.moveVertical('down');
	},
	digLeft: function() {
	  this.dig('left');
	},
	digRight: function() {
	  this.dig('right');
	}
  });
  
  return ret;
});