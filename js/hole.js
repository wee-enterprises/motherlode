define(['entity', 'shared', 'anim', 'level'], function(Entity, Shared, Anim, Level) {
  var ret = Entity.extend({
	init: function(params) {
	  this._super(params);
	  this.spriteSheet = Shared.assets['img/level.png'];
	  this.addAnim("open", new Anim(this.spriteSheet, {x: 16, y: 16}, [8,8,8,8,8,8], function(){}));
	  this.addAnim("close", new Anim(this.spriteSheet, {x: 16, y: 16}, [8,8,8,8,8,8], function(){}));
	  this.currAnim = "open";
	  this.defaultAnim = "open";
	}
  });
  
  return ret;
});