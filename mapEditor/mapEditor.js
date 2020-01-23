//Find another name for cursor if you're going to use the p5 cursor function to make a fuckin sweet flame sword cursor hell yeah dude
var cursor, grid, data;
var pause = false; //for halting printouts

var TILE_SIZE = 30;
var TILE_BAR_SIZE = 50;
var BASE_X = 0;
var BASE_Y = 120;
var MOVE_TIME = 4;
var VIEW_BORDER = 0;

function setup() {
	var canvas = createCanvas(900, 720);
	canvas.parent("canvas");

	data = Array(20).fill().map(() => Array(20).fill(0));
	tileData = Array(2).fill().map(() => Array(15).fill(0));
	var zz = {x: 0, y: 0};

	grid = new Grid(zz, 30, 20, MOVE_TIME, drawGrid);
	tileBar = new Grid(zz, 15, 2, MOVE_TIME, drawTileBar);
	cursor = new Cursor(zz, MOVE_TIME, drawCursor);
}

function draw() {
	if(!pause){
		background(155);
		grid.draw();
		tileBar.draw();
		cursor.draw();
	}
}

//--------------MAP FUNCTIONS-------------

function validIndex(x, y){
	console.log(x + ',' + y);
	if(x >= 0 && x < grid.width && y >= 0 && y < grid.height){
		console.log("wtf")
		return true;
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
	for(var x = 0; x <= grid.width; x++){
		line((x-xPos+grid.x)*TILE_SIZE+BASE_X, BASE_Y, (x-xPos+grid.x)*TILE_SIZE+BASE_X, grid.height*TILE_SIZE+BASE_Y);
	}
	for(var y = 0; y <= grid.height; y++){
		line(BASE_X, (y-yPos+grid.y)*TILE_SIZE+BASE_Y, grid.width*TILE_SIZE+BASE_X, (y-yPos+grid.y)*TILE_SIZE+BASE_Y);
	}

}

function drawTileBar(xPos, yPos){
	//draw tileBar tiles
	for(var i = 0; i < tileData[0].length; i++){
		for(var j = 0; j < tileData.length; j++){
			tileData[j][i] ? fill(80, 133, 217) : fill(232, 67, 95);
			rect((i-xPos)*TILE_BAR_SIZE, (j-yPos)*TILE_BAR_SIZE, TILE_BAR_SIZE, TILE_BAR_SIZE);
		}
	}
	
	//draw tileBar lines
	stroke(200);
	strokeWeight(1);
	for(var x = 0; x <= tileBar.width; x++){
		line((x-xPos+tileBar.x)*TILE_BAR_SIZE, 0, (x-xPos+tileBar.x)*TILE_BAR_SIZE, tileBar.height*TILE_BAR_SIZE);
	}
	for(var y = 0; y <= tileBar.height; y++){
		line(0, (y-yPos+tileBar.y)*TILE_BAR_SIZE, tileBar.width*TILE_BAR_SIZE, (y-yPos+tileBar.y)*TILE_BAR_SIZE);
	}

}

//--------------------MOVEMENT---------------------

function moveUp(){
	if(cursor.y === VIEW_BORDER){
		grid.moveDown();
	} else {
		cursor.moveUp();
	}
}

function moveDown(){
	if(cursor.y === grid.height-1-VIEW_BORDER){
		grid.moveUp();
	} else {
		cursor.moveDown();
	}
}

function moveLeft(){
	if(cursor.x === VIEW_BORDER){
		grid.moveRight()
	} else {
		cursor.moveLeft();
	}
}

function moveRight(){
	if(cursor.x === grid.width-1-VIEW_BORDER){
		grid.moveLeft()
	} else {
		cursor.moveRight();
	}
}


//--------------------KEY INPUT---------------------

function keyPressed() {
	if (keyCode === UP_ARROW && validIndex(cursor.x+grid.x, cursor.y+grid.y-1)){
		moveUp();
	} else if (keyCode === DOWN_ARROW && validIndex(cursor.x+grid.x, cursor.y+grid.y+1)){
		moveDown();
	} else if (keyCode === LEFT_ARROW && validIndex(cursor.x+grid.x-1, cursor.y+grid.y)){
		moveLeft();
	} else if (keyCode === RIGHT_ARROW && validIndex(cursor.x+grid.x+1, cursor.y+grid.y)){
		moveRight();
	} else if (key === 'p') {
		pause = !pause;
	} else if (key === 't') {
		keyTimersTick();
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
	cursor.goTo(index.x, index.y);
}