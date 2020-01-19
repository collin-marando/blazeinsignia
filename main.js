//Find another name for cursor if you're going to use the p5 cursor function to make a fuckin sweet flame sword cursor hell yeah dude
var cursor, grid, data;
var pause = false; //for halting printouts

var TILE_SIZE = 50;
var BASE_X = 100;
var BASE_Y = 125;
var MOVE_TIME = 6;

function setup() {
	var canvas = createCanvas(700, 500);
	canvas.parent("canvas");
	cursor = new Cursor(0, 0, MOVE_TIME, drawCursor);

	data = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0],
			[0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
			[0, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0],
			[0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0],
			[0, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 0],
			[0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];
	data.gridStart = {x: 1, y: 1};

	grid = new Grid(data.gridStart, 10, 5, MOVE_TIME, drawGrid);
}

function draw() {
	if(!pause){
		background(155);
		grid.draw();
		cursor.draw();
	}
}

function keyPressed() {
	if (keyCode === UP_ARROW && validIndex(cursor.x, cursor.y-1)){
		if(cursor.y === 0){
			grid.moveDown();
		} else {
			cursor.moveUp();
		}
	} else if (keyCode === DOWN_ARROW && validIndex(cursor.x, cursor.y+1)){
		if(cursor.y === grid.height-1){
			grid.moveUp();
		} else {
			cursor.moveDown();
		}
	} else if (keyCode === LEFT_ARROW && validIndex(cursor.x-1, cursor.y)){
		if(cursor.x === 0){
			grid.moveRight()
		} else {
			cursor.moveLeft();
		}
	} else if (keyCode === RIGHT_ARROW && validIndex(cursor.x+1, cursor.y)){
		if(cursor.x === grid.width-1){
			grid.moveLeft()
		} else {
			cursor.moveRight();
		}
	} else if (key === 'p') {
		pause = !pause;
	}
	console.log(cursor.x + ", " + cursor.y);
}

//-------------MAP DATA FUNCTIONS-------------

function validIndex(x, y){
	x += grid.x;
	y += grid.y;
	if(x >= 0 && x < this.data[0].length && y >= 0 && y < this.data.length){
		return this.data[y][x] == 1;
	}
	return false;
}

//---------------DRAW FUNCTIONS---------------

function drawCursor(xPos, yPos){
	fill(0, 255, 0, 128);
	noStroke();
	rect(xPos*TILE_SIZE+BASE_X, yPos*TILE_SIZE+BASE_Y, TILE_SIZE, TILE_SIZE, TILE_SIZE/4);
}

function drawGrid(xPos, yPos){
	//draw grid tiles
	for(var i = 0; i < data[0].length; i++){
		for(var j = 0; j < data.length; j++){
			data[j][i] ? fill(80, 133, 217) : fill(232, 67, 95);
			rect((i-xPos)*TILE_SIZE+BASE_X, (j-yPos)*TILE_SIZE+BASE_Y, TILE_SIZE, TILE_SIZE);
		}
	}
	
	//draw grid lines
	stroke(200);
	strokeWeight(1);
	for(var x = 1; x < grid.width; x++){
		line(x*TILE_SIZE+BASE_X, BASE_Y, x*TILE_SIZE+BASE_X, grid.height*TILE_SIZE+BASE_Y);
	}
	for(var y = 1; y < grid.height; y++){
		line(BASE_X, y*TILE_SIZE+BASE_Y, grid.width*TILE_SIZE+BASE_X, y*TILE_SIZE+BASE_Y);
	}

	//draw grid box for conceptual purposes
	stroke(0);
	strokeWeight(4);
	noFill();
	rect(BASE_X-2, BASE_Y-2, grid.width*TILE_SIZE+4, grid.height*TILE_SIZE+4);
}
