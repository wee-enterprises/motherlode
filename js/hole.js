define(['entity', 'shared', 'anim', 'level'], function(Entity, Shared, Anim, Level) {
  var ret = Entity.extend({
	init: function(params) {
	  this._super(params);
	  var me = this;
	 
	  this.props = {
		type: "hole"
	  };
	  this.spriteSheet = Shared.assets['img/level.png'];
	  this.addAnim("open", new Anim(this.spriteSheet, {x: 16, y: 16}, [8,8,8,8,8,200], function(){
		me.currAnim = "close";
		console.log("closing hole at "+me.loc.xt+", "+me.loc.yt);
	  }));
	  this.addAnim("close", new Anim(this.spriteSheet, {x: 16, y: 16}, [0,0,0,0,0,0,8,8,8,8,8,8], function(){
		//-- leak?
	  	Shared.sealHoleAt(me.loc.xt, me.loc.yt);
		Level.sealHoleAt(me.loc.xt, me.loc.yt);
		
		// stop animation just in case
		me.getAnim("close").loop(false);
	  }));
	  this.currAnim = "open";
	  this.defaultAnim = "open";
	}
  });
  
  return ret;
});