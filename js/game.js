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
   var ret     = {}
   ,   player  = null
   ,   guards  = []
   ,   torches = []
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
		 Level.setLevel(1);
		 var i = 0
                 ,   ents    = Level.getEntities()
                 ,   currLoc = null
		 ;
		 
		 // START-O
		 console.log("finished loading assets");
		 
		 for(i=0; i<ents.length; i++) {
                     currLoc = ents[i].loc;
                     switch (ents[i].props.type) {
                        case "torch":
                           torches.push(new AnimSprite({
                              xt: currLoc.xt,
			      yt: currLoc.yt,
			      sheetRef: 'img/torch.png',
			      sequence: [(Math.random()*7+Math.random()*9)>>0,10,12]
			   }));                           
                           break;
                        case "player":
                           player = new Player({
                              xt: currLoc.xt,
                              yt: currLoc.yt
                           });
                           break;
                        case "guard":
                           guards.push(new Guard({
                              xt: currLoc.xt,
                              yt: currLoc.yt                           
                           }));
                           break;
                     }
		 }
		 
		 Wee.setRender(function() {
			Shared.ctx.clearRect(0,0, Shared.canvas.width, Shared.canvas.height);
			Level.render();
			for(i=0; i<torches.length; i++) {
			   torches[i].render();
			}
			Keys.run();
			player.update(); 
			player.render();
                        for (i=0; i<guards.length; i++) {
                           guards[i].render();
                        }
			Shared;
		 });
		 
		 Wee.start();
	  });

   return ret;
});

require(['game'], function(){});