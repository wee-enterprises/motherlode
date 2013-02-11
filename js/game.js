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
	  player && player.move.up();
   });
   Keys.on('left', function() {
	  player && player.move.left();
   });
   Keys.on('down', function() {
	  player && player.move.down();
   });
   Keys.on('right', function() {
	  player && player.move.right();
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
		 Wee.setRender(function() { 
			player = new Player();
			Level.render();
			Keys.run();
			Shared;
		 });
		 
		 Wee.start();
	  });

   return ret;
});

require(['game'], function(){});