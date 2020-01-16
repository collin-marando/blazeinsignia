
//TO-DO: come up with a better name for the cursor variable ("cursor" is already used by p5)
var cursor1;
var pause = false; //for halting printouts

var GRID_SIZE = 50;

function setup() {
	var canvas = createCanvas(700, 500);
	canvas.parent("canvas");
	cursor1 = new Cursor(0, 0, GRID_SIZE);
}

function draw() {
	if(!pause){
		background(51);
		cursor1.draw();
		drawGridLines();
	}
}

function drawGridLines(){
	stroke(200);
	fill(0, 255, 0, 128);
	for(var x = GRID_SIZE; x < width; x += GRID_SIZE){
		line(x, 0, x, height);
	}
	for(var y = GRID_SIZE; y < height; y += GRID_SIZE){
		line(0, y, width, y);
	}
}

function keyPressed() {
	if (keyCode === UP_ARROW){
		cursor1.moveUp();
	} else if (keyCode === DOWN_ARROW){
		cursor1.moveDown();
	} else if (keyCode === LEFT_ARROW){
		cursor1.moveLeft();
	} else if (keyCode === RIGHT_ARROW){
		cursor1.moveRight();
	} else if (key == 'p') {
		pause = !pause;
	}
}