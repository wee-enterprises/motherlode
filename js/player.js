define(['dude', 'shared', 'anim'], function(Dude, Shared, Anim) {
  var ret = Dude.extend({
	init: function(params) {
	  this._super(params);
	  var me = this;
	  this.spriteSheet = Shared.assets['img/player.png'];
	  this.touchTypes = ['guard', 'gold']; // interesting when touched
	  this.addAnim("running", new Anim(this.spriteSheet, {x: 16, y: 16}, [3,3,3,3,3,3,3,3,3,3,3], function(){}));
	  this.addAnim("roping", new Anim(this.spriteSheet, {x: 16, y: 16}, [12,12,12,12,12,12,12,12,12,12,12], function(){}));
	  this.addAnim("digging", new Anim(this.spriteSheet, {x: 16, y: 16}, [3,3,3,3,3,3,3,3,3,3,3], function(){me.setState(me.States.still);}));
	  this.currAnim = "running";
	  this.defaultAnim = "running";
	},
	render: function (params) {
	  var i = 0
	  ,   curr = null
	  ;
	  
	  this._super(params);
	  if (this.touching.length > 0) {
		for (i=0; i<this.touching.length; i++) {
		  curr = this.touching[i];
		  
		  if (curr.props && curr.props.type === 'gold') {
			// pick up gold!
			this.golds++;
			Shared.pickupGold(curr.loc.xt, curr.loc.yt);
		  }
		  
		  if (curr.props && curr.props.type === 'guard') {
			Shared.sounds.die.play();
			//this.setState(this.States.dead);
		  }
		}
	  }
	  
	  // animation
	  switch (this.state) {
		default:
		  this.currAnim = this.state;
		break;
	  }

	  // RUNNING ANIMATION 
	  if (this.accX > 0) {
		this.animFlip = false;
	  } else if(this.accX < 0){
		this.animFlip = true;
	  }							  
	  console.log(this.lastState + "->" + this.state);
	  //console.log(this.lastLoc.xt + "->" + this.loc.xt + ", " + this.lastLoc.yt + "->" + this.loc.yt);
	}
  });
  
  return ret;
});