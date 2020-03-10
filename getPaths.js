/* getPaths function: recursive pathfinding algorithm
 * data: input array to be modified
 * x, y: current index
 * range: remaining movement range 
 * parent: parent index
 * getCost: function to obtain cost of a tile - (x, y) => (cost)
 *          returns either a number, infinity, or undefined
 */
function getPaths(data, x, y, range, parent, getCost){
    if(range >= 0){
        //if cell is unvisited or if new path is better
        if(!data[y][x] || "range" in data[y][x] && range > data[y][x].range){
            data[y][x] = {range: range, parent: parent};

            var up = getCost(x, y-1);
            var down = getCost(x, y+1);
            var left = getCost(x-1, y);
            var right = getCost(x+1, y);

            if(up !== undefined){
                getPaths(data, x, y-1, range-up, "down", getCost);
            }
            if(down !== undefined){
                getPaths(data, x, y+1, range-down, "up", getCost);
            }
            if(left !== undefined){
                getPaths(data, x-1, y, range-left, "right", getCost);
            }
            if(right !== undefined){
                getPaths(data, x+1, y, range-right, "left", getCost);
            }
        }
    }
}