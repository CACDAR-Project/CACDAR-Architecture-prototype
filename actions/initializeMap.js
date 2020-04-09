module.exports.name = "initializeMap";

module.exports.perform = function(command, agentParams, environment) {
    initializeVisitList(command.content.grid, agentParams);
    agentParams.hasMap = true;
};

let initializeVisitList = function(grid, agentParams){
    for (let y = 0; y < grid.length; ++y) {
        for (let x = 0; x < grid[y].length; ++x) {
            if (grid[y][x] !== '#') {
                agentParams.visitList.push({x: x, y: y, symbol: grid[y][x], visited: -1});
            }
        }
    }
};
