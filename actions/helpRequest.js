module.exports.name = "helpRequest";

// Pushes a request to a "global" message list visible to all agents in the environment
module.exports.perform = function(command, agentParams, environment) {
    for (let agent of environment.agents) {
        if (agent.parameters.messages) {
            agent.parameters.messages.push({type: "helpRequest", content:
                    {actionName: command.actionName, coordinates: agentParams.coordinates}});
        }
    }
    agentParams.waitingAction = command.actionName;
};