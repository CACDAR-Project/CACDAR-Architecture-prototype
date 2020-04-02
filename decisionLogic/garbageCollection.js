let Utils = require(process.cwd() + '/utils.js');

class Logic {

    constructor() {
        this.gridBFS = require(process.cwd() + '/decisionLogic/algorithms/gridBFS.js');
        this.remainingPath = [];
        this.visitList = [];
        this.nextToVisit = 0;
    }

    next(agentParams, sensorInfo, actionList) {
        if (agentParams.waitingAction) return null;
        if (this.visitList.length > 0) this.updateVisitList(agentParams.coordinates);

        let action = this.handleSensorInfo(agentParams, sensorInfo, actionList);
        if (action) return action;

        let target = this.checkForTargets(agentParams, sensorInfo, actionList);
        return this.movementLogic(agentParams, target);
    };

    initializeVisitList(grid) {
        for (let y = 0; y < grid.length; ++y) {
            for (let x = 0; x < grid[y].length; ++x) {
                if (grid[y][x] !== '#') {
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

            if (node.visited === -1 || (this.nextToVisit !== -1 && node.visited > this.nextToVisit)) {
                this.nextToVisit = node.visited;
            }
        }
    }

    checkForTargets(agentParams, sensorInfo, actionList) {
        let target = this.checkHelpRequests(sensorInfo, actionList);

        if (!target && this.tooMuchGarbage(agentParams)) return 'T';

        return target;
    }

    checkHelpRequests(sensorInfo, actionList) {
        for (let info of sensorInfo) {
            if (info.name === "messages") {
                for (let msg of info.content) {
                    if (msg.type === "helpRequest") {
                        if (this.hasAction(msg.content.actionName, actionList)) {
                            this.interruptPath = true;
                            return msg.content.coordinates;
                        }
                    }
                }
            }
        }
        return null;
    }

    hasAction(actionName, actionList) {
        for (let action of actionList) {
            if (actionName === action.name) {
                return true;
            }
        }
        return false;
    }

    tooMuchGarbage(agentParams) {
        return (agentParams.maxGarbage &&
            agentParams.garbageHeld >= agentParams.maxGarbage);
    }

    movementLogic(agentParams, target) {
        if (this.remainingPath.length === 0 || this.interruptPath) {
            if (!target) target = this.nextToVisit;
            let pathFound = this.gridBFS(agentParams.coordinates, this.visitList, target);
            if (pathFound && pathFound.length) {
                this.remainingPath = pathFound;
                this.remainingPath.shift();
            }
            this.interruptPath = false;
        }

        let next = this.remainingPath.shift();
        if (next) {
            return {actionName: "move", parameters: {x: next.x, y: next.y}};
        }
    }

    handleSensorInfo(agentParams, sensorInfo, actionList) {
        for (let info of sensorInfo) {
            switch (info.name) {
                case "agentWaitingHelp":
                    if (this.hasAction(info.content.actionName, actionList)) return info.content;
                    break;
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