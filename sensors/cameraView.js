let Utils = require(process.cwd() + '/utils.js');

class CameraView {

    constructor(parameters) {
        if (parameters && parameters.range) {
            this.range = parameters.range;
        } else {
            this.range = 1;
        }
    }

    squareIsFree(square) {
        return (square && square!=='#' && square !== 'C');
    }

    freeSquaresWithinSight(coords, grid) {
        let frees = [];
        let neighbors = Utils.getAdjacentCoordinates(coords);

        for (let nb of neighbors) {
            if (nb.y > 0 && nb.y < grid.length && nb.x > 0 && nb.x < grid[0].length) {
                if (this.squareIsFree(grid[nb.y][nb.x])) frees.push(nb);
            }
        }

        return frees;
    }


    // Longer range to be implemented...
    perceive(agentParams, environment) {
        let info = [];

        info.push({name: "freeSquaresInSight", content: this.freeSquaresWithinSight(agentParams.coordinates, environment.grid)});

        // Agents in the same square
        for (let agent of environment.agents) {
            if (Utils.xyEqualIdDifferent(agentParams, agent.parameters)) {
                info.push({name: "agentSpotted", content: {id : agent.parameters.id, coordinates: agent.parameters.coordinates}});
            }
        }

        let x = agentParams.coordinates.x;
        let y = agentParams.coordinates.y;
        info.push({name: "currentTile", content: {tile: environment.grid[y][x], x: x, y: y}});

        return info;
    };
}

module.exports = CameraView;

