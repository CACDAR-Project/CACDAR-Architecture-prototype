let Utils = require(process.cwd() + '/utils.js');

class Logic {

    constructor() {
        this.gridBFS = require(process.cwd() + '/decisionLogic/algorithms/gridBFS.js');
        this.remainingPath = [];
        this.interruptPath = false;
        this.visitList = [];
        this.nextToVisit = 0;
    }

    next(agentParams, sensorInfo) {
        if (this.visitList.length > 0) {
            this.updateVisitList(agentParams.coordinates);
        }

        let exploring = this.checkIfCanExplore(agentParams);

        let action = this.handleSensorInfo(agentParams, sensorInfo, exploring);
        if (action) {
            return action;
        }

        return this.movementLogic(agentParams, exploring);
    };

    initializeVisitList(grid) {
        for (let y = 0; y < grid.length; ++y) {
            for (let x = 0; x < grid[y].length; ++x) {
                if (grid[y][x]!=='#') {
                    this.visitList.push({x: x, y: y, symbol: grid[y][x], visited: -1});
                }
            }
        }
    }

    updateVisitList(coords) {
        this.nextToVisit = 0;
        for (let node of this.visitList) {
            if (Utils.xyEqual(node, coords)) {
                node.visited = 0;
            } else if (node.visited !== -1) {
                node.visited++;
            }

            if (node.visited === -1 || (this.nextToVisit!== -1 && node.visited > this.nextToVisit)) {
                this.nextToVisit = node.visited;
            }
        }
    }

    checkIfCanExplore(agentParams) {
       return !this.tooMuchGarbage(agentParams);
    }

    tooMuchGarbage(agentParams) {
        return (agentParams.maxGarbage &&
            agentParams.garbageHeld >= agentParams.maxGarbage);
    }

    movementLogic(agentParams, exploring) {
        if (this.remainingPath.length === 0 || this.interruptPath) {
            let pathFound = [];
            if (exploring) {
                pathFound = this.gridBFS(agentParams.coordinates, this.visitList, this.nextToVisit);
            } else {
                pathFound = this.gridBFS(agentParams.coordinates, this.visitList, 'T');
            }
            if (pathFound && pathFound.length) {
                this.remainingPath = pathFound;
                this.remainingPath.shift();
            }
        }

        let next = this.remainingPath.shift();
        if (next) {
            return {actionName: "move", parameters: {x: next.x, y: next.y}};
        }
    }

    handleSensorInfo(agentParams, sensorInfo, exploring) {
        for (let info of sensorInfo) {
            switch (info.name) {
                case "garbageSpotted":
                    if (!this.tooMuchGarbage(agentParams)) return {actionName: "collectGarbage"};
                    break;
                case "atTrashCan":
                    if (agentParams.garbageHeld > 0) return {actionName: "garbageToTrashCan"};
                    break;
                case "mapInformation":
                    if (this.visitList.length === 0) {
                        this.initializeVisitList(info.content.grid);
                        this.updateVisitList(agentParams.coordinates);
                    }
                    break;
            }
        }
        return null;
    }

}

module.exports = Logic;