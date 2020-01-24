/* Grid Cursor
 * x, y    : intial grid coordinates
 * moveTime: number of frames it takes for cursor to move
 *           within this timeframe, the cursor rejects input
 * drawFunc: drawing function for cursor
 */
function Cursor(cursorStart, moveTime, drawFunc) {
	this.moveTime = moveTime;
	this.drawFunc = drawFunc;
	this.goTo(cursorStart.x, cursorStart.y);
}

Cursor.prototype.draw = function() {
	this.currPosX = this.x;
	this.currPosY = this.y;
	if(this.timer){
		this.currPosX += (this.prevx-this.x)*(this.timer/this.moveTime);
		this.currPosY += (this.prevy-this.y)*(this.timer/this.moveTime);

		this.timer--;
		if(this.timer == 0){
			this.prevx = this.x;
			this.prevy = this.y;
		}
	}

	this.drawFunc(this.currPosX, this.currPosY);
}

Cursor.prototype.goTo = function(x, y){
	//if(this.timer){return;}
	this.x = x;
	this.y = y;
	this.prevx = this.currPosX;
	this.prevy = this.currPosY;
	this.timer = this.moveTime;
}

Cursor.prototype.moveUp = function() {
	this.goTo(this.x, this.y-1);
}

Cursor.prototype.moveDown = function() {
	this.goTo(this.x, this.y+1);
}

Cursor.prototype.moveLeft = function() {
	this.goTo(this.x-1, this.y);
}

Cursor.prototype.moveRight = function() {
	this.goTo(this.x+1, this.y);
}