var cursor, grid;
var pause = false; //for halting printouts
var coverOuter = true;

var MAP_TILE_SIZE = 50;
var MAP_BASE_X = 100;
var MAP_BASE_Y = 75;
var MOVE_TIME = 4;
var HOLD_TIME = 12;
var VIEW_BORDER = 2;

function setup() {
	var canvas = createCanvas(700, 500);
	canvas.parent("canvas");

	mapData = cosmeticMap.mapData;

	var gridStart = {x: 1, y: 10};
	var cursorStart = {x: cosmeticMap.startPoint.x-gridStart.x, y: cosmeticMap.startPoint.y-gridStart.y};

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
		if(coverOuter){
			noStroke();
			rect(0, 0, width, MAP_BASE_Y);
			rect(0, 0, MAP_BASE_X, height);
			rect(MAP_BASE_X+grid.width*MAP_TILE_SIZE, 0, width, height);
			rect(0, MAP_BASE_Y+grid.height*MAP_TILE_SIZE, width, height);
			fill(255);
		}

		textSize(32);
		text("cursor map location: " + (cursor.x + grid.x) + ", " + (cursor.y + grid.y), 10, 40);

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
//It may be useful to generate padding tiles instead of require them to be hard coded
//This way, there can be sufficient padding for the cursor to be anchored anywhere
var X_ANCHOR = 1;
var Y_ANCHOR = 1;
function goTo(x,y){
	if(validIndex(x,y)){
		grid.goTo(x-X_ANCHOR,y-Y_ANCHOR);
		cursor.goTo(X_ANCHOR, Y_ANCHOR);
	}
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
			stroke(100);
			strokeWeight(1);
			rect((i-xPos)*MAP_TILE_SIZE+MAP_BASE_X, (j-yPos)*MAP_TILE_SIZE+MAP_BASE_Y, MAP_TILE_SIZE, MAP_TILE_SIZE);
		}
	}

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

	//draw view and move borders for conceptual purposes
	if(!coverOuter){
		stroke(0);
		strokeWeight(4);
		noFill();
		rect(MAP_BASE_X-2, MAP_BASE_Y-2, grid.width*MAP_TILE_SIZE+4, grid.height*MAP_TILE_SIZE+4);

		stroke(10, 10, 10, 100);
		strokeWeight(4);
		noFill();
		rect(MAP_BASE_X+VIEW_BORDER*MAP_TILE_SIZE, MAP_BASE_Y+VIEW_BORDER*MAP_TILE_SIZE, (grid.width-VIEW_BORDER*2)*MAP_TILE_SIZE, (grid.height-VIEW_BORDER*2)*MAP_TILE_SIZE);
	}
}

//--------------------KEY INPUT---------------------

var holdTimer = HOLD_TIME;
var heldKey = {x: "none", y: "none"};
function keyPressed() {
	if (keyCode === UP_ARROW){
		holdTimer = HOLD_TIME;
		heldKey.y = "up";
		moveUp();
	} else if (keyCode === DOWN_ARROW){
		holdTimer = HOLD_TIME;
		heldKey.y = "down";
		moveDown();
	} else if (keyCode === LEFT_ARROW){
		holdTimer = HOLD_TIME;
		heldKey.x = "left";
		moveLeft();
	} else if (keyCode === RIGHT_ARROW){
		holdTimer = HOLD_TIME;
		heldKey.x = "right";
		moveRight();
	} else if (key === 'p') {
		pause = !pause;
	} else if (key === 'c') {
		coverOuter = !coverOuter;
	}
}

function keyReleased(){
	//TO DO: if opposite direction takes over, timer should be reset first
	if (keyCode === UP_ARROW){
		heldKey.y = keyIsDown(DOWN_ARROW)? "down": "none";

	} else if (keyCode === DOWN_ARROW){
		heldKey.y = keyIsDown(UP_ARROW)? "up": "none";

	} else if (keyCode === LEFT_ARROW){
		heldKey.x = keyIsDown(RIGHT_ARROW)? "right": "none";

	} else if (keyCode === RIGHT_ARROW){
		heldKey.x = keyIsDown(LEFT_ARROW)? "left": "none";
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