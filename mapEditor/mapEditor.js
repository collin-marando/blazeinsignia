
//VARIABLES
var map, mapCursor, mapData
var bar, barCursor, barData;
var dragCursor;
var startPoint;

//FLAGS
var pause = false; //for halting printouts
var eraseMode = false;
var showBounds = true;

//CONSTANTS
var BAR_TILE_SIZE = 50;
var BAR_BASE_X = 0;
var BAR_BASE_Y = 40;

var MAP_TILE_SIZE = 30;
var MAP_BASE_X = 0;
var MAP_BASE_Y = 120;

var MOVE_TIME = 4;
var VIEW_BORDER = 0;

//LAYERS
var layers = [{type: "Tile", color: "rgb(97, 161, 90)"},
			  {type: "Bounds", color: "rgb(201, 100, 97)"},
			  {type: "Entity", color: "rgb(75, 117, 173)"}]
var currLayer = 0;

//HISTORY
var mapHistory = []; //Initialize with empty 2D array @ 0
var currHistory = 0;

function setup() {
	var canvas = createCanvas(900, 710);
	canvas.parent("canvas");

	mapData = [[]];
	mapHistory.push([[]]);
	barData = createBarAssets();

	map = new Grid({x: 0, y: 0}, 30, 20, MOVE_TIME, drawGrid);
	bar = new Grid({x: 0, y: 0}, 18, 1, MOVE_TIME, drawTileBar);

	mapCursor = new Cursor({x: 0, y: 0}, MOVE_TIME, drawMapCursor);
	barCursor = new Cursor({x: 0, y: 0}, MOVE_TIME, drawTileBarCursor);
	dragCursor = {x: 0, y: 0};

	textSize(18);
}

function draw() {
	if(!pause){
		background(155);
		noStroke();

		drawLayerBar();

		//draw back panel
		fill(64, 64, 64);
		rect(0, BAR_BASE_Y, width, MAP_BASE_Y-BAR_BASE_Y);
		
		//draw tile bar and descriptor text
		if(layers[currLayer].type === "Tile"){
			bar.draw();
			barCursor.draw();

			fill(255);
			noStroke();
			textAlign(LEFT, CENTER);
			var obj = barData[barCursor.x];
			text(obj.name + ": cost - " + obj.cost + ", type - " + obj.type , 10, 105);
		}

		map.draw();
		mapCursor.draw();
	}
}

function toggleLayerMode() {
	currLayer = (currLayer+1)%layers.length;
}

//--------------TILE BAR FUNCTIONS-------------

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

function undo(){
	if(currHistory > 0){
		currHistory--;
		mapData = JSON.parse(JSON.stringify(mapHistory[currHistory]));
	}
}

function redo(){
	if(currHistory < mapHistory.length-1){
		currHistory++;
		mapData = JSON.parse(JSON.stringify(mapHistory[currHistory]));
	}
}

function archive(){
	currHistory++;
	mapHistory.length = currHistory; //Overwrite succeding history
	mapHistory.push(JSON.parse(JSON.stringify(mapData)));
}

function mapAction(x, y){
	if(!x && !y){
		x = mapCursor.x;
		y = mapCursor.y;
	}
	if(layers[currLayer].type === "Tile"){
		eraseMode ? removeTile(x, y) : placeTile(x, y);
	} else if(layers[currLayer].type === "Bounds"){
		eraseMode ? removeBarrier(x, y) : placeBarrier(x, y);
	}
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

function removeBarrier(x, y){
	if(!x && !y){
		x = mapCursor.x;
		y = mapCursor.y;
	}
	if(mapData[y] && mapData[y][x] && typeof mapData[y][x].isBarrier !== "undefined"){
		delete mapData[y][x].isBarrier;
	}
}

function placeBarrier(x, y){
	if(!x && !y){
		x = mapCursor.x;
		y = mapCursor.y;
	}
	if(mapData[y] && mapData[y][x]){
		mapData[y][x].isBarrier = true;
	}	
}

//---------------DRAW FUNCTIONS---------------

function drawMapCursor(xPos, yPos){
	eraseMode?stroke(255, 33, 33):stroke(100);
	strokeWeight(4);
	noFill();
	rect(min(mapCursor.x, dragCursor.x)*MAP_TILE_SIZE+MAP_BASE_X, 
		 min(mapCursor.y, dragCursor.y)*MAP_TILE_SIZE+MAP_BASE_Y, 
		 (abs(dragCursor.x-mapCursor.x)+1)*MAP_TILE_SIZE, 
		 (abs(dragCursor.y-mapCursor.y)+1)*MAP_TILE_SIZE);
}

function drawTileBarCursor(xPos, yPos){
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
			noStroke();
			rect((i-xPos)*MAP_TILE_SIZE+MAP_BASE_X, (j-yPos)*MAP_TILE_SIZE+MAP_BASE_Y, MAP_TILE_SIZE, MAP_TILE_SIZE);
			
			if(showBounds && mapData[j][i].isBarrier){
				stroke(100);
				strokeWeight(2);
				fill(255, 33, 33);
				var left = i*MAP_TILE_SIZE+MAP_BASE_X;
				var top = j*MAP_TILE_SIZE+MAP_BASE_Y;
				rect(left+MAP_TILE_SIZE*0.25, top+MAP_TILE_SIZE*0.25, MAP_TILE_SIZE*0.5, MAP_TILE_SIZE*0.5)
				line(left+MAP_TILE_SIZE*0.25, top+MAP_TILE_SIZE*0.25, left+MAP_TILE_SIZE*0.75,  top+MAP_TILE_SIZE*0.75);
				line(left+MAP_TILE_SIZE*0.25, top+MAP_TILE_SIZE*0.75, left+MAP_TILE_SIZE*0.75,  top+MAP_TILE_SIZE*0.25);
			}
		}
	}

	if(startPoint){
		fill(50, 168, 82);
		circle(startPoint.x*MAP_TILE_SIZE+MAP_BASE_X+MAP_TILE_SIZE*0.5, startPoint.y*MAP_TILE_SIZE+MAP_BASE_Y+MAP_TILE_SIZE*0.5, MAP_TILE_SIZE*0.8);
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
		rect((i-xPos)*BAR_TILE_SIZE+BAR_BASE_X, BAR_BASE_Y, BAR_TILE_SIZE, BAR_TILE_SIZE);
	}
	
	//draw bar lines
	stroke(100);
	strokeWeight(1);
	for(var x = 0; x <= bar.width; x++){
		line((x-xPos+bar.x)*BAR_TILE_SIZE+BAR_BASE_X, BAR_BASE_Y, (x-xPos+bar.x)*BAR_TILE_SIZE+BAR_BASE_X, bar.height*BAR_TILE_SIZE+BAR_BASE_Y);
	}
	for(var y = 0; y <= bar.height; y++){
		line(BAR_BASE_X, (y-yPos+bar.y)*BAR_TILE_SIZE+BAR_BASE_Y, bar.width*BAR_TILE_SIZE+BAR_BASE_X, (y-yPos+bar.y)*BAR_TILE_SIZE+BAR_BASE_Y);
	}

}

function drawLayerBar(xPos, yPos){
	fill(255);
	rect(0, 0, width, 30);

	textAlign(CENTER, CENTER);
	layers.forEach((layer, i) => {
		fill(layer.color);
		rect(i*150, 0, 150, 30);
		fill(255);
		text(layer.type+" Layer", 75+i*150, 15);
	});

	fill(layers[currLayer].color);
	rect(0, 30, width, 10);
}

//--------------------MAP CURSOR MOVEMENT---------------------

function moveUp(){
	if(mapCursor.y === VIEW_BORDER){
		map.moveDown();
	} else {
		mapCursor.moveUp();
		dragCursor = {x: mapCursor.x, y: mapCursor.y};
	}
}

function moveDown(){
	if(mapCursor.y === map.height-1-VIEW_BORDER){
		map.moveUp();
	} else {
		mapCursor.moveDown();
		dragCursor = {x: mapCursor.x, y: mapCursor.y};
	}
}

function moveLeft(){
	if(mapCursor.x === VIEW_BORDER){
		map.moveRight()
	} else {
		mapCursor.moveLeft();
		dragCursor = {x: mapCursor.x, y: mapCursor.y};
	}
}

function moveRight(){
	if(mapCursor.x === map.width-1-VIEW_BORDER){
		map.moveLeft()
	} else {
		mapCursor.moveRight();
		dragCursor = {x: mapCursor.x, y: mapCursor.y};
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
		mapAction();
	} else if (key === 'q') {
		if(barCursor.x-1 >= 0){
			barCursor.moveLeft();
		}
	} else if (key === 'e') {
		if(barCursor.x+1 < barData.length){
			barCursor.moveRight();
		}
	} else if (key === 'r') {
		eraseMode = !eraseMode;
	} else if (key === 't') {
		toggleLayerMode();
	} else if (key === 'b') {
		showBounds = !showBounds;
	} else if (key === 'z') {
		undo();
	} else if (key === 'y') {
		redo();
	} else if (key === 'c') {
		var index = canvasCoordsToIndex(mouseX, mouseY);
		console.log(index);
		if(index && index.selection === "map"){
			startPoint = {x: index.x, y: index.y};
		}
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

	} else if(x <= 450 && y <= 30) {
		x = int(x/150);
		return {selection: "layer", x: x, y: 0};
	}
	return undefined;
}

function mousePressed(){
	var index = canvasCoordsToIndex(mouseX, mouseY);
	console.log(index)
	if(index){
		if(index.selection === "bar" && index.x < barData.length){
			barCursor.goTo(index.x, index.y);
		} else if(index.selection === "map"){
			mapCursor.goTo(index.x, index.y);
			dragCursor = {x: index.x, y: index.y};
		} else if(index.selection === "layer"){
			currLayer = index.x;
		}
	}
}

function mouseDragged(){
	var index = canvasCoordsToIndex(mouseX, mouseY);
	if(index && index.selection === "map"){
		dragCursor = {x: index.x, y: index.y};
	}
}

function mouseReleased(){
	var index = canvasCoordsToIndex(mouseX, mouseY);
	if(index && index.selection === "map"){
		for(let i = min(mapCursor.x, dragCursor.x); i <= max(mapCursor.x, dragCursor.x); i++){
			for(let j = min(mapCursor.y, dragCursor.y); j <= max(mapCursor.y, dragCursor.y); j++){
				mapAction(i, j);
			}
		}
		mapCursor.x = dragCursor.x;
		mapCursor.y = dragCursor.y;
		
		//if map has changed, add change to history
		if(JSON.stringify(mapData) !== JSON.stringify(mapHistory[currHistory])){
			archive();
		}
	}
}

//------------------FILE I/O----------------------

function readSourceFile(evt) {
	var file = evt.target.files[0];
	if (file) {
		filename = file.name;
		var r = new FileReader();
		r.onload = function(e) {
			mapData = JSON.parse(e.target.result);
		}
		r.readAsText(file);
	} else { 
		alert("Failed to load file");
	}
}

function writeOutputFile() {
	console.log("test");
	filename = "BI_map.JSON";
	data = JSON.stringify({cursorStart: startPoint, mapData: mapData});
	var file = new Blob([data], {type: "text"});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
}

document.getElementById("fileInput").addEventListener("change", readSourceFile, false);
document.getElementById("saveButton").addEventListener("click", writeOutputFile, false);