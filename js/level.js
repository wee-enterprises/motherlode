define(
	[
		'zepto',
		'shared',
		'json!level_data'
	],
	function($, Shared, levels) {
	var ret            = {}
	,   currLvl        = 0
	,   currLvlData    = null
	,   entities       = []
	,   entityTypes    = ["player", "guard", "torch"]
	,   collisionTypes = ["wall", "bedrock"]
	,   ladderTypes    = ["ladder", "exit"]
	,   tileWidth      = levels.tilewidth
	,   tileHeight     = levels.tileheight
	;
	
	Shared.canvas.width  = levels.width * levels.tilewidth;
	Shared.canvas.height = levels.height * levels.tileheight;
	Shared.resize();
	
	ret.setLevel = function(level) {
		var props = null;
		currLvl   = level;
		entities  = [];
		
		// copy the level for mutation + preservation
		currLvlData = $.extend([], levels.layers[currLvl].data);
		
		for(var i=0; i<currLvlData.length; i++) {
			props = levels.tilesets[0].tileproperties[currLvlData[i]-1];
			
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
		
	}
	
	ret.render = function() {
		var i,data,numcols,tiles,props;
		
		tiles = Shared.assets["img/level.png"];
		data  = currLvlData;
		
		// number of tile cols in the tileset
		numcols = levels.tilesets[0].imagewidth/levels.tilesets[0].tilewidth;
		
		for(i=0; i<data.length; i++) {
			// tile properties are off by one (data[i])-1 is the ref!
			props = levels.tilesets[0].tileproperties[data[i]-1];
			
			// bail if 0 (no tile) or hidden
			if(data[i] === 0 || (props && props.hidden)) { continue; }
			
			// why no reference to tileset in the layer?
			Shared.ctx.drawImage(
				tiles,
				((data[i]-1) % numcols) * levels.tilewidth,
				((data[i] / numcols)>>0) * levels.tileheight,
				levels.tilewidth,
				levels.tileheight,
				(i % levels.width) * levels.tilewidth,
				((i / levels.width)>>0) * levels.tileheight,
				levels.tilewidth,
				levels.tileheight
			);
		}
	};
	
	ret.getEntities = function() {
		return entities;
	};
	
	/**
	 *
	 */
	ret.tileType = function(x,y) {
		
	};
	
	/**
	 *
	 */
	ret.tileTypePx = function(x,y) {
		
	};
	
	ret.setLevel(0); // Game should do this... but if it doesn't
	return ret;
});