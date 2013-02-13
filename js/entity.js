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
				this.loc.xt = ((this.loc.xpx + (Level.getTileWidth() >> 1)) /
					(Level.getTileWidth())) >> 0;
				this.loc.yt = ((this.loc.ypx + (Level.getTileHeight() >> 1)) /
					(Level.getTileHeight())) >> 0;

			} else if(params.xt) { // use tile locs
				this.loc.xt = params.xt || 0;
				this.loc.yt = params.yt || 0;

				// derive pixel loc
				this.log.xpx = (this.loc.xt + 0.5) * Level.getTileWidth();
				this.log.ypx = (this.loc.yt + 0.5) * Level.getTileHeight();
			} else {
				this.loc.xpx = 0;
				this.loc.ypx = 0;
				this.loc.xt = 0;
				this.loc.yt = 0;
			}

			this.spawnLoc = params.spawnLoc || this.loc;


		}, // end init

		render: function() {
			if(this.currAnim) {
				this.anims[this.currAnim].render(this.loc.xpx, this.loc.ypx);
			}
		},

		addAnim: function(name, anim) {
			// !instanceOf animation - throw && return
			this.anims[name] = anim;
		},

		setXPx: function(xpx) {
			this.loc.xpx = xpx;
			// update the xt (x tile) based on the updated xpx (x pixel)
			this.loc.xt = ((this.loc.xpx + (Level.getTileWidth() >> 1)) /
				(Level.getTileWidth())) >> 0;

			// DEBUG
			var type = Level.getTileTypeAtPosition(this.loc.xt, this.loc.yt);
			if (type) {
				console.log("I'm touching a " + type);
			}
		},

		setYPx: function(ypx) {
			this.loc.ypx = ypx;
			// update the yt (y tile) based on the updated ypx (y pixel)
			this.loc.yt = ((this.loc.ypx + (Level.getTileHeight() >> 1)) /
				(Level.getTileHeight())) >> 0;

			// DEBUG
			var type = Level.getTileTypeAtPosition(this.loc.xt, this.loc.yt);
			if (type) {
				console.log("I'm touching a " + type);
			}
		}
	});

	return ret;
});