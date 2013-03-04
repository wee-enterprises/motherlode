define(['entity', 'level', 'shared', 'hole'], function(Entity, Level, Shared, Hole) {
	var TypeMatch = {
			ladder: /ladder|exit/,
			fallstop: /wall|bedrock|ladder|guard/,
			collision: /wall|bedrock|guard/
		},
		TouchTypes = ['guard', 'gold', 'player'], // entities that are interesting when I touch them =X
		Action = {
			//null: "not moving"
			left: "left",
			matchLeft: /left/,
			right: "right",
			matchRight: /right/,
			up: "up",
			matchUp: /up/,
			down: "down",
			matchDown: /down/,
			
			matchLateral: /left|right/,
			matchVertical: /up|down/,
			
			digLeft: "digLeft",
			matchDigLeft: /digLeft/,
			digRight: "digRight",
			matchDigRight: /digRight/,
			matchDig: /dig/
		},
	    Boundary = { // based on top-left of sprite
			left:  3,
			right: 13,
			up:    0,
			down:  16
		};
		
	var ret = Entity.extend({
		init: function(params) {
			params.bounds = Boundary;
			this._super(params);
			this.latch     = ""; // movement latch
			this.accX      = 0;
			this.accY      = 0;
			this.colliding = false;
			this.touching  = [];
			this.golds     = 0;
			
			this.States = {
				climbing: 'climbing',
				running: 'running',
				roping: 'roping',
				digging: 'digging',
				falling: 'falling',
				holed: 'holed',
				still: 'still',
				dying: 'dying',
				dead: 'dead',
				winning: 'winning',
				finished: 'finished'
			};
			this.lastState = this.States.still;
			this.state     = this.States.still;
			
			
			this.Acc = {
				inc: 0.4,
				dec: 0.6,
				max: 2,
				gravity: 0.6,
				maxGravity: 4
			};
		},
		setAcc: function (newAcc) {
			this.Acc = newAcc;
		},
		left: function() {
			this.latch += Action.left;
		},
		right: function() {
			this.latch += Action.right;
		},
		up: function() {
			this.latch += Action.up;
		},
		down: function() {
			this.latch += Action.down;
		},
		digLeft: function() {
			this.latch += Action.digLeft;
		},
		digRight: function() {
			this.latch += Action.digRight;
		},
		setState: function (state) {
			this.lastState = this.state;
			this.state = state;
		},
		doDig: function (dir) {
			var hole = {
				y: this.loc.yt + 1
			};
			hole.x = (dir === 'left') ? this.loc.xt - 1 : this.loc.xt + 1;
			Level.createHole(hole.x, hole.y);
			/*Shared.entities.push(new Hole({
				xt: hole.x,
				yt: hole.y,
				props: {
					type: "hole"
				}
			}));
			*/
		},
		doDecel: function name(args) {
			if (!Action.matchLateral.test(this.latch)) {
				//not pressing left or right
				if (this.accX === 0) { // short circuit
				} else if (this.accX > 0) {
					this.accX = (this.accX - this.Acc.dec > 0) ? this.accX - this.Acc.dec : 0;
				} else {
					this.accX = (this.accX + this.Acc.dec < 0) ? this.accX + this.Acc.dec : 0;
				}
			}
			if (!Action.matchVertical.test(this.latch) && this.state !== this.States.falling) {
				//not pressing left or right
				if (this.accY === 0) { // short circuit
				} else if (this.accY > 0) {
					this.accY = (this.accY - this.Acc.dec > 0) ? this.accY - this.Acc.dec : 0;
				} else {
					this.accY = (this.accY + this.Acc.dec < 0) ? this.accY + this.Acc.dec : 0;
				}
			}
		},
		/**
		 * checks collisions with level and entities, affects state
		 */
		update: function() {
			var newLocPx = {
					x: this.loc.xpx,
					y: this.loc.ypx
			    }
			,   newLoc  = null
			,   newAccX = this.accX
			,   newAccY = this.accY
			,   currTiles = []
			,   nextTiles = []
			,   stepOnEnt = null
			,   i         = 0
			;
			
			switch (true) {
				case Action.matchLeft.test(this.latch):
					newAccX = (Math.abs(newAccX - this.Acc.inc) > this.Acc.max) ? -1* this.Acc.max : newAccX - this.Acc.inc;
				break;
				case Action.matchRight.test(this.latch):
					newAccX = (newAccX + this.Acc.inc > this.Acc.max) ? this.Acc.max : newAccX + this.Acc.inc;
				break;
				case Action.matchUp.test(this.latch):
					newAccY = (Math.abs(newAccY - this.Acc.inc) > this.Acc.max) ? -1* this.Acc.max : newAccY - this.Acc.inc;
				break;
				case Action.matchDown.test(this.latch):
					newAccY = (newAccY + this.Acc.inc > this.Acc.max) ? this.Acc.max : newAccY + this.Acc.inc;
				break;
			}
		
			currTiles = Level.getTileMap(this.loc.xt, this.loc.yt);
			newLocPx.x = this.loc.xpx + newAccX;
			newLocPx.y = this.loc.ypx + newAccY;
			newLoc = this.tileLocFromPx(newLocPx.x, newLocPx.y);
			nextTiles = Level.getTileMap(newLoc.x, newLoc.y);
			
			stepOnEnt = Shared.getEntityAt(newLoc.x, newLoc.y + 1);
			
			stepOnEnt && stepOnEnt.props && console.log(stepOnEnt.props.type, currTiles[7]);
			
			//-- Now we have established the player's intent + some initial state, now run rules and augment values
			//-- animation will be inferred by state and direction of acceleration
			
			// movement
			switch (this.state) {
				case this.States.climbing:
					// top of ladder
					if ((!currTiles[4] || !TypeMatch.ladder.test(currTiles[4].type))) {
						// there's not a ladder below us, or there is but we aren't trying to go down
						if (currTiles[4] && !TypeMatch.ladder.test(currTiles[7].type) && Math.abs(newAccX) === 0  || newAccY <= 0) {
							this.setState(this.States.still);
							this.vertAlign();
						}
					} else {
						// at bottom of ladder
						if (currTiles[7] && TypeMatch.collision.test(currTiles[7].type) && newAccY > 0) {
							newAccY = 0;
							this.vertAlign();
							this.setState(this.States.still);
						} else {
							// still climbing
							if (Math.abs(newAccX) > 0) {
								newAccX = 0;
							}
							this.horizAlign();
						}
						
						// check for win - top of exit ladder
						if (currTiles[4] && currTiles[4].type === 'exit' && !currTiles[1]) {
							this.setState(this.States.winning);
						}
					}

				break;
				case this.States.roping:
					// GOTO FALLING
					if (newAccY > 0 || (!currTiles[4] && !currTiles[7])) {
						this.setState(this.States.falling);
					} else {
						this.vertAlign();
						newAccY = 0;
						// GOTO STILL
						if (currTiles[7] && TypeMatch.collision.test(currTiles[7].type)) {
							// back on solid ground
							this.setState(this.States.still);
						}
					}
				break;
				// mmmmmeaty. You can do a lot when going from one of these states
				case this.States.running:
				case this.States.still:
					if (Math.abs(newAccY) > 0) {
						// GOTO CLIMBING
						// on ladder 
						if (currTiles[4] && TypeMatch.ladder.test(currTiles[4].type)) {
							// bottom of ladder + trying to go down
							if (currTiles[7] && TypeMatch.collision.test(currTiles[7].type) && newAccY > 0) {
								newAccY = 0;
							} else {
								this.setState(this.States.climbing);
							}
						// or ladder directly below and not on a ladder
						} else if (currTiles[7] && TypeMatch.ladder.test(currTiles[7].type) && newAccY > 0) {
								this.setState(this.States.climbing);
						} else {
							newAccY = 0;
						}
					} else {
						if (Action.matchDig.test(this.latch)) {
							this.setState(this.States.digging);
							(Action.matchDigLeft.test(this.latch)) ? this.doDig('left') : this.doDig('right');
						} else {
							// no Y - check X
							if (Math.abs(newAccX) > 0) {
								// GOTO ROPING
								if ((nextTiles[4] && nextTiles[4].type === 'rope' || (currTiles[4] && currTiles[4].type === 'rope'))) {
									this.setState(this.States.roping);
								}
								// GOTO FALLING
								else if (!nextTiles[7] && (!stepOnEnt || (stepOnEnt.props && stepOnEnt.props.type !== 'guard'))) {
									// next tile below is blank!
									this.setState(this.States.falling);
									// nudge him a bit - duct tape for falling into platform bug
									newAccX *= 1.3;
								// RUNNING 
								} else  {
									this.setState(this.States.running);
									this.vertAlign();
									// Canvas boundary check and general collision
									if ((newLocPx.x <= 0 || newLocPx.x >= Shared.canvas.width - Level.tileWidth)
										|| (nextTiles[4] && TypeMatch.collision.test(nextTiles[4].type))) {
										newAccX = 0;
									}
								}
							// GOTO STILL
							} else {
								this.setState(this.States.still);
							}
						}
					}
				break;
				case this.States.digging:
					// can't move while digging - subclass kicks state back
					newAccY = 0;
					newAccX = 0;
					//this.vertAlign();
				break;
				case this.States.falling:
					// GOTO STILL
					// about to hit solid tile
					if (nextTiles[4] && TypeMatch.fallstop.test(nextTiles[4].type)) {
						this.setState(this.States.still);
						newAccY = 0;
						this.vertAlign();
					}  else {
						// continue falling
						newAccY = (newAccY + this.Acc.gravity <= this.Acc.maxGravity) ? newAccY + this.Acc.gravity : this.Acc.maxGravity;
						newAccX = 0;
						// GOTO ROPING
						//    fell into a rope                                  not the same rope
						if (currTiles[4] && currTiles[4].type === 'rope' && this.loc.yt !== this.lastLoc.yt) {
							this.setState(this.States.roping);
							newAccY = 0; // stop the fallin'
						} 
					}
				break;
				case this.States.holed:
					newAccY = 0;
					//newAccX = 0;
					this.vertAlign();
					//this.horizAlign();
				break;
				// implement in player/guard
				case this.States.dying: 
				case this.States.dead: 
				case this.States.winning:
				case this.States.finished:
					
				break;
			}
			
			// reset based on amendment
			newLocPx.x = this.loc.xpx + newAccX;
			newLocPx.y = this.loc.ypx + newAccY;
			newLoc = this.tileLocFromPx(newLocPx.x, newLocPx.y);
			
			this.accX = newAccX;
			this.accY = newAccY;
			this.doDecel();
			this.setLocPx(newLocPx.x, newLocPx.y);
	
			this.touching = [];		
			for (i=0; i<Shared.entities.length; i++) {
				if (Shared.entities[i].loc.xt === this.loc.xt && Shared.entities[i].loc.yt === this.loc.yt) {
					this.touching.push(Shared.entities[i]);
					if (Shared.entities[i].props.type === 'hole') {
						//this.setState(this.States.holed);
						//Level.holeOccupied(this.loc.xt, this.loc.yt);
					}
				}
			}
			this.latch = ""; // clear movement latch
		},


	});

	return ret;
});