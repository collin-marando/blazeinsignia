var mapCursor, map, mapData, barCursor, bar, barData;
var pause = false; //for halting printouts

var eraseMode = false;

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

	map = new Grid({x: 0, y: 0}, 30, 20, MOVE_TIME, drawGrid);
	bar = new Grid({x: 0, y: 0}, 18, 1, MOVE_TIME, drawTileBar);

	mapCursor = new Cursor({x: 0, y: 0}, MOVE_TIME, drawMapCursor);
	barCursor = new Cursor({x: 0, y: 0}, MOVE_TIME, drawBarCursor);
}

function draw() {
	if(!pause){
		background(155);
		bar.draw();
		map.draw();
		barCursor.draw();
		mapCursor.draw();
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

function removeTile(x, y){
	if(!x && !y){
		x = mapCursor.x;
		y = mapCursor.y;
	}
	if(mapData[y]){
		delete mapData[y][x];
	}
}

function placeTile(x, y){
	if(!x && !y){
		x = mapCursor.x;
		y = mapCursor.y;
	}
	if(!mapData[y]){
		mapData[y] = [];
	}
	mapData[y][x] = JSON.parse(JSON.stringify(barData[barCursor.x]));
}

//---------------DRAW FUNCTIONS---------------

function drawMapCursor(xPos, yPos){
	stroke(100);
	strokeWeight(2);
	var left = xPos*MAP_TILE_SIZE+MAP_BASE_X;
	var top = yPos*MAP_TILE_SIZE+MAP_BASE_Y; 
	if(eraseMode){
		line(left+MAP_TILE_SIZE*0.25, top+MAP_TILE_SIZE*0.25, left+MAP_TILE_SIZE*0.75,  top+MAP_TILE_SIZE*0.75);
		line(left+MAP_TILE_SIZE*0.25, top+MAP_TILE_SIZE*0.75, left+MAP_TILE_SIZE*0.75,  top+MAP_TILE_SIZE*0.25);
	} else {
		line(left+MAP_TILE_SIZE*0.5, top+MAP_TILE_SIZE*0.25, left+MAP_TILE_SIZE*0.5, top+MAP_TILE_SIZE*0.75);
		line(left+MAP_TILE_SIZE*0.25, top+MAP_TILE_SIZE*0.5, left+MAP_TILE_SIZE*0.75, top+MAP_TILE_SIZE*0.5);
	}
}

function drawBarCursor(xPos, yPos){
	stroke(100);
	strokeWeight(2);
	var left = xPos*BAR_TILE_SIZE+BAR_BASE_X;
	var top = yPos*BAR_TILE_SIZE+BAR_BASE_Y; 
	line(left, top, left+BAR_TILE_SIZE, top+BAR_TILE_SIZE);
}

function drawGrid(xPos, yPos){
	//draw map tiles
	for(var j = 0; j < mapData.length; j++){
		if(!mapData[j]){continue;}
		for(var i = 0; i < mapData[j].length; i++){
			if(!mapData[j][i]){continue;}
			fill(mapData[j][i].color);
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
	stroke(100);
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
	if(mapCursor.y === VIEW_BORDER){
		map.moveDown();
	} else {
		mapCursor.moveUp();
	}
}

function moveDown(){
	if(mapCursor.y === map.height-1-VIEW_BORDER){
		map.moveUp();
	} else {
		mapCursor.moveDown();
	}
}

function moveLeft(){
	if(mapCursor.x === VIEW_BORDER){
		map.moveRight()
	} else {
		mapCursor.moveLeft();
	}
}

function moveRight(){
	if(mapCursor.x === map.width-1-VIEW_BORDER){
		map.moveLeft()
	} else {
		mapCursor.moveRight();
	}
}

//--------------------KEY INPUT---------------------

function keyPressed() {
	if ((keyCode === UP_ARROW || key === 'w') && validIndex(mapCursor.x+map.x, mapCursor.y+map.y-1)){
		moveUp();
		if(keyIsDown(32)){eraseMode ? removeTile() : placeTile();}
	} else if ((keyCode === DOWN_ARROW || key === 's') && validIndex(mapCursor.x+map.x, mapCursor.y+map.y+1)){
		moveDown();
		if(keyIsDown(32)){eraseMode ? removeTile() : placeTile();}
	} else if ((keyCode === LEFT_ARROW || key === 'a') && validIndex(mapCursor.x+map.x-1, mapCursor.y+map.y)){
		moveLeft();
		if(keyIsDown(32)){eraseMode ? removeTile() : placeTile();}
	} else if ((keyCode === RIGHT_ARROW || key === 'd') && validIndex(mapCursor.x+map.x+1, mapCursor.y+map.y)){
		moveRight();
		if(keyIsDown(32)){eraseMode ? removeTile() : placeTile();}
	} else if (key === 'p') {
		pause = !pause;
	} else if (key === ' ') {
		eraseMode ? removeTile() : placeTile();
	} else if (key === 'q') {
		barCursor.moveLeft();
	} else if (key === 'e') {
		barCursor.moveRight();
	} else if (key === 'r') {
		eraseMode = !eraseMode;
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
	if(index && index.selection == "bar" && index.x < barData.length){
		barCursor.goTo(index.x, index.y);
	} else if(index && index.selection == "map"){
		mapCursor.goTo(index.x, index.y);
		eraseMode ? removeTile() : placeTile();
	}
}