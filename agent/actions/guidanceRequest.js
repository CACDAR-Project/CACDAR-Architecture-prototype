let Utils = require(process.cwd() + "/tools/utils.js");

module.exports.name = "guidanceRequest";

module.exports.perform = function(command, agentParams, environment) {
    let targetAgent = Utils.closestAgentWithAction({actionName: "guidance"}, agentParams, environment);
    if (targetAgent) {
        targetAgent.parameters.messages.push({name: "guidanceRequest", content: {id: agentParams.id,
                coordinates: agentParams.coordinates, target: command.content.target}});
    }
};