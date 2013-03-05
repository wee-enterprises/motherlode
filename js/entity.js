define(['class', 'level'], function(Class, Level) {
	var ret = Class.extend({
		init: function(params) {
			params = params || {};
			this.loc = {};
			this.lastLoc = {};
			this.anims = {};
			this.animFlip = false;
			this.currAnim = "";
			this.defaultAnim = "";
			this.spriteSheet = "";
			this.props = params.props || {};
			this.bounds = params.bounds || {
				left: 0,
				right: Level.tileWidth,
				up: 0,
				down: Level.tileHeight
			};

			// init with pixel location
			if(params.xpx || params.ypx) {
				this.setLocPx(params.xpx || 0, params.ypx || 0);
			} else if(params.xt) { // or use tile locs
				this.setLocTile(params.xt || 0, params.yt || 0);
			} else {
				this.setLocTile(0,0);
			}

			this.spawnLoc = params.spawnLoc || this.loc;


		},// end init

		tileLocFromPx: function (x, y) {
			return {
				x: ((x + (Level.tileWidth >>1)) / (Level.tileWidth)) >> 0,
				y: ((y + (Level.tileHeight >> 1)) / (Level.tileHeight)) >> 0
			};
		},
		pxLocFromTile: function () {
			return {
				x: (this.loc.xt) * Level.tileWidth,
				y: (this.loc.yt) * Level.tileHeight
			};
		},
		horizAlign: function () {
			this.loc.xpx = this.pxLocFromTile().x;
		},
		vertAlign: function () {
			this.loc.ypx = this.pxLocFromTile().y;
		},
		horizAligned: function () {
			
		},
		vertAligned: function () {
			//code
		},
		setLocPx: function (x, y) {
			if (x === undefined || y === undefined) {
				return this.loc;
			}
	
			this.lastLoc.xpx = this.loc.xpx;
			this.lastLoc.ypx = this.loc.ypx;
			
			this.loc.xpx = x;
			this.loc.ypx = y;
			
			var tileLoc = this.tileLocFromPx(this.loc.xpx, this.loc.ypx);
			
			// only change tile loc if it really changed
			this.lastLoc.xt = (this.lastLoc.xt !== tileLoc.x) ? this.loc.xt : this.lastLoc.xt;
			this.lastLoc.yt = (this.lastLoc.yt !== tileLoc.y) ? this.loc.yt : this.lastLoc.yt;
			
			this.loc.xt = tileLoc.x;
			this.loc.yt = tileLoc.y;
			return this.loc;
		},
		setLocTile: function (x, y) {
			if (x === undefined || y === undefined) {
				return this.loc;
			}
			this.loc.xt = x;
			this.loc.yt = y;
			
			// sprite location is top left corner of tile
			this.loc.xpx = (this.loc.xt) * Level.tileWidth;
			this.loc.ypx = (this.loc.yt) * Level.tileHeight;
			
			return this.loc;
		},
		
		update: function () {
		},
		
		render: function() {
			var anim = null;
			if(this.currAnim && this.anims && this.anims[this.currAnim]) {
				anim = this.currAnim;
			} else if (this.defaultAnim && this.anims && this.anims[this.defaultAnim]) {
				anim = this.defaultAnim;
			}
			anim && this.anims[anim].render(this.loc.xpx, this.loc.ypx, this.animFlip);
		
		},

		addAnim: function(name, anim) {
			// !instanceOf animation - throw && return
			this.anims[name] = anim;
		},
		
		getAnim: function (name) {
			if (this.anims[name]) {
				return this.anims[name];
			}
			return undefined;
		}


	});

	return ret;
});