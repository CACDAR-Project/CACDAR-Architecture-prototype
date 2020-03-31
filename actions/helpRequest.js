module.exports.name = "trashHelpRequest";

// Pushes a request to a "global" message list visible to all agents in the environment
module.exports.perform = function(actionParams, agentParams, environment) {
    environment.messages.push({type: "trashHelpRequest", requestCoordinates: agentParams.coordinates});
};