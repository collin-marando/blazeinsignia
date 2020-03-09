/* getPaths function: recursive pathfinding algorithm
 * data: input array to be modified
 * x, y: current index
 * range: remaining movement range 
 * getCost: function to obtain cost of a tile - (x, y) => (cost)
 *          returns either a number, infinity, or undefined
 * parent: parent index
 */
function getPaths(data, x, y, range, parent, getCost){
    if(!data[y]){
        data[y] = [];
    }
    if(range >= 0){
        //if cell is unvisited or if new path is better
        if(!data[y][x] || "range" in data[y][x] && range > data[y][x].range){
            data[y][x] = {range: range, parent: parent};

            var up = getCost(x, y-1);
            var down = getCost(x, y+1);
            var left = getCost(x-1, y);
            var right = getCost(x+1, y);

            if(up !== undefined){
                getPaths(data, x, y-1, range-up, {x:x, y:y}, getCost);
            }
            if(down !== undefined){
                getPaths(data, x, y+1, range-down, {x:x, y:y}, getCost);
            }
            if(left !== undefined){
                getPaths(data, x-1, y, range-left, {x:x, y:y}, getCost);
            }
            if(right !== undefined){
                getPaths(data, x+1, y, range-right, {x:x, y:y}, getCost);
            }
        }
    }
}

function testGetCost(data, x, y){
    if(x >= 0 && y >= 0 && y < data.length && typeof data[y] !== "undefined" && x < data[y].length){
        return 1;
    }
}