//Find another name for cursor if you're going to use the p5 cursor function to make a fuckin sweet flame sword cursor hell yeah dude
var cursor, grid;
var pause = false; //for halting printouts

var TILE_SIZE = 50;
var BASE_X = 20;
var BASE_Y = 50;

function setup() {
	var canvas = createCanvas(700, 500);
	canvas.parent("canvas");
	cursor = new Cursor(0, 0, 6, drawCursor);

	var data = [[1, 1, 1, 1, 0, 1, 1, 1, 1, 1],
				[1, 1, 0, 1, 1, 1, 1, 1, 1, 1],
				[0, 1, 0, 1, 0, 1, 1, 1, 0, 1],
				[0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
				[0, 1, 0, 1, 1, 1, 1, 1, 0, 1]]

	grid = new Grid(data, 10, 5, drawGrid);
}

function draw() {
	if(!pause){
		background(51);
		grid.draw();
		cursor.draw();
	}
}

function keyPressed() {
	if (keyCode === UP_ARROW && grid.validIndex(cursor.x, cursor.y-1)){
		cursor.moveUp();
	} else if (keyCode === DOWN_ARROW && grid.validIndex(cursor.x, cursor.y+1)){
		cursor.moveDown();
	} else if (keyCode === LEFT_ARROW && grid.validIndex(cursor.x-1, cursor.y)){
		cursor.moveLeft();
	} else if (keyCode === RIGHT_ARROW && grid.validIndex(cursor.x+1, cursor.y)){
		cursor.moveRight();
	} else if (key == 'p') {
		pause = !pause;
	}
}

//---------------DRAW FUNCTIONS---------------

function drawCursor(xPos, yPos){
	fill(0, 255, 0, 128);
	noStroke();
	rect(xPos*TILE_SIZE+BASE_X, yPos*TILE_SIZE+BASE_Y, TILE_SIZE, TILE_SIZE, TILE_SIZE/4);
}

function drawGrid(data){
	for(var i = 0; i < grid.data[0].length; i++){
		for(var j = 0; j < grid.data.length; j++){
			grid.data[j][i] ? fill(80, 133, 217) : fill(232, 67, 95);
			rect(i*TILE_SIZE+BASE_X, j*TILE_SIZE+BASE_Y, TILE_SIZE, TILE_SIZE);
		}
	}
	
	//draw grid lines
	stroke(200);
	for(var x = 1; x < grid.width; x++){
		line(x*TILE_SIZE+BASE_X, BASE_Y, x*TILE_SIZE+BASE_X, grid.height*TILE_SIZE+BASE_Y);
	}
	for(var y = 1; y < grid.height; y++){
		line(BASE_X, y*TILE_SIZE+BASE_Y, grid.width*TILE_SIZE+BASE_X, y*TILE_SIZE+BASE_Y);
	}
}
