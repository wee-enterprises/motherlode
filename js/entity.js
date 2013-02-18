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

		attemptSetXPx: function(xpx) {
			// before we move, peek at where we're going
			var touchTypes = this.whatAmIGoingToTouch(xpx, this.loc.ypx);

			// as long as we're not colliding with a wall, we can move along the x axis
			if (!this.checkIfCollision(touchTypes)) {
				this.setXPx(xpx);
			}
		},

		setXPx: function(xpx) {
			this.loc.xpx = xpx;
			// update the xt (x tile) based on the updated xpx (x pixel)
			this.loc.xt = ((this.loc.xpx + (Level.getTileWidth() >> 1)) /
				(Level.getTileWidth())) >> 0;
		},

		attemptSetYPx: function(ypx) {
			var touchTypes, currentType;

			// before we move, peek at where we're going
			touchTypes = this.whatAmIGoingToTouch(this.loc.xpx, ypx);

			// if it's to a wall, stop here, we can't move
			if (this.checkIfCollision(touchTypes)) {
				return;
			}

			// we move up/down if we're moving to MOAR ladder
			if (this.checkIfLadder(touchTypes)) {
				this.setYPx(ypx);
				return;
			}

			// or we're on the last rung, moving up
			currentType = Level.getTileTypeAtPosition(this.loc.xt,
				this.computeYT(this.loc.ypx + Level.getTileHeight()));
			// verify we're on a ladder
			if (Level.ladderTypes.indexOf(currentType) > -1) {
				// verify we're attempting to move up
				if (this.loc.ypx > ypx) {
					// move us up!
					this.setYPx(ypx);
				}
			}
		},

		setYPx: function(ypx) {
			this.loc.ypx = ypx;
			// update the yt (y tile) based on the updated ypx (y pixel)
			this.loc.yt = ((this.loc.ypx + (Level.getTileHeight() >> 1)) /
				(Level.getTileHeight())) >> 0;
		},

		checkIfCollision: function(touchTypes) {
			return this.checkIfInTypes(touchTypes, Level.collisionTypes);
		},

		checkIfLadder: function(touchTypes) {
			return this.checkIfInTypes(touchTypes, Level.ladderTypes);
		},

		checkIfInTypes: function(touchTypes, verifyTypes) {
			var counter;
			var touchTypesContainsAVerifyType = false;

			// check if the touch types contain something in verifyTypes
			if (touchTypes && touchTypes.length > 0) {
				for (counter=0; counter<touchTypes.length; counter++) {
					if (verifyTypes.indexOf(touchTypes[counter]) != -1) {
						touchTypesContainsAVerifyType = true;
						break;
					}
				}
			}

			return touchTypesContainsAVerifyType;
		},

		whatAmIGoingToTouch: function(newXPX, newYPX) {
			var topLeft, topRight, bottomLeft, bottomRight,
				typeTopLeft, typeTopRight, typeBottomLeft, typeBottomRight, retArray;

			topLeft = {
				x: newXPX,
				y: newYPX
			};
			topRight = {
				x: newXPX + Level.getTileWidth(),
				y: newYPX
			};
			bottomLeft = {
				x: newXPX,
				y: newYPX + Level.getTileHeight()
			};
			bottomRight = {
				x: newXPX + Level.getTileWidth(),
				y: newYPX + Level.getTileHeight()
			};

			// we need to return something... what to do... what to do...
			// I think for now let's return a list of the type of things
			// we hit, ignoring the location. I'm not sure that's important (yet)
			retArray = [];

			typeTopLeft = Level.getTileTypeAtPosition(this.computeXT(topLeft.x), this.computeYT(topLeft.y));
			if (typeTopLeft) {
				retArray.push(typeTopLeft);
				//console.log("I'm going to touch a " + typeTopLeft + " tl");
			}
			typeTopRight = Level.getTileTypeAtPosition(this.computeXT(topRight.x), this.computeYT(topRight.y));
			if (typeTopRight) {
				retArray.push(typeTopRight);
				//console.log("I'm going to touch a " + typeTopRight + " tr");
			}
			typeBottomLeft = Level.getTileTypeAtPosition(this.computeXT(bottomLeft.x), this.computeYT(bottomLeft.y));
			if (typeBottomLeft) {
				retArray.push(typeBottomLeft);
				//console.log("I'm going to touch a " + typeBottomLeft + " bl");
			}
			typeBottomRight = Level.getTileTypeAtPosition(this.computeXT(bottomRight.x), this.computeYT(bottomRight.y));
			if (typeBottomRight) {
				retArray.push(typeBottomRight);
				//console.log("I'm going to touch a " + typeBottomRight + " br");
			}

			return retArray;
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