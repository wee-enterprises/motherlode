define(
['zepto', 'shared', 'json!level_data'], function($, Shared, levels) {
	var ret = {},
		currLvl = 0,
		currLvlData = null,
		collisionTypes = ["wall", "bedrock"],
		ladderTypes = ["ladder", "exit"],
		tileWidth = levels.tilewidth,
		tileHeight = levels.tileheight;

	Shared.canvas.width = levels.width * levels.tilewidth;
	Shared.canvas.height = levels.height * levels.tileheight;
	Shared.resize();

	ret.setLevel = function(level) {
		currLvl = level;

		// copy the level for mutation + preservation
		currLvlData = $.extend([], levels.layers[currLvl].data);
	};

	ret.render = function() {
		var i, data, numcols, tiles, props;

		tiles = Shared.assets["img/level.png"];
		data = currLvlData;

		// number of tile cols in the tileset
		numcols = levels.tilesets[0].imagewidth / levels.tilesets[0].tilewidth;

		for(i = 0; i < data.length; i++) {
			// tile properties are off by one (data[i])-1 is the ref!
			props = levels.tilesets[0].tileproperties[data[i] - 1];

			// bail if 0 (no tile) or hidden
			if(data[i] === 0 || (props && props.hidden)) {
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
				levels.tileheight);
		}
	};

	ret.getPlayer = function() {
		for(var i = 0; i < currLvlData.length; i++) {

		}
		return null;
	};

	ret.getGuards = function() {

	};

	/**
	 *
	 */
	ret.tileType = function(x, y) {

	};

	/**
	 *
	 */
	ret.tileTypePx = function(x, y) {

	};

	ret.getTileWidth = function() {
		return tileWidth;
	};

	ret.getTileHeight = function() {
		return tileHeight;
	};

	ret.getTileTypeAtPosition = function(xt, yt) {
		var dataIndex, tilePropertyIndex, tileProperties, tileType;

		// the data index finds us the location of the element at this tile location (x/y)
		// this is done by moving across the board (x) and adding a full row (levels.width)
		// for every tile we move down (y)
		dataIndex = xt + (yt * levels.width);

		// now use the current level data to retrieve the tile property index
		tilePropertyIndex = currLvlData[dataIndex];
		// tile properties are off by one, need to subtract 1
		tilePropertyIndex = tilePropertyIndex - 1;

		// get the tile properties
		tileProperties = levels.tilesets[0].tileproperties[tilePropertyIndex];

		// now return the type (return undefined if nothing's there?)
		if (tileProperties) {
			return tileProperties.type;
		} else {
			return undefined;
		}
	};

	ret.getCollisionTypes = collisionTypes;

	ret.setLevel(0); // Game should do this... but if it doesn't
	return ret;
});