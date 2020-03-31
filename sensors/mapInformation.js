class CameraView {

    constructor(parameters) {
    }

    perceive(agentParams, environment) {
        return {name: "mapInformation", content: {grid: environment.grid, freeSquares: environment.freeSquares}};
    }
}

module.exports = CameraView;