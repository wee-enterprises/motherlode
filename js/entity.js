define(['class', 'level'], function(Class, Level) {
  var ret = Class.extend({
	init: function(params) {
	  params = params || {};
	  this.loc = {};
	  this.anims = {};
	  this.currAnim = "";
	  this.spriteSheet = "";
	  
	  // init with pixel location
	  if(params.xpx || params.xpy) {
		this.loc.xpx = params.xpx || 0;
		this.loc.ypx = params.ypx || 0;
		
		// derive tile loc (centered object - ref from top left)
		this.loc.xt = ((this.loc.xpx+(Level.tilewidth>>1)) / (Level.tilewidth))>>0;
		this.loc.yt = ((this.loc.ypx+(Level.tileheight>>1)) / (Level.tileheight))>>0;
		
	  } else if(params.xt) { // use tile locs
		this.loc.xt = params.xt || 0;
		this.loc.yt = params.yt || 0;
		
		// derive pixel loc
		this.log.xpx = (this.loc.xt + .5) * Level.tilewidth;
		this.log.ypx = (this.loc.yt + .5) * Level.tileheight;
	  } else {
		this.loc.xpx = 0;
		this.loc.ypx = 0;
		this.loc.xt = 0;
		this.loc.yt = 0;
	  }
	  
	  this.spawnLoc = params.spawnLoc || this.loc;
	  
	  
	}, // end init
	render: function() {
	  // this.anims[this.currAnim].render(this.loc.xpx, this.loc.xpy)
	},
	addAnim: function(name, anim) {
	  // !instanceOf animation - throw && return
	  // this.anims[name] = anim;
	}
  });
  
  return ret;
});