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
	var xPos = this.x;
	var yPos = this.y;
	if(this.timer){
		xPos += (this.prevx-this.x)*(this.timer/this.moveTime);
		yPos += (this.prevy-this.y)*(this.timer/this.moveTime);

		this.timer--;
		if(this.timer == 0){
			this.prevx = this.x;
			this.prevy = this.y;
		}
	}

	this.drawFunc(xPos, yPos);
}

Cursor.prototype.goTo = function(x, y){
	//Goto should probably run on the fastMove timer once I have it
	if(this.timer){return;}
	this.x = x;
	this.y = y;
	this.timer = this.moveTime;
}

Cursor.prototype.moveUp = function() {
	if(this.timer){return;}
	this.y--;
	this.timer = this.moveTime;
}

Cursor.prototype.moveDown = function() {
	if(this.timer){return;}
	this.y++;
	this.timer = this.moveTime;
}

Cursor.prototype.moveLeft = function() {
	if(this.timer){return;}
	this.x--;
	this.timer = this.moveTime;
}

Cursor.prototype.moveRight = function() {
	if(this.timer){return;}
	this.x++;
	this.timer = this.moveTime;
}