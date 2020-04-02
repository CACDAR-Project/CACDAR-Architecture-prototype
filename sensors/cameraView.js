let Utils = require(process.cwd() + '/utils.js');

class CameraView {

    constructor(parameters) {
        if (parameters && parameters.range) {
            this.range = parameters.range;
        } else {
            this.range = 1;
        }
    }

    // Longer range to be implemented
    perceive = function(agentParams, environment) {
        let info = [];

        let x = agentParams.coordinates.x;
        let y = agentParams.coordinates.y;

        let current = environment.grid[y][x];

        for (let agent of environment.agents) {
            if (Utils.xyEqual(agentParams.coordinates, agent.parameters.coordinates)) {
                if (agent.parameters.waitingAction) {
                    info.push({name: "agentWaitingHelp", content: {actionName: agent.parameters.waitingAction, isHelpRequest: true}});
                }
            }
        }

        if (current === '*') {
            info.push({name: "garbageSpotted"});
        }

        if (current === 'T') {
            info.push({name: "atTrashCan"});
        }

        return info;
    };
}

module.exports = CameraView;

