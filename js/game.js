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
	  'guard'
   ],
   function(Howl, Shared, Wee, Keys, Level, Player, Guard) {
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
		 'img/player.png'
	  ],
	  function(){
		 // START-O
		 console.log("finished loading assets");
		 player = new Player();
		 Wee.setRender(function() {
			Shared.ctx.clearRect(0,0, Shared.canvas.width, Shared.canvas.height);
			Level.render();
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