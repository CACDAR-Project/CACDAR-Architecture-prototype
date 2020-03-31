let Utils = require(process.cwd() + '/utils.js');

class Logic {

    constructor() {
        this.remainingPath = [];
        this.visitGrid = [];
        this.exploring = true;
    }

    initializeGridWithUnseen(gridCopy) {
        for (let y = 0; y < gridCopy.length; ++y) {
            for (let x = 0; x < gridCopy[y].length; ++x) {
                gridCopy[y][x] = -1;
            }
        }
        return gridCopy;
    }

    // WIP

    next(agentParams, sensorInfo) {
        if (this.visitGrid.length === 0) {
            // Probably get the grid from map sensor info?
            this.visitGrid = this.initializeGridWithUnseen();
        }

        return [];
    };

    explore(start, freeSquares) {
    }

    findPath(start, target, freeSquares) {
    }
}