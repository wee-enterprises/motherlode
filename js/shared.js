define([], function() {
  var ret       = {}
  ,   i         = 0
  ,   j         = 0
  ,   assetType = {
		img: ['png','gif','jpeg',],
		audio: ['ogg', 'mp3', 'wav']
      }
  ;
  
  ////////////
  // MEMBERS
  ////////////
  ret.canvas       = document.createElement('canvas');
  ret.ctx          = ret.canvas.getContext('2d');
  ret.body         = document.body || document.getElementsByTagName('body')[0];
  ret.tiles        = document.createElement('image');
  ret.assets       = {};
  
  // add canvas
  ret.body.appendChild(ret.canvas);
  
  // canvas style
  ret.canvas.width = 1;
  ret.canvas.height = 1;
  ret.canvas.style.position = "absolute";
  ret.canvas.style.backgroundColor = "black";
  ret.ctx.imageSmoothingEnabled = false;
  
  /////////////
  // FUNKSHUNS
  /////////////
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
	ret.canvas.style.top = (ret.canvas.height*(scale-1)>>1)+"px";
	ret.canvas.style.left = (ret.canvas.width*(scale-1)>>1)+((width-ret.canvas.width*scale)>>1)+"px";
  };
  
  // http://www.html5rocks.com/en/tutorials/games/assetmanager/
  ret.loadAssets = function(assets, cb) {
	var assetEle = null // ( . )( . )
	,   total    = assets.length
	,   yays     = 0
	,   nays     = 0
	;
  
	function immaLetYouFinish() {
	  console.log("{total: "+total+", yays: "+yays+", nays: "+nays+"}");
	  if(total > yays+nays) {
		console.log("imma let you finish");
		return;
	  }
	  cb && cb();
	}
	
	for(i=0; i<assets.length; i++) {
	  for(j in assetType) {
		if(assetType[j].indexOf(assets[i].replace(/.*\./,'').toLowerCase()) >= 0) {
		  assetEle              = document.createElement(j);
		  assetEle.assetType    = j;
		  ret.assets[assets[i]] = assetEle;
		  
		  assetEle.addEventListener("load", function(){
			yays++;
			console.log(this.src+" loaded");
			immaLetYouFinish();
		  }, false);
		  assetEle.addEventListener("error", function() {
			nays++;
			console.log(this.src+" did NOT load");
			immaLetYouFinish();
		  }, false);
		  
		  assetEle.src = assets[i];
		}
	  }
	}
  };
  
  return ret;
});