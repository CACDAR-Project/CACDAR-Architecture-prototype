let Utils = require(process.cwd() + "/utils.js");

module.exports.name = "guidance";

module.exports.perform = function(command, agentParams, environment) {
    let targetAgent = environment.agents.find(val => val.parameters.id === agentParams.guidanceId);

    targetAgent.parameters.messages.push({name: "guidance", content: command.content});
};