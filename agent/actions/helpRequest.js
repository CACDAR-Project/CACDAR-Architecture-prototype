let Utils = require(process.cwd() + "/tools/utils.js");

module.exports.name = "helpRequest";

module.exports.perform = function(command, agentParams, environment) {
    let targetAgent = Utils.closestAgentWithAction(command, agentParams, environment);
    if (targetAgent) {
        targetAgent.parameters.messages.push({name: "helpRequest", content:
            {id: agentParams.id, command: command, coordinates: agentParams.coordinates}});
        agentParams.pendingHelpRequest = command;
    }
};