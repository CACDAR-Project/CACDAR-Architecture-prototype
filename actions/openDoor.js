module.exports.name = "openDoor";

module.exports.perform = function(command, agentParams, environment) {
    let x = command.content.x;
    let y = command.content.y;

    if (environment.grid[y][x] === 'C') {
        environment.grid[y][x] = 'O';
    }
};