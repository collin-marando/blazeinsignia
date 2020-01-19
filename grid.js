/* data: cell data for the entire map
 * width: visible tile width
 * height: visible tile height
 * drawFunc: drawing function for grid
 */
function Grid(data, width, height, drawFunc){
	this.data = data; //Not necessary on init, maybe just make a load func and take this out
	this.width = width;
	this.height = height;
	this.drawFunc = drawFunc;
}

Grid.prototype.draw = function(){
	this.drawFunc();
}

Grid.prototype.validIndex = function(x, y){
	//if coords are not out of index
	if(x >= 0 && x < this.data[0].length && y >= 0 && y < this.data.length){
		//if coords represent a playable tile
		return this.data[y][x] == 1;
	}
	return false;
}

Grid.prototype.MoveUp = function(){
	
}

Grid.prototype.MoveDown = function(){
	
}

Grid.prototype.MoveLeft = function(){
	
}

Grid.prototype.MoveRight = function(){
	
}
