module.exports.name = "collectGarbage";

module.exports.perform = function(actionParams, agentParams, environment) {
    let x = agentParams.coordinates.x;
    let y = agentParams.coordinates.y;
    environment.grid[y][x] = '.';
    agentParams.garbageHeld += 1;
};