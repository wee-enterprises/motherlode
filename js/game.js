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
	  'shared',
	  'wee',
	  'keys',
	  'level',
	  'player',
	  'guard',
	  'animSprite'
   ],
function(Shared, Wee, Keys, Level, Player, Guard, AnimSprite) {
   var ret     = {}
   ,   player  = null
   ,   guards  = []
   ,   torches = []
   ;

   function initLevel(lvl) {
	  Level.setLevel(lvl);
	  Shared.goldCount = 0;
	  Shared.entities = [];
	  
	  var i = 0
	  ,   currItem = null
	  ,   ents     = Level.getEntities()
	  ,   confObj  = {}
	  ;
		 
	  // START-O
		 
	  for(i=0; i<ents.length; i++) {
		 confObj = {};
		 confObj.xt = ents[i].loc.xt;
		 confObj.yt = ents[i].loc.yt;
		 confObj.props = ents[i].props || {};
		 
		 switch (ents[i].props.type) {
			case "torch":
			   confObj.sheet = 'img/torch.png';
			   confObj.sequence = [(Math.random()*7+Math.random()*9)>>0,10,12];
			   Shared.entities.push(new AnimSprite(confObj));
			break;
			case "gold":
			   confObj.sheet = 'img/level.png';
			   confObj.sequence = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1];
			   Shared.entities.push(new AnimSprite(confObj));
			   Shared.goldCount++;
			break;
		 	case "guard":
			   Shared.entities.push(new Guard(confObj));
			break;
			case "player":
			   Shared.player = new Player(confObj);
			break;
         }
	  }
   } // end initLevel
   
   ///////////////////
   // BROWSER EVENTS
   ///////////////////
   window.addEventListener('resize', Shared.resize, false);
   
   // TODO: move into Wee with enablement flag
   window.addEventListener('blur', function(e) {
	 if(!Wee.paused()) {
		 Wee.pause();
	 }
	 Shared.sounds.level.pause();
   }, false);
   window.addEventListener('focus', function(e) {
	 if(Wee.paused()) {
		 Wee.start();
	 }
	 //Shared.sounds.level.pause(); // try to prevent duplication 
	 //Shared.sounds.level.play();
   }, false);

   Keys.on('w', function() {
	  Shared.player && Shared.player.up();
   });
   Keys.on('a', function() {
	  Shared.player && Shared.player.left();
   });
   Keys.on('s', function() {
	  Shared.player && Shared.player.down();
   });
   Keys.on('d', function() {
	  Shared.player && Shared.player.right();
   });
   Keys.on('q', function() {
	  Shared.player && Shared.player.digLeft();
   });
   Keys.on('e', function() {
	  Shared.player && Shared.player.digRight();
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
		 //Shared.sounds.level.play();
		 initLevel(0);
		 
		 Wee.setRender(function() {
			
			if (Shared.player.state === 'winning') {
			   initLevel(Level.nextLevel());
			}
			
			Shared.ctx.clearRect(0,0, Shared.canvas.width, Shared.canvas.height);
			Level.render();
			Keys.run();
			
			for (i=0; i<Shared.entities.length; i++) {
			   Shared.entities[i].update();
			   Shared.entities[i].render();
			}
			
			Shared.player.update(); 
			Shared.player.render();
			
			if (Shared.goldCount <= 0) {
			   Level.showExit();
			}
		 });
		 
		 Wee.start();
	  });

   return ret;
});

require(['game', 'shared'], function(){});