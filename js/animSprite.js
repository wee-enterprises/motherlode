define(['entity', 'anim', 'shared'], function(Entity, Anim, Shared) {
  ret = Entity.extend({
	init: function(params) {
	  this._super(params);
	  this.addAnim(params.sheet, new Anim(Shared.assets[params.sheet], {x: 16, y: 16}, params.sequence, function(){}));
	  this.currAnim = params.sheet;
	}
  });
  
  return ret;
});