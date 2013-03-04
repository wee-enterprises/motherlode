define(
	[
		'zepto',
		'json!level_data',
		'shared'
	],
	function($, levels, Shared) {
	var ret            = {}
	,   currLvl        = 0
	,   numLevels      = levels.layers.length
	,   currLvlData    = null
	,   currTileProps  = null
	,   entities       = []
	,   holes          = []
	,   occupiedRef    = 29 + 1 // tileRefs are off by one from lvlData
	,   filledHoleRef  = 32 + 1 
	,   entityTypes    = ["player", "guard", "torch", "gold"]
	,   collisionTypes = ["wall", "bedrock"]
	,   ladderTypes    = ["ladder", "exit"]
	,   width          = levels.width
	,   height         = levels.height
	,   tileWidth      = levels.tilewidth
	,   tileHeight     = levels.tileheight
	;
	
	Shared.canvas.width  = levels.width * levels.tilewidth;
	Shared.canvas.height = levels.height * levels.tileheight;
	Shared.resize();

	// probably easier to just initialize these in ret object...
	ret.collisionTypes = collisionTypes;
	ret.ladderTypes    = ladderTypes;
	ret.width          = width;
	ret.height         = height;
	ret.tileWidth      = tileWidth;
	ret.tileHeight     = tileHeight;

	var getLvlData = function (xt, yt) {
			return currLvlData[(yt * levels.width) + xt];
		},
		setLvlData = function (xt, yt, data) {
			currLvlData[(yt * levels.width) + xt] = data;
		}
		;
	
	ret.getLvlData = getLvlData;
	ret.setLvlData = setLvlData;
	
	ret.showExit = function () {
		for (var i in currTileProps) {
			if (currTileProps[i].type === "exit") {
				currTileProps[i].hidden = false;
			}
		}
	};
	
	ret.hideExit = function () {
		for (var i in currTileProps) {
			if (currTileProps[i].type === "exit") {
				currTileProps[i].hidden = true;
			}
		}		
	};
	
	ret.setLevel = function(level) {
		var props = null;
		currLvl   = level;
		entities  = [];
		ret.hideExit();
		
		// copy the level for mutation + preservation
		currLvlData   = $.extend([], levels.layers[currLvl].data);
		currTileProps = $.extend([], levels.tilesets[0].tileproperties);
		
		for(var i=0; i<currLvlData.length; i++) {
			props = currTileProps[currLvlData[i]-1];
			
			if(props && entityTypes.indexOf(props.type) > -1) {
				entities.push({
					loc: {
						xt: i % levels.width,
						yt: (i / levels.width)>>0
					},
					props: props
				});
			}
		}
		
		return currLvl;
	};
	
	ret.nextLevel = function () {
		return ((currLvl + 1) % numLevels);
	};
	
	ret.render = function() {
		var i, data, numcols, tiles, props;

		tiles = Shared.assets["img/level.png"];
		data = currLvlData;

		// number of tile cols in the tileset
		numcols = levels.tilesets[0].imagewidth / levels.tilesets[0].tilewidth;

		for(i = 0; i < data.length; i++) {
			// tile properties are off by one (data[i])-1 is the ref!
			props = currTileProps[data[i] - 1];

			// bail if 0 (no tile) or hidden
			if(data[i] === 0 || (props && (props.hidden || props.norender))) {
				continue;
			}

			// why no reference to tileset in the layer?
			Shared.ctx.drawImage(
				tiles,
				((data[i] - 1) % numcols) * levels.tilewidth,
				((data[i] / numcols) >> 0) * levels.tileheight,
				levels.tilewidth,
				levels.tileheight,
				(i % levels.width) * levels.tilewidth,
				((i / levels.width) >> 0) * levels.tileheight,
				levels.tilewidth,
				levels.tileheight
			);
		}
	};
	
	ret.getEntities = function() {
		return entities;
	};
	
	ret.createHole = function (xt, yt) {
		var tile  = getLvlData(xt, yt)
		,   props = currTileProps[tile-1]
		;
		
		if (props && props.type !== 'bedrock') {
			console.log('makin a hole at ' + xt + ', ' + yt);
			setLvlData(xt, yt, 0);
			holes.push({
				xt: xt,
				yt: yt,
				occupied: false
			});
		}
	};
	
	ret.fillHole = function (xt, yt) {
	  
	};
	
	ret.holeOccupied = function (xt, yt) {
		var i = 0;
		for (i = 0; i<holes.length; i++) {
			if (holes[i].xt === xt && holes[i].yt === yt) {
				holes[i].occupied = true;
				setLvlData(xt, yt, occupiedRef);
			}
		}
	};
	
	// scan horizontal for nearest ladder
	ret.getClosestRegexTypeLoc = function (regex, xt, yt) {
		var i     = xt
		,   found = xt
		;
		
		// scan forward
		for (i = xt; i < levels.width; i++) {
			if (currTileProps[getLvlData(xt, yt) - 1] && regex.test(currTileProps[getLvlData(xt, yt) - 1].type)) {
				found = i;
				break;
			}
		}
		
		// scan back
		for (i = xt; i > 0; i--) {
			if (currTileProps[getLvlData(xt, yt) - 1] && regex.test(currTileProps[getLvlData(xt, yt) - 1].type)) {
				if (Math.abs(xt-i) < Math.abs(xt-found)) {
					found = i;
				}
			}
		}
		
		return found;
	};

	
	ret.pxToTileLoc = function (xpx, ypx) {
		return {
			x: (xpx / levels.tilewidth) >>0,
			y: (ypx / levels.tileheight) >>0
		};
	};
	
	// top left of tile
	ret.tileToPxLoc = function (xt, yt) {
		return {
			x: xt * levels.tilewidth,
			y: yt * levels.tileheight
		};
	};

	ret.getTileProps = function(xt, yt) {
		var props = currTileProps[getLvlData(xt, yt)-1];
		if (props && !props.hidden) {
			return props;
		}
		return null;
	};
	
	/**
	 * returns array/grid of tile props given tile coords
	 */
	ret.getTileMap = function (tx, ty) {
		/**
		 * |  0  |  1   |  2  |
		 * |  3  | 4x,y |  5  |
		 * |  6  |  7   |  8  |
		 */
		
		var tileMap = []
		,   col     = 0
		,   row     = 0
		;
		
		for (row = ty-1; row<(ty+2); row++) {
			for (col = tx-1; col<(tx+2); col++) {
				tileMap.push(ret.getTileProps(col, row));
			}
		}
		
		return tileMap;
		
	};
	ret.setLevel(0); // Game should do this... but if it doesn't
	
	return ret;
});