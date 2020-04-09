let Utils = require(process.cwd() + "/utils.js");
let BFS = require(process.cwd() + "/decisionLogic/algorithms/gridBFS.js");

module.exports.name = "helpRequest";

// Pushes a request to the nearest capable agent using BFS
module.exports.perform = function(command, agentParams, environment) {
    let targetCoords = [];

    // Search agents capable of the action
    for (let agent of environment.agents) {
        if (Utils.actionInList(command.actionName, agent.actionList) && agent.parameters.messages) {
            targetCoords.push(agent.parameters.coordinates);
        }
    }

    let path = BFS(agentParams.coordinates, environment.freeSquares, targetCoords);
    let agentPosition = path[path.length - 1];
    if (!agentPosition) return null;

    let targetAgent = environment.agents.find(val => Utils.xyEqual(agentPosition, val.parameters.coordinates));

    let helpRequest = {name: "helpRequest", content:
            {id: agentParams.id, command: command, coordinates: agentParams.coordinates}};
    targetAgent.parameters.messages.push(helpRequest);

    agentParams.pendingHelpRequest = command;
};