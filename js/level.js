define(['shared', 'json!level_data'], function(Shared, levels) {
	var ret            = {}
	,   currLvl        = 0
	,   tiles          = Shared.tiles
	,   collisionTypes = ["wall", "bedrock"]
	,   ladderTypes    = ["ladder", "exit"]
	;
	
	Shared.canvas.width  = levels.width * levels.tilewidth;
	Shared.canvas.height = levels.height * levels.tileheight;
	Shared.resize();
	
	ret.setLevel = function(level) {
	  currLvl = level;
	}
	
	ret.render = function() {
	  
	  
	  tiles.onload = function() {
		 var i,row,data,numcols;
		 
		 data = levels.layers[currLvl].data;
		 
		 // number of tile cols in the tileset
		 numcols = levels.tilesets[0].imagewidth/levels.tilesets[0].tilewidth;
		 
		 for(i=0; i<data.length; i++) {
		   if(data[i] === 0) { continue; }
		   
		   // why no reference to with tileset in the layer?
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
	}
	tiles.src = "img/"+levels.tilesets[0].image.replace(/.*\//,'');
	
	return ret;
});