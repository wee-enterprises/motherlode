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
   var ret = {};

   ///////////////////
   // BROWSER EVENTS
   ///////////////////
   window.addEventListener('resize', Shared.resize, false);
   
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

   ///////////////////////////////////
   // MOTHERLODE!!!!!11!!1!1one1!one
   //////////////////////////////////
   Level.render();

   return ret;
});

require(['game'], function(){});