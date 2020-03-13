var cursor, grid;
var pause = false; //for halting printouts

var MAP_TILE_SIZE = 50;
var MAP_BASE_X = 100;
var MAP_BASE_Y = 75;
var MOVE_TIME = 4;
var HOLD_TIME = 12;
var VIEW_BORDER = 2;

function setup() {
	var canvas = createCanvas(700, 500);
	canvas.parent("canvas");

	currMap = JSON.parse(JSON.stringify(pathTestMap));

	mapData = currMap.mapData;

	var gridStart = currMap.gridStartPoint;
	var cursorStart = {x: currMap.startPoint.x-gridStart.x, y: currMap.startPoint.y-gridStart.y};

	//Once a viewport size has been decided, add code to map editor for gridStart
	grid = new Grid(gridStart, 10, 7, MOVE_TIME, drawGrid);
	cursor = new Cursor(cursorStart, MOVE_TIME, drawCursor);
}

function draw() {
	if(!pause){
		background(155);
		grid.draw();
		cursor.draw();

		fill(50);
		noStroke();
		rect(0, 0, width, MAP_BASE_Y);
		rect(0, 0, MAP_BASE_X, height);
		rect(MAP_BASE_X+grid.width*MAP_TILE_SIZE, 0, width, height);
		rect(0, MAP_BASE_Y+grid.height*MAP_TILE_SIZE, width, height);
		
		fill(255);
		textSize(32);
		textAlign(LEFT, CENTER);
		text("cursor map location: " + (cursor.x + grid.x) + ", " + (cursor.y + grid.y), 10, 40);
		textAlign(RIGHT, CENTER);
		text("path range: "+pathDist, width-10, 40);

		checkHeldKeys();
	}
}

//--------------MAP FUNCTIONS-------------

function validIndex(x, y){
	if(mapData[y] && mapData[y][x]){
		return typeof mapData[y][x].isBarrier === "undefined";
	}
	return false;
}

//This function depends on where we want the cursor to land in the window
var X_ANCHOR = 1;
var Y_ANCHOR = 1;
function goTo(x,y){
	if(validIndex(x,y)){
		grid.goTo(x-X_ANCHOR,y-Y_ANCHOR);
		cursor.goTo(X_ANCHOR, Y_ANCHOR);
	}
}

//-------------PATH FUNCTIONS------------

function generateBlankPathData(){
	for(var j = 0; j < mapData.length; j++){
		pathData[j] = new Array(mapData[j].length);
	}
}

function getCost(x, y){
	if(x >= 0 && y >= 0 && y < mapData.length && mapData[y] && x < mapData[y].length && mapData[y][x]){
        if(!("isBarrier" in mapData[y][x])){
        	return mapData[y][x].cost;
        }
    }
}

function printCost(){
	for(var j = 0; j < mapData.length; j++){
		var s = "";
		for(var i = 0; i < mapData.length; i++){
			if(mapData[j][i] && "cost" in mapData[j][i]){
				s += mapData[j][i].cost + ", ";
			} else {
				s += "-, ";
			}
		}
		console.log(s);
	}
	console.log("\n");
}

function printPathData(){
	for(var j = 0; j < pathData.length; j++){
		var s = "";
		for(var i = 0; i < pathData.length; i++){
			if(pathData[j][i] && "range" in pathData[j][i]){
				s += pathData[j][i].range + ", ";
			} else {
				s += "-, ";
			}
		}
		console.log(s);
	}
	console.log("\n");
}

//---------------MOVE FUNCTIONS---------------

function moveUp(){
	if(validIndex(cursor.x+grid.x, cursor.y+grid.y-1)){
		if(cursor.y === VIEW_BORDER){
			grid.moveDown();
		} else {
			cursor.moveUp();
		}
	}
}

function moveDown(){
	if(validIndex(cursor.x+grid.x, cursor.y+grid.y+1)){
		if(cursor.y === grid.height-1-VIEW_BORDER){
			grid.moveUp();
		} else {
			cursor.moveDown();
		}
	}
}

function moveLeft(){
	if(validIndex(cursor.x+grid.x-1, cursor.y+grid.y)){
		if(cursor.x === VIEW_BORDER){
			grid.moveRight()
		} else {
			cursor.moveLeft();
		}
	}
}

function moveRight(){
	if(validIndex(cursor.x+grid.x+1, cursor.y+grid.y)){
		if(cursor.x === grid.width-1-VIEW_BORDER){
			grid.moveLeft()
		} else {
			cursor.moveRight();
		}
	}
}


//---------------DRAW FUNCTIONS---------------

function drawCursor(xPos, yPos){
	noFill()
	stroke(100);
	strokeWeight(2);
	var left = xPos*MAP_TILE_SIZE+MAP_BASE_X;
	var top = yPos*MAP_TILE_SIZE+MAP_BASE_Y;
	line(left+MAP_TILE_SIZE*0.25, top+MAP_TILE_SIZE*0.5, left+MAP_TILE_SIZE*0.75, top+MAP_TILE_SIZE*0.5);
	line(left+MAP_TILE_SIZE*0.5, top+MAP_TILE_SIZE*0.25, left+MAP_TILE_SIZE*0.5, top+MAP_TILE_SIZE*0.75);
}

function drawGrid(xPos, yPos){
	//draw map tiles
	for(var j = 0; j < mapData.length; j++){
		if(!mapData[j]){continue;}
		for(var i = 0; i < mapData[j].length; i++){
			if(!mapData[j][i]){continue;}
			fill(mapData[j][i].color);
			stroke(255);
			strokeWeight(1);
			rect((i-xPos)*MAP_TILE_SIZE+MAP_BASE_X, (j-yPos)*MAP_TILE_SIZE+MAP_BASE_Y, MAP_TILE_SIZE, MAP_TILE_SIZE);
		}
	}

	//draw map tile borders
	for(var j = 0; j < mapData.length; j++){
		if(!mapData[j]){continue;}
		for(var i = 0; i < mapData[j].length; i++){
			if(!mapData[j][i] || typeof mapData[j][i].isBarrier !== "undefined"){continue;}
			noFill();
			stroke(100);
			strokeWeight(3);
			rect((i-xPos)*MAP_TILE_SIZE+MAP_BASE_X, (j-yPos)*MAP_TILE_SIZE+MAP_BASE_Y, MAP_TILE_SIZE, MAP_TILE_SIZE);
		}
	}

	if(pathData){
		drawPaths(xPos, yPos);
	}
}

var arrows = {up:"↑", down: "↓", left: "←", right: "→", none: "x"};
function drawPaths(xPos, yPos){
	fill(100);
	noStroke();
	textAlign(CENTER, CENTER);
	//for each element in pathData draw arrow corresponding to parent at relevant location
	for(var j = 0; j < pathData.length; j++){
		if(!pathData[j]){continue;}
		for(var i = 0; i < pathData[j].length; i++){
			if(!pathData[j][i]){continue;}
			text(arrows[pathData[j][i].parent],(i-xPos)*MAP_TILE_SIZE+MAP_BASE_X+MAP_TILE_SIZE*0.5, (j-yPos)*MAP_TILE_SIZE+MAP_BASE_Y+MAP_TILE_SIZE*0.5);
		}
	}
}

//--------------------KEY INPUT---------------------

var holdTimer = HOLD_TIME;
var heldKey = {x: "none", y: "none"};
var pathDist = 12;
var pathData = [];
function keyPressed() {
	if (keyCode === UP_ARROW || key === "w"){
		holdTimer = HOLD_TIME;
		heldKey.y = "up";
		moveUp();
	} else if (keyCode === DOWN_ARROW || key === "s"){
		holdTimer = HOLD_TIME;
		heldKey.y = "down";
		moveDown();
	} else if (keyCode === LEFT_ARROW || key === "a"){
		holdTimer = HOLD_TIME;
		heldKey.x = "left";
		moveLeft();
	} else if (keyCode === RIGHT_ARROW || key === "d"){
		holdTimer = HOLD_TIME;
		heldKey.x = "right";
		moveRight();
	} else if (key === 'p') {
		pause = !pause;
	} else if (key === 'c') {
		coverOuter = !coverOuter;
	} else if (key === 'm') {
		generateBlankPathData();
		getPaths(pathData, cursor.x+grid.x, cursor.y+grid.y, pathDist, "none", getCost);
		printPathData();
	} else if (key === '-'){
		if(pathDist > 0){pathDist--;}
	} else if (key === '+' || key === "="){
		pathDist++;
	}
}

function keyReleased(){
	//TO DO: if opposite direction takes over, timer should be reset first
	if (keyCode === UP_ARROW || key === "w"){
		heldKey.y = keyIsDown(DOWN_ARROW)||keyIsDown(115)? "down": "none";

	} else if (keyCode === DOWN_ARROW || key === "s"){
		heldKey.y = keyIsDown(UP_ARROW)||keyIsDown(119)? "up": "none";

	} else if (keyCode === LEFT_ARROW || key === "a"){
		heldKey.x = keyIsDown(RIGHT_ARROW)||keyIsDown(100)? "right": "none";

	} else if (keyCode === RIGHT_ARROW || key === "d"){
		heldKey.x = keyIsDown(LEFT_ARROW)||keyIsDown(97)? "left": "none";
	}
}

function checkHeldKeys(){
	holdTimer = holdTimer > 0 ? holdTimer-1 : 0; //dec timer if positive
	if (cursor.timer == 0 && grid.timer == 0){
		if (holdTimer == 0){
			if (heldKey.y == "up"){
				moveUp();
			} else if (heldKey.y == "down"){
				moveDown();
			}
			
			if (heldKey.x == "left"){
				moveLeft();
			} else if (heldKey.x == "right"){
				moveRight();
			}
		}
	}
}



//--------------------MOUSE INPUT---------------------

function canvasCoordsToWindowIndex(x, y){
	if(x >= MAP_BASE_X && x < MAP_BASE_X+grid.width*MAP_TILE_SIZE && y >= MAP_BASE_Y && y < MAP_BASE_Y+grid.height*MAP_TILE_SIZE){
		x = int((x-MAP_BASE_X)/MAP_TILE_SIZE);
		y = int((y-MAP_BASE_Y)/MAP_TILE_SIZE);
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
	if(index){goTo(index.x, index.y)};
}