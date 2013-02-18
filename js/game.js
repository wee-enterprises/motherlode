requirejs.config({
   paths: {
	  "text":   "lib/plugins/text", // needed by json
	  "json":   "lib/plugins/json",
	  "class":  "lib/class",
	  "zepto":  "lib/zepto",
	  "howler": "lib/howler",
	  "level_data": "../data/level_data.json"
   },
   shim: {
	  "class": {
		 exports: "Class"
   	  },
	  "zepto": {
		 exports: "$"
	  },
	  "howler": {
		 exports: "Howl"
	  }
   }
});

define('game',
   [
	  'howler',
	  'shared',
	  'wee',
	  'keys',
	  'level',
	  'player',
	  'guard',
	  'animSprite'
   ],
   function(Howl, Shared, Wee, Keys, Level, Player, Guard, AnimSprite) {
   var ret    = {}
   ,   player = null
   ,   guards = []
   ;

   ///////////////////
   // BROWSER EVENTS
   ///////////////////
   window.addEventListener('resize', Shared.resize, false);
   
   // TODO: move into Wee with enablement flag
   window.addEventListener('blur', function(e) {
	 if(!Wee.paused()) {
	   //console.log('pause');
	   Wee.pause();
	 }
   }, false);
   window.addEventListener('focus', function(e) {
	 if(Wee.paused()) {
	   //console.log('resume');
	   Wee.start();
	 }
   }, false);

   Keys.on('up', function() {
	  player && player.up();
   });
   Keys.on('left', function() {
	  player && player.left();
   });
   Keys.on('down', function() {
	  player && player.down();
   });
   Keys.on('right', function() {
	  player && player.right();
   });
   ///////////////////////////////////
   // MOTHERLODE!!!!!11!!1!1one1!one
   //////////////////////////////////
   Shared.loadAssets(
	  [
		 'img/level.png',
		 'img/player.png',
		 'img/torch.png'
	  ],
	  function(){
		 var i = 0
		 ,   torches = []
		 ;
		 
		 // START-O
		 console.log("finished loading assets");
		 player = new Player();
		 Level.setLevel(0);
		 
		 for(i=0; i<Level.getEntities().length; i++) {
			if(Level.getEntities()[i].props.type === "torch") {
			   torches.push(new AnimSprite({
				  xt: Level.getEntities()[i].loc.xt,
				  yt: Level.getEntities()[i].loc.yt,
				  sheetRef: 'img/torch.png',
				  sequence: [9,10,12]
			   }));
			}
		 }
		 
		 Wee.setRender(function() {
			Shared.ctx.clearRect(0,0, Shared.canvas.width, Shared.canvas.height);
			Level.render();
			for(i=0; i<torches.length; i++) {
			   torches[i].render();
			}
			//torch.render();
			Keys.run();
			player.gravity();
			player.render();
			Shared;
		 });
		 
		 Wee.start();
	  });

   return ret;
});

require(['game'], function(){});