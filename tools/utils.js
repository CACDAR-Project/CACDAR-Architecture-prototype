let BFS = require(process.cwd() + "/agent/decisionLogic/algorithms/gridBFS.js");

module.exports.xyEqual = function(a, b) {
    return a.x === b.x && a.y === b.y;
};

module.exports.xyEqualIdDifferent = function(a, b) {
    return this.xyEqual(a.coordinates, b.coordinates) && a.id !== b.id;
};

module.exports.listContainsList = function(a, b) {
    return b.every(val => a.some(val2 => this.xyEqual(val, val2)));
};

module.exports.compareDistance = function(a, b) {
    return a.distance - b.distance;
};

module.exports.actionInList = function(actionName, actionList)
{
    for (let action of actionList) {
        if (actionName === action.name) {
            return true;
        }
    }
    return false;
};

module.exports.getRandomInt = function(max) {
    return Math.floor(Math.random() * Math.floor(max));
};

module.exports.getAdjacentCoordinates = function(coords) {
    let x = coords.x;
    let y = coords.y;
    return [{x: x, y: y + 1}, {x: x + 1, y: y},
        {x: x - 1, y: y}, {x: x, y: y - 1}];
};

module.exports.closestAgentWithAction = function(command, agentParams, environment) {
    let targetCoords = [];

    // Search agents capable of the action
    for (let agent of environment.agents) {
        if (this.actionInList(command.actionName, agent.actionList) && agent.parameters.messages) {
            targetCoords.push(agent.parameters.coordinates);
        }
    }

    let path = BFS(agentParams.coordinates, environment.freeSquares, targetCoords);
    let agentPosition = path[path.length - 1];
    if (agentPosition) {
        return environment.agents.find(val => this.xyEqual(agentPosition, val.parameters.coordinates));
    }
    return null;
}