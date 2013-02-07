var canvas       = document.createElement('canvas')
,   body         = document.body || document.getElementsByTagName('body')[0]
,   tiles        = document.createElement('image')
,   lvlData      = null
,   currLvl      = 0
;
body.appendChild(canvas);
var ctx          = canvas.getContext('2d');

//canvas.style.background = "#000";
canvas.style.position = "absolute";
canvas.style.backgroundColor = "black";
canvas.width = 512;
canvas.height = 384;
ctx.imageSmoothingEnabled = false;

$.getJSON('data/level_data.json', function(data) {
   lvlData = data;
   tiles.onload = function() {
	  var i,row;
	  for(i=0; i<lvlData.layers[currLvl].data; i++) {
		if(lvlData.layers[currLvl].data[i] === 0) { continue; }
		
		// why no reference to with tileset in the layer?
	  }
	  
   };
   tiles.src = "img/"+data.tilesets[0].image.replace(/.*\//,'');
});

var resize = function(evt) {
  var height = window.innerHeight || body.clientHeight
  ,   width  = window.innerWidth || body.clientWidth
  ,   scale  = (width/height > canvas.width/canvas.height) ? height / canvas.height : width / canvas.width
  ,   styles = ["mozTransform","transform","webkitTransform","OTransform","msTransform"]
  ,   i      = null
  ;
  
  for(i in styles) {
	canvas.style[styles[i]] = 'scale('+scale+')';
  }
  canvas.style.top = (canvas.height*(scale-1)>>1)+"px";
  canvas.style.left = (canvas.width*(scale-1)>>1)+((width-canvas.width*scale)>>1)+"px";
};
window.addEventListener('resize', resize, false);

// TODO: move into Wee with enablement flag
window.addEventListener('blur', function(e) {
  if(!Wee.paused()) {
	console.log('pause');
	Wee.pause();
  }
}, false);
window.addEventListener('focus', function(e) {
  if(Wee.paused()) {
	console.log('resume');
	Wee.start();
  }
}, false);


resize();
