module.exports.name = "move";

module.exports.perform = function(actionParams, agentParams, environment) {
    agentParams.coordinates.x = actionParams.x;
    agentParams.coordinates.y = actionParams.y;
};