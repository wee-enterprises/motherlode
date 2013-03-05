define(['dude', 'shared', 'anim', 'level'], function(Dude, Shared, Anim, Level) {
  var ret = Dude.extend({
	init: function(params) {
	  this._super(params);

	  this.spriteSheet = Shared.assets['img/player.png'];
	  this.addAnim("right", new Anim(this.spriteSheet, {x: 16, y: 16}, [8,8,8,8,8,8], function(){}));
	  this.currAnim = "right";

	  // override acc values
	  this.setAcc({
		inc: 0.3,
		dec: 0.6,
		max: 1.1,
		gravity: 0.6,
		maxGravity: 4
	  });
	},
	update: function (params) {
	  var ladderNearPlayer = null
	  ,   i = 0
	  ;
	  
	  // AI before rules - super runs rules
	  if (this.loc.yt !== Shared.player.loc.yt) {
		ladderNearPlayer = Level.getClosestRegexTypeLoc(/ladder|exit/, Shared.player.loc.xt, this.loc.yt);
		if (ladderNearPlayer > this.loc.xt) {
		  this.right();
		} else if (this.loc.xt === ladderNearPlayer) {
		  // on it - move!
		  (this.loc.yt < Shared.player.loc.yt) ? this.down() : this.up();
		} else {
		  this.left();
		}
	  } else {
		if (this.loc.xt > Shared.player.loc.xt) {
		  this.left();
		} else if (this.loc.xt === Shared.player.loc.xt) {
		  
		} else {
		  this.right();
		}
	  }
	  
	  this._super(params);
	  
	  if (this.state === this.States.dead) {
		this.setLocTile(this.spawnLoc.xt, this.spawnLoc.yt);
		this.setState(this.States.still);
		Shared.sounds.holeyDeath.play();
	  }
	  
	  if (this.touching.length > 0) {
		for (i=0; i<this.touching.length; i++) {
		  curr = this.touching[i];
			if (curr.props.type === 'hole') {
				this.setState(this.States.holed);
			}		  
		}
	  }
	  
	}
  });
  
  return ret;
});