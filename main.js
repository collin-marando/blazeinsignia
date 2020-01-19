//Find another name for cursor if you're going to use the p5 cursor function to make a fuckin sweet flame sword cursor hell yeah dude
var cursor, grid;
var pause = false; //for halting printouts

var TILE_SIZE = 50;
var BASE_X = 20;
var BASE_Y = 50;
var GRID_WIDTH = 10;
var GRID_HEIGHT = 5;

function setup() {
	var canvas = createCanvas(700, 500);
	canvas.parent("canvas");
	cursor = new Cursor(0, 0, 6, drawCursor);

	grid = new Grid({}, GRID_WIDTH, GRID_HEIGHT, drawGrid);
}

function draw() {
	if(!pause){
		background(51);
		grid.draw(TILE_SIZE, BASE_X, BASE_Y);
		cursor.draw();
	}
}

function keyPressed() {
	if (keyCode === UP_ARROW && cursor.y > 0){
		cursor.moveUp();
	} else if (keyCode === DOWN_ARROW && cursor.y < GRID_HEIGHT-1){
		cursor.moveDown();
	} else if (keyCode === LEFT_ARROW && cursor.x > 0){
		cursor.moveLeft();
	} else if (keyCode === RIGHT_ARROW && cursor.x < GRID_WIDTH-1){
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

function drawGrid(){
	fill(80, 133, 217);
	rect(BASE_X, BASE_Y, GRID_WIDTH*TILE_SIZE, GRID_HEIGHT*TILE_SIZE);
	stroke(200);
	for(var x = 1; x < GRID_WIDTH; x++){
		line(x*TILE_SIZE+BASE_X, BASE_Y, x*TILE_SIZE+BASE_X, GRID_HEIGHT*TILE_SIZE+BASE_Y);
	}
	for(var y = 1; y < GRID_HEIGHT; y++){
		line(BASE_X, y*TILE_SIZE+BASE_Y, GRID_WIDTH*TILE_SIZE+BASE_X, y*TILE_SIZE+BASE_Y);
	}
}
