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
				this.loc.xpx = (this.loc.xt + 0.5) * Level.getTileWidth();
				this.loc.ypx = (this.loc.yt + 0.5) * Level.getTileHeight();
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

			// TODO for now it's debug, but we'll need to check this BEFORE we move
			// if the collision is with something big and bad and non-moving
			this.checkIfCollision();
		},

		setYPx: function(ypx) {
			this.loc.ypx = ypx;
			// update the yt (y tile) based on the updated ypx (y pixel)
			this.loc.yt = ((this.loc.ypx + (Level.getTileHeight() >> 1)) /
				(Level.getTileHeight())) >> 0;

			// TODO for now it's debug, but we'll need to check this BEFORE we move
			// if the collision is with something big and bad and non-moving
			this.checkIfCollision();
		},

		checkIfCollision: function() {
			var topLeft, topRight, bottomLeft, bottomRight,
				typeTopLeft, typeTopRight, typeBottomLeft, typeBottomRight;

			topLeft = {
				x: this.loc.xpx,
				y: this.loc.ypx
			};
			topRight = {
				x: this.loc.xpx + Level.getTileWidth(),
				y: this.loc.ypx
			};
			bottomLeft = {
				x: this.loc.xpx,
				y: this.loc.ypx + Level.getTileHeight()
			};
			bottomRight = {
				x: this.loc.xpx + Level.getTileWidth(),
				y: this.loc.ypx + Level.getTileHeight()
			};

			typeTopLeft = Level.getTileTypeAtPosition(this.computeXT(topLeft.x), this.computeYT(topLeft.y));
			if (typeTopLeft) {
				console.log("I'm touching a " + typeTopLeft + " tl");
			}
			typeTopRight = Level.getTileTypeAtPosition(this.computeXT(topRight.x), this.computeYT(topRight.y));
			if (typeTopRight) {
				console.log("I'm touching a " + typeTopRight + " tr");
			}
			typeBottomLeft = Level.getTileTypeAtPosition(this.computeXT(bottomLeft.x), this.computeYT(bottomLeft.y));
			if (typeBottomLeft) {
				console.log("I'm touching a " + typeBottomLeft + " bl");
			}
			typeBottomRight = Level.getTileTypeAtPosition(this.computeXT(bottomRight.x), this.computeYT(bottomRight.y));
			if (typeBottomRight) {
				console.log("I'm touching a " + typeBottomRight + " br");
			}
		},

		computeXT: function(xpx) {
			return (xpx / (Level.getTileWidth())) >> 0;
		},

		computeYT: function(ypx) {
			return (ypx / (Level.getTileHeight())) >> 0;
		}
	});

	return ret;
});