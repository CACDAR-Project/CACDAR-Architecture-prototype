module.exports.name = "move";

module.exports.perform = function(command, agentParams, environment) {
    let x = command.content.x;
    let y = command.content.y;

    if (environment.grid[y][x]==='C') {
        agentParams.interruptPath = true;
        agentParams.messages.push({name: "openDoor", content: {x: x, y: y}});
    } else {
        agentParams.coordinates.x = x;
        agentParams.coordinates.y = y;
    }
};
