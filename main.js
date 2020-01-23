//Find another name for cursor if you're going to use the p5 cursor function to make a fuckin sweet flame sword cursor hell yeah dude
var cursor, grid, data;
var pause = false; //for halting printouts
var coverOuter = true;

var TILE_SIZE = 50;
var BASE_X = 100;
var BASE_Y = 125;
var MOVE_TIME = 6;
var VIEW_BORDER = 1;

function setup() {
	var canvas = createCanvas(700, 500);
	canvas.parent("canvas");

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

	data.cursorStart = {x: 1, y:1};
	cursor = new Cursor(data.cursorStart, MOVE_TIME, drawCursor);
}

function draw() {
	if(!pause){
		background(155);
		grid.draw();
		cursor.draw();

		fill(50);
		if(coverOuter){
			rect(0, 0, width, BASE_Y);
			rect(0, 0, BASE_X, height);
			rect(BASE_X+grid.width*TILE_SIZE, 0, width, height);
			rect(0, BASE_Y+grid.height*TILE_SIZE, width, height);
			fill(255);
		}

		textSize(32);
		text("cursor map location: " + (cursor.x + grid.x) + ", " + (cursor.y + grid.y), 10, 40);
	}
}

//--------------MAP FUNCTIONS-------------

function validIndex(x, y){
	if(x >= 0 && x < this.data[0].length && y >= 0 && y < this.data.length){
		return this.data[y][x] == 1;
	}
	return false;
}

//This function depends on where we want the cursor to land in the window
//It may be useful to generate padding tiles instead of require them to be hard coded
//This way, there can be sufficient padding for the cursor to be anchored anywhere
var X_ANCHOR = 2;
var Y_ANCHOR = 2;
function goTo(x,y){
	if(validIndex(x,y)){
		grid.goTo(x-X_ANCHOR,y-Y_ANCHOR);
		cursor.goTo(X_ANCHOR, Y_ANCHOR);
	}
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
	for(var x = 0; x <= grid.width; x++){
		line((x-xPos+grid.x)*TILE_SIZE+BASE_X, BASE_Y, (x-xPos+grid.x)*TILE_SIZE+BASE_X, grid.height*TILE_SIZE+BASE_Y);
	}
	for(var y = 0; y <= grid.height; y++){
		line(BASE_X, (y-yPos+grid.y)*TILE_SIZE+BASE_Y, grid.width*TILE_SIZE+BASE_X, (y-yPos+grid.y)*TILE_SIZE+BASE_Y);
	}

	if(!coverOuter){
		//draw view border for conceptual purposes
		stroke(0);
		strokeWeight(4);
		noFill();
		rect(BASE_X-2, BASE_Y-2, grid.width*TILE_SIZE+4, grid.height*TILE_SIZE+4);

		//draw move border for conceptual purposes
		stroke(10, 10, 10, 100);
		strokeWeight(4);
		noFill();
		rect(BASE_X+VIEW_BORDER*TILE_SIZE, BASE_Y+VIEW_BORDER*TILE_SIZE, (grid.width-VIEW_BORDER*2)*TILE_SIZE, (grid.height-VIEW_BORDER*2)*TILE_SIZE);
	}
}

//--------------------KEY INPUT---------------------

function keyPressed() {
	if (keyCode === UP_ARROW && validIndex(cursor.x+grid.x, cursor.y+grid.y-1)){
		if(cursor.y === VIEW_BORDER){
			grid.moveDown();
		} else {
			cursor.moveUp();
		}
	} else if (keyCode === DOWN_ARROW && validIndex(cursor.x+grid.x, cursor.y+grid.y+1)){
		if(cursor.y === grid.height-1-VIEW_BORDER){
			grid.moveUp();
		} else {
			cursor.moveDown();
		}
	} else if (keyCode === LEFT_ARROW && validIndex(cursor.x+grid.x-1, cursor.y+grid.y)){
		if(cursor.x === VIEW_BORDER){
			grid.moveRight()
		} else {
			cursor.moveLeft();
		}
	} else if (keyCode === RIGHT_ARROW && validIndex(cursor.x+grid.x+1, cursor.y+grid.y)){
		if(cursor.x === grid.width-1-VIEW_BORDER){
			grid.moveLeft()
		} else {
			cursor.moveRight();
		}
	} else if (key === 'p') {
		pause = !pause;
	} else if (key === 'c') {
		coverOuter = !coverOuter;
	}
}

//--------------------MOUSE INPUT---------------------

function canvasCoordsToWindowIndex(x, y){
	if(x >= BASE_X && x < BASE_X+grid.width*TILE_SIZE && y >= BASE_Y && y < BASE_Y+grid.width*TILE_SIZE){
		x = int((x-BASE_X)/TILE_SIZE);
		y = int((y-BASE_Y)/TILE_SIZE);
		return {x: x, y: y};
	}
	return undefined;
}

//Only return defined results for map items within window
function canvasCoordsToMapIndex(x, y){
	var index = canvasCoordsToWindowIndex(x, y);
	if(typeof index === "undefined"){return undefined;}
	index.x += grid.x;
	index.y += grid.y;
	return index;
}

function mouseClicked(){
	var index = canvasCoordsToMapIndex(mouseX, mouseY);
	console.log(index)
	goTo(index.x, index.y);
}