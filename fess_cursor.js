/* Grid Cursor with Fire Emblem Style Movement
 * x, y    : intial grid coordinates
 * moveTime: number of frames it takes for cursor to move
 *           within this timeframe, the cursor rejects input
 * drawFunc: drawing function for cursor
 */
function fessCursor(cursorStart, moveTime, drawFunc) {
	this.moveTime = moveTime;
	this.drawFunc = drawFunc;
	this.goTo(cursorStart.x, cursorStart.y);
	this.moveType = moveType;
}

Cursor.prototype.draw = function() {
	this.currPosX = this.x;
	if(this.htimer){
		this.currPosX += (this.prevx-this.x)*(this.htimer/this.moveTime);

		this.htimer--;
		if(this.htimer == 0){
			this.prevx = this.x;
		}
	}

	this.currPosY = this.y;
	if(this.vtimer){
		this.currPosY += (this.prevy-this.y)*(this.vtimer/this.moveTime);

		this.htimer--;
		if(this.vtimer == 0){
			this.prevy = this.y;
		}
	}

	//this might be whack, else just use turbo
	if(this.htimer == 0 && this.vtimer == 0 && keyisDown(RIGHT_ARROW)){
		//countdown wait timer for holddown speed
		//if waitTimer == 0
		//move in which ever directions using goto;
	}

	this.drawFunc(this.currPosX, this.currPosY);
}

Cursor.prototype.goTo = function(x, y){
	this.x = x;
	this.y = y;
	this.prevx = this.currPosX;
	this.prevy = this.currPosY;
	this.htimer = this.moveTime;
	this.vtimer = this.moveTime;
}

Cursor.prototype.moveUp = function() {
	if(vtimer == 0){
		this.y--;
		this.prevy = this.currPosY;
		this.vtimer = this.moveTime;
	}
}

Cursor.prototype.moveDown = function() {
	if(vtimer == 0){
		this.y++;
		this.prevy = this.currPosY;
		this.vtimer = this.moveTime;
	}
}

Cursor.prototype.moveLeft = function() {
	if(htimer == 0){
		this.x--;
		this.prevx = this.currPosX;
		this.htimer = this.moveTime;
	}
}

Cursor.prototype.moveRight = function() {
	if(htimer == 0){
		this.x++;
		this.prevx = this.currPosX;
		this.htimer = this.moveTime;
	}
}