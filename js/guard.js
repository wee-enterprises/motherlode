define(['dude', 'shared', 'anim'], function(Dude, Shared, Anim) {
  var ret = Dude.extend({
	init: function(params) {
	  this._super(params);
	  this.spriteSheet = Shared.assets['img/player.png'];
	  this.addAnim("right", new Anim(this.spriteSheet, {x: 16, y: 16}, [8,8,8,8,8,8], function(){}));
	  this.currAnim = "right";
	}
  });
  
  return ret;
});