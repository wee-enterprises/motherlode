define(['dude', 'shared', 'anim'], function(Dude, Shared, Anim) {
  var ret = Dude.extend({
	init: function(params) {
	  this._super(params);
	  this.spriteSheet = Shared.assets['img/player']; // will this go through to entity?
	  //this.anim.left = new Anim();
	},
	render: function() {
	  
	}
  });
  
  return ret;
});