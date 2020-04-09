let Utils = require(process.cwd() + "/utils.js");

module.exports.name = "guidanceRequest";

module.exports.perform = function(command, agentParams, environment) {
    let targetAgent = environment.agents.find(val => Utils.xyEqualIdDifferent(command.content, val.parameters));

    targetAgent.parameters.messages.push({name: "guidanceRequest", content: {id: agentParams.id,
            target: command.content.target}});
};