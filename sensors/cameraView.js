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
        let x = agentParams.coordinates.x;
        let y = agentParams.coordinates.y;

        let current = environment.grid[y][x];

        if (current === '*') {
            return {name: "garbageSpotted"};
        }

        return [];
    };
}

module.exports = CameraView;

