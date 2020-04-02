module.exports.name = "move";

module.exports.perform = function(command, agentParams, environment) {
    agentParams.coordinates.x = command.parameters.x;
    agentParams.coordinates.y = command.parameters.y;
};