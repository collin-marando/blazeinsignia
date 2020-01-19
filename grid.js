/* Grid Window
 * gridStart: starting coords for the grid
 * width: visible tile width
 * height: visible tile height
 * drawFunc: drawing function for grid
 */
function Grid(gridStart, width, height, moveTime, drawFunc){
	this.width = width;
	this.height = height;
	this.moveTime = moveTime;
	this.drawFunc = drawFunc;
	this.goTo(gridStart.x, gridStart.y);
}

Grid.prototype.draw = function(){
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

Grid.prototype.goTo = function(x, y){
	this.x = x;
	this.y = y;
	this.prevx = x;
	this.prevy = y;
	this.timer = 0;
}

Grid.prototype.moveUp = function() {
	if(this.timer){return;}
	this.y++;
	this.timer = this.moveTime;
}

Grid.prototype.moveDown = function() {
	if(this.timer){return;}
	this.y--;
	this.timer = this.moveTime;
}

Grid.prototype.moveLeft = function() {
	if(this.timer){return;}
	this.x++;
	this.timer = this.moveTime;
}

Grid.prototype.moveRight = function() {
	if(this.timer){return;}
	this.x--;
	this.timer = this.moveTime;
}
