define(['assetmanager'], function(Asset) {
  var ret = {};
  
  ////////////
  // MEMBERS
  ////////////
  ret.canvas       = document.createElement('canvas');
  ret.ctx          = ret.canvas.getContext('2d');
  ret.body         = document.body || document.getElementsByTagName('body')[0];
  ret.tiles        = document.createElement('image');
  
  // add canvas
  ret.body.appendChild(ret.canvas);
  
  // canvas style
  ret.canvas.width = 1;
  ret.canvas.height = 1;
  ret.canvas.style.position = "absolute";
  ret.canvas.style.backgroundColor = "black";
  ret.ctx.imageSmoothingEnabled = false;
  

  ret.resize = function(evt) {
	var height = window.innerHeight || body.clientHeight
	,   width  = window.innerWidth || body.clientWidth
	,   wide   = (width/height > ret.canvas.width/ret.canvas.height)
	,   scale  = (wide) ? height / ret.canvas.height : width / ret.canvas.width
	,   styles = ["mozTransform","transform","webkitTransform","OTransform","msTransform"]
	,   i      = null
	;
	for(i in styles) {
	  ret.canvas.style[styles[i]] = 'scale('+scale+')';
	}
	ret.canvas.style.top = (wide) ? (ret.canvas.height*(scale-1)>>1)+"px" : (ret.canvas.height*(scale-1) - ret.canvas.height*(scale-2)>>1)+"px";
	ret.canvas.style.left = (ret.canvas.width*(scale-1)>>1)+((ret.width-ret.canvas.width*scale)>>1)+"px";
  };
  
  return ret;
});