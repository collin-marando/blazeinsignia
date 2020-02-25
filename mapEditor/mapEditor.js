var cursor, map, mapData, bar, barData;
var pause = false; //for halting printouts

var BAR_TILE_SIZE = 50;
var BAR_BASE_X = 0;
var BAR_BASE_Y = 0;

var MAP_TILE_SIZE = 30;
var MAP_BASE_X = 0;
var MAP_BASE_Y = 70;

var MOVE_TIME = 4;
var VIEW_BORDER = 0;

function setup() {
	var canvas = createCanvas(900, 670);
	canvas.parent("canvas");

	mapData = [[]];
	barData = createBarAssets();
	var zz = {x: 0, y: 0};

	map = new Grid(zz, 30, 20, MOVE_TIME, drawGrid);
	bar = new Grid(zz, 18, 1, MOVE_TIME, drawTileBar);
	cursor = new Cursor(zz, MOVE_TIME, drawCursor);
}

function draw() {
	if(!pause){
		background(155);
		bar.draw();
		map.draw();
		cursor.draw();
	}
}

//--------------BAR FUNCTIONS-------------

function createBarAssets(){
	var data = [];
	for(var key in tileTypes){
		data.push(tileTypes[key]);
	}
	return data;
}

//--------------MAP FUNCTIONS-------------

function validIndex(x, y){
	return x >= 0 && x < map.width && y >= 0 && y < map.height;
}

//---------------DRAW FUNCTIONS---------------

function drawCursor(xPos, yPos){
	fill(0, 255, 0, 128);
	noStroke();
	rect(xPos*MAP_TILE_SIZE+MAP_BASE_X, yPos*MAP_TILE_SIZE+MAP_BASE_Y, MAP_TILE_SIZE, MAP_TILE_SIZE, MAP_TILE_SIZE/4);
}

function drawGrid(xPos, yPos){
	//draw map tiles
	for(var i = 0; i < mapData[0].length; i++){
		for(var j = 0; j < mapData.length; j++){
			mapData[j][i] ? fill(80, 133, 217) : fill(232, 67, 95);
			rect((i-xPos)*MAP_TILE_SIZE+MAP_BASE_X, (j-yPos)*MAP_TILE_SIZE+MAP_BASE_Y, MAP_TILE_SIZE, MAP_TILE_SIZE);
		}
	}
	
	//draw map lines
	stroke(200);
	strokeWeight(1);
	for(var x = 0; x <= map.width; x++){
		line((x-xPos+map.x)*MAP_TILE_SIZE+MAP_BASE_X, MAP_BASE_Y, (x-xPos+map.x)*MAP_TILE_SIZE+MAP_BASE_X, map.height*MAP_TILE_SIZE+MAP_BASE_Y);
	}
	for(var y = 0; y <= map.height; y++){
		line(MAP_BASE_X, (y-yPos+map.y)*MAP_TILE_SIZE+MAP_BASE_Y, map.width*MAP_TILE_SIZE+MAP_BASE_X, (y-yPos+map.y)*MAP_TILE_SIZE+MAP_BASE_Y);
	}

}

function drawTileBar(xPos, yPos){
	//draw bar tiles
	for(var i = 0; i < barData.length; i++){
		fill(barData[i].color);
		rect((i-xPos)*BAR_TILE_SIZE, 0, BAR_TILE_SIZE, BAR_TILE_SIZE);
	}
	
	//draw bar lines
	stroke(200);
	strokeWeight(1);
	for(var x = 0; x <= bar.width; x++){
		line((x-xPos+bar.x)*BAR_TILE_SIZE, 0, (x-xPos+bar.x)*BAR_TILE_SIZE, bar.height*BAR_TILE_SIZE);
	}
	for(var y = 0; y <= bar.height; y++){
		line(0, (y-yPos+bar.y)*BAR_TILE_SIZE, bar.width*BAR_TILE_SIZE, (y-yPos+bar.y)*BAR_TILE_SIZE);
	}

}

//--------------------MOVEMENT---------------------

function moveUp(){
	if(cursor.y === VIEW_BORDER){
		map.moveDown();
	} else {
		cursor.moveUp();
	}
}

function moveDown(){
	if(cursor.y === map.height-1-VIEW_BORDER){
		map.moveUp();
	} else {
		cursor.moveDown();
	}
}

function moveLeft(){
	if(cursor.x === VIEW_BORDER){
		map.moveRight()
	} else {
		cursor.moveLeft();
	}
}

function moveRight(){
	if(cursor.x === map.width-1-VIEW_BORDER){
		map.moveLeft()
	} else {
		cursor.moveRight();
	}
}


//--------------------KEY INPUT---------------------

function keyPressed() {
	if (keyCode === UP_ARROW && validIndex(cursor.x+map.x, cursor.y+map.y-1)){
		moveUp();
	} else if (keyCode === DOWN_ARROW && validIndex(cursor.x+map.x, cursor.y+map.y+1)){
		moveDown();
	} else if (keyCode === LEFT_ARROW && validIndex(cursor.x+map.x-1, cursor.y+map.y)){
		moveLeft();
	} else if (keyCode === RIGHT_ARROW && validIndex(cursor.x+map.x+1, cursor.y+map.y)){
		moveRight();
	} else if (key === 'p') {
		pause = !pause;
	} else if (key === 't') {
		keyTimersTick();
	}
}

//--------------------MOUSE INPUT---------------------

function canvasCoordsToIndex(x, y){
	if(x >= BAR_BASE_X && x < BAR_BASE_X+bar.width*BAR_TILE_SIZE && y >= BAR_BASE_Y && y < BAR_BASE_Y+bar.height*BAR_TILE_SIZE){
		x = int((x-BAR_BASE_X)/BAR_TILE_SIZE)+bar.x;
		y = int((y-BAR_BASE_Y)/BAR_TILE_SIZE)+bar.y;
		return {selection: "bar", x: x, y: y};

	} else if(x >= MAP_BASE_X && x < MAP_BASE_X+map.width*MAP_TILE_SIZE && y >= MAP_BASE_Y && y < MAP_BASE_Y+map.height*MAP_TILE_SIZE){
		x = int((x-MAP_BASE_X)/MAP_TILE_SIZE)+map.x;
		y = int((y-MAP_BASE_Y)/MAP_TILE_SIZE)+map.y;
		return {selection: "map", x: x, y: y};
	}
	return undefined;
}

function mouseClicked(){
	var index = canvasCoordsToIndex(mouseX, mouseY);
	console.log(index)
	if(index && index.selection == "map"){cursor.goTo(index.x, index.y)};
}