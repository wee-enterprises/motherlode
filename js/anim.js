define(['class', 'shared'], function(Class, Shared){
  ret = Class.extend({
	init: function(sheetRef, dims, sequence, cycleCB) {
	  if(!sheetRef || typeof sheetRef !== 'object') {
		throw new Error("Bad sprite sheet reference passed to anim");
	  }
	
	  this.sheet = sheetRef;
	  this.dims = {
		x: dims.x || 16,
		y: dims.y || 16
	  };
	  this.sequence = sequence;
	  this.cb = cycleCB;
	  this.rollover = false;
	  this._loop = true;
	  
	  this.sheetCols = (sheetRef.width / this.dims.x)>>0;
	  
	  this.ctr = 0; // sequence element counter
	  this.ptr = 0; // sequence index
	},
	
	render: function(x,y,flip) {
	  if (this.rollover && !this._loop) {
		return;
	  }
	  
	  // skip 0 frame sequences
	  while (this.sequence[this.ptr] === 0) {
		this.ctr = 0;
		this.ptr++;
	  }
	  
	  Shared.ctx.save();
	  if (flip) {
		Shared.ctx.translate(Shared.canvas.width, 0);
		Shared.ctx.scale(-1,1);
		x = Shared.canvas.width - x - this.dims.x;
	  }
	  
	  Shared.ctx.drawImage(
		this.sheet,
		((this.ptr) % this.sheetCols) * this.dims.x,
		((this.ptr / this.sheetCols)>>0) * this.dims.y,
		this.dims.x,
		this.dims.y,
		x,
		y,
		this.dims.x,
		this.dims.y
	  );
	  Shared.ctx.restore();
	  
	  if(++this.ctr % this.sequence[this.ptr] === 0) { // counter rollover 
		this.ctr = 0;
		this.ptr = (this.ptr+1) % this.sequence.length;
		if(this.ptr === 0) {
		  this.cb && this.cb();
		  this.rollover = true;
		}
	  }
	},
	rewind: function() {
	  this.ctr = 0;
	  this.ptr = 0;
	  this.rollover = false;
	},
	
	loop: function (loopit) {
	  this._loop = loopit;
	}
  });
  
  
  return ret;
});