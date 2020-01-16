//number of frames it takes for cursor to move
//within this timeframe, the cursor rejects input
var ANIM_TIME = 6;

function Cursor(x, y, gridSize) {
	this.x = x;
	this.y = y;
	this.gridSize = gridSize;

	//Animation
	this.prevx = x;
	this.prevy = y;
	this.timer = 0;
}

Cursor.prototype.draw = function() {
	fill(0, 255, 0, 128);
	noStroke();

	var xPos = this.x;
	var yPos = this.y;
	if(this.timer){
		xPos += (this.prevx-this.x)*(this.timer/ANIM_TIME);
		yPos += (this.prevy-this.y)*(this.timer/ANIM_TIME);

		this.timer--;
		if(this.timer == 0){
			this.prevx = this.x;
			this.prevy = this.y;
		}
	}
	xPos *= this.gridSize;
	yPos *= this.gridSize;

	rect(xPos, yPos, this.gridSize, this.gridSize, this.gridSize/4);
}

Cursor.prototype.moveUp = function() {
	if(this.timer){return;}
	this.y--;
	this.timer = ANIM_TIME;
}

Cursor.prototype.moveDown = function() {
	if(this.timer){return;}
	this.y++;
	this.timer = ANIM_TIME;
}

Cursor.prototype.moveLeft = function() {
	if(this.timer){return;}
	this.x--;
	this.timer = ANIM_TIME;
}

Cursor.prototype.moveRight = function() {
	if(this.timer){return;}
	this.x++;
	this.timer = ANIM_TIME;
}