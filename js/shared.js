define(['howler'], function(Howl) {
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
  ret.Howler        = Howl;
  ret.canvas        = document.createElement('canvas');
  ret.ctx           = ret.canvas.getContext('2d');
  ret.body          = document.body || document.getElementsByTagName('body')[0];
  ret.assets        = {};
  ret.player        = null;
  ret.entities      = [];
  ret.goldCount     = 0;
  ret.sounds        = {
	gold: new Howl({
	  urls: ['sound/gold.ogg','sound/gold.mp3','sound/gold.wav']
	}),
	die: new Howl({
	  urls: ['sound/die.ogg', 'sound/die.mp3']
	}),
	holeyDeath: new Howl({
	  urls: ['sound/guard_death.ogg', 'sound/guard_death.mp3']
	}),
	playerDeath: new Howl({
	  urls: ['sound/player_death.ogg', 'sound/player_death.mp3']
	}),
	dig: new Howl({
	  urls: ['sound/dig.ogg', 'sound/dig.mp3']
	}),
	level: new Howl({
	  urls: ['sound/DST-GreenSky.ogg', 'sound/DST-GreenSky.mp3'],
	  loop: true
	})
  };
   
  //-- set the volume
  for (i in ret.sounds) {
	if (i === 'level') {
	  ret.sounds[i].volume(.08);
	  continue;
	}
	ret.sounds[i].volume(.03);
  }
  
  // add canvas
  ret.body.appendChild(ret.canvas);
  
  // canvas style
  ret.canvas.width = 1;
  ret.canvas.height = 1;
  ret.canvas.style.position = "absolute";
  ret.canvas.style.backgroundColor = "black";
  //ret.ctx.imageSmoothingEnabled = false;
  
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
  
  ret.pickupGold = function (xt, yt) {
	var i    = 0
	,   curr = null
	;
	
	for (i=0; i<ret.entities.length; i++) {
	  curr = ret.entities[i];
	  if (curr.props && curr.props.type === "gold" && curr.loc.xt === xt && curr.loc.yt === yt) {
		console.log("removing gold: "+curr.loc.xt+", "+curr.loc.yt);
		ret.sounds.gold.play();
		ret.entities.splice(i, 1);
		ret.goldCount --;
	  }
	}
  };
  
  ret.getEntityAt = function (xt, yt) {
	var i = 0
	,   entity = null
	;
	
	for (i = 0; i<ret.entities.length; i++) {
	  if (ret.entities[i].loc.xt === xt && ret.entities[i].loc.yt === yt) {
		entity = ret.entities[i];
		break;
	  }
	}
	
	return entity;
  };
  
  ret.removeEntityAt = function (xt, yt, type) {
	var i = 0;
	
	for (i = 0; i<ret.entities.length; i++) {
	  if (ret.entities[i].loc.xt === xt && ret.entities[i].loc.yt === yt) {
		//console.log(ret.entities[i]);
		if (!type || (!ret.entities[i].props || ret.entities[i].props.type !== type)) {
		  continue;
		}
		ret.entities[i] = undefined;
		ret.entities.splice(i, 1);
		return true;
	  }
	}
	
	return false;
  };
  
  // kinda weird - the hole entity itself removes the shared reference ... hopefully to be garbage collected
  ret.sealHoleAt = function (xt, yt) {
	//console.log("destroying hole entity at " + xt + ", " + yt);
	ret.removeEntityAt(xt, yt, 'hole');
  };

  // http://www.html5rocks.com/en/tutorials/games/assetmanager/
  ret.loadAssets = function(assets, cb) {
	var assetEle = null // ( . )( . )
	,   total    = assets.length
	,   yays     = 0
	,   nays     = 0
	;
  
	function immaLetYouFinish() {
	  //console.log("{total: "+total+", yays: "+yays+", nays: "+nays+"}");
	  if(total > yays+nays) {
		//console.log("imma let you finish");
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
			this.assetLoaded = true;
			immaLetYouFinish();
		  }, false);
		  assetEle.addEventListener("error", function() {
			nays++;
			console.log(this.src+" did NOT load");
			this.assetLoaded = false;
			immaLetYouFinish();
		  }, false);
		  
		  assetEle.src = assets[i];
		}
	  }
	}
  };
  return ret;
  //return ret;
});