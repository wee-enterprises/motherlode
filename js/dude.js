define(['entity', 'level', 'shared'], function(Entity, Level, Shared) {
	var PIXEL_MOVEMENT_AMOUNT = 2;

	var ret = Entity.extend({
		init: function(params) {
			var States = ['still', 'still-ladder', 'left', 'right',
			'up', 'down', 'falling', 'roping-left', 'roping-right',
			'dying', 'winning', 'dig-left', 'dig-right'];
			this._super(params);
			this.moveLateral = function(dir) {
				// if falling - return
				// else
				//	check desired new location
				//	if collision - return
				//	if ladder
				//		if platform tile - center dude on edge of platform tile
				//		else falling
				//	if hole - falling, disable controls
				//	else - move
				if(dir === 'left') {
					this.attemptSetXPx(this.loc.xpx - PIXEL_MOVEMENT_AMOUNT);
				} else {
					this.attemptSetXPx(this.loc.xpx + PIXEL_MOVEMENT_AMOUNT);
				}
			};

			this.moveVertical = function(dir) {
				if(dir === 'up') {
					this.attemptSetYPx(this.loc.ypx - PIXEL_MOVEMENT_AMOUNT);
				} else {
					this.attemptSetYPx(this.loc.ypx + PIXEL_MOVEMENT_AMOUNT);
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
		},
		
		update: function() {
			this.gravity();
		},
		attemptSetXPx: function(xpx) {
			// make sure he's not trying to run off the screen
			// x boundaries are 0 and canvas.width
			// don't go off the screen to the left
			if (xpx < 0) {
				return;
			}
			// don't go off the screen to the right
			if (xpx > Shared.canvas.width) {
				return;
			}

			// before we move, peek at where we're going
			var touchTypes = this.getEnvMap(xpx, this.loc.ypx);

			// if we're going to hit a wall, don't allow the movement
			if (this.checkIfCollision(touchTypes)) {
				return;
			}

			// if we've passed all our checks, move us
			this.setXPx(xpx);
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
			touchTypes = this.getEnvMap(this.loc.xpx, ypx);

			// if it's to a wall, stop here, we can't move
			if (this.checkIfCollision(touchTypes)) {
				return;
			}

			// we move up/down if we're moving to MOAR ladder
			if (this.checkIfLadder(touchTypes)) {
				this.setYPx(ypx);
				// also center the xpx as we're going up the ladder
				this.setXPx(this.centerJustifyXPx(this.loc.xt));
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

		centerJustifyXPx: function(xt) {
			// based off the xt, return the center xpx
			var center = (xt * Level.getTileWidth()) - (Level.getTileWidth >> 1);
			return center;
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

		getEnvMap: function(newXPX, newYPX) {
			var topLeft, topRight, bottomLeft, bottomRight,
				typeTopLeft, typeTopRight, typeBottomLeft, typeBottomRight, retArray;

			topLeft = {
				x: newXPX,
				y: newYPX
			};
			topRight = {
				x: newXPX + Level.getTileWidth() - 1,
				y: newYPX
			};
			bottomLeft = {
				x: newXPX,
				y: newYPX + Level.getTileHeight() - 1
			};
			bottomRight = {
				x: newXPX + Level.getTileWidth() - 1,
				y: newYPX + Level.getTileHeight() - 1
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
			return (xpx / Level.getTileWidth()) >> 0;
		},

		computeYT: function(ypx) {
			return (ypx / Level.getTileHeight()) >> 0;
		},
		
		gravity: function() {
			// get the touch types below us
			var touchTypes = this.getEnvMap(this.loc.xpx, this.loc.ypx + PIXEL_MOVEMENT_AMOUNT);

			// if it's not a collision, and it's not a ladder, move us down
			if (!this.checkIfCollision(touchTypes) && !this.checkIfLadder(touchTypes)) {
				this.setYPx(this.loc.ypx + PIXEL_MOVEMENT_AMOUNT);
			}
		}
	});

	return ret;
});