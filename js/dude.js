define(['entity'], function(Entity) {
  var ret = Entity.extend({
	init: function(params) {
	  var States = [
		'still','still-ladder','left','right','up','down',
		'falling','roping-left','roping-right','dying','winning',
		'dig-left','dig-right'
	  ];
	  this._super(params);
	},
	moveLateral: function(dir) {
		// if falling - return
		// else
		//	check desired new location
		// 	if collision - return
		//	if ladder
		//		if platform tile - center dude on edge of platform tile
		//		else falling
		//	if hole - falling, disable controls
		//	else - move	  
	},
	moveVertical: function(dir) {
		// if falling - return
		// if not on ladder tile - no
		// else
		//	if collision || (top of ladder && up) - return
		//	else
		//		if bottom of ladder && down - standing
		//		else - move
		//
	},
	dig: function(dir) {
		// get target tile
		// if !diggable - return
		// dig
	},
	move: {
	  left: function() {
		this.moveLateral('left');
	  },
	  right: function() {
		this.moveLateral('left');
	  },
	  up: function() {
		this.moveVertical('up');
	  },
	  down: function() {
		this.moveVertical('down');
	  }
	},
	dig: {
	  left: function() {
		this.dig('left');
	  },
	  right: function() {
		this.dig('right');
	  }
	},
	render: {
	  // set animation
	  // this.render
	}
  });
  
  return ret;
});