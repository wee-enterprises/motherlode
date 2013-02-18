define(['entity', 'anim', 'shared'], function(Entity, Anim, Shared) {
  ret = Entity.extend({
	init: function(params) {
	  this._super(params);
	  this.addAnim(params.sheetRef, new Anim(Shared.assets[params.sheetRef], {x: 16, y: 16}, params.sequence, function(){}));
	  this.currAnim = params.sheetRef;
	}
  });
  
  return ret;
});