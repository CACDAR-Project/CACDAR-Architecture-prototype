let Utils = require(process.cwd() + '/tools/utils.js');

class Logic {

    constructor(logicName) {
        this.specificLogic = require(process.cwd() + '/agent/decisionLogic/' + logicName + ".js");
    }

    nextStep(agentParams, sensorInfo, actionList) {
        let actions = this.initialChecks(agentParams, sensorInfo);

        if (!actions.length) actions = this.specificLogic.processSensorInfo(agentParams, sensorInfo, actionList);
        if (!actions.length) {
            let target = this.specificLogic.checkForTargets(agentParams, sensorInfo, actionList);
            actions = this.pathFinding(agentParams, target);
        }
        if (agentParams.guidanceTarget && !agentParams.guidanceSource) {
            actions.push({actionName: "guidance", content: {id: agentParams.id, coordinates:
                            agentParams.coordinates}});
        }
        return actions;
    };

    pathFinding(agentParams, target) {
        if (!agentParams.hasMap) return;
        if (agentParams.remainingPath.length === 0 || agentParams.interruptPath) {
            if (!target) target = agentParams.longestSinceVisit;
            let pathFound = this.specificLogic.algorithm(agentParams.coordinates, agentParams.visitList, target);
            if (pathFound && pathFound.length) {
                agentParams.remainingPath = pathFound;
                agentParams.remainingPath.shift();
            }
            agentParams.interruptPath = false;
        }

        let next = agentParams.remainingPath.shift();

        if (next) {
            return [({actionName: "move", content: {x: next.x, y: next.y}})];
        }
        return [];
    };

    initialChecks(agentParams, sensorInfo) {
        this.getCurrentTileInfo(agentParams, sensorInfo);
        this.updateVisitList(agentParams);
        let actions = this.specificLogic.initialActions(agentParams);
        if (!agentParams.remainingPath) agentParams.remainingPath = [];
        if (agentParams.pendingHelpRequest) actions.push(agentParams.pendingHelpRequest);
        return actions;
    };

    // Maybe a bit messy to have this here
    getCurrentTileInfo(agentParams, sensorInfo) {
        for (let info of sensorInfo) {
            if (info.name === "currentTile") {
                agentParams.currentTile = {symbol: info.content.tile, x: info.content.x, y: info.content.y}
                return;
            }
        }
        agentParams.currentTile = null;
    }

    // Update "last visited" values for all nodes, and add to the list if the visited node is new
    updateVisitList(agentParams) {
        if (!agentParams.visitList) agentParams.visitList = [];

        agentParams.longestSinceVisit = 0;

        if (agentParams.currentTile && !agentParams.visitList.some(node => Utils.xyEqual(node, agentParams.coordinates))) {
            agentParams.visitList.push({x: agentParams.coordinates.x, y: agentParams.coordinates.y,
                symbol: agentParams.currentTile.symbol, visited: -1});
        }

        for (let node of agentParams.visitList) {
            if (Utils.xyEqual(node, agentParams.coordinates)) {
                node.visited = 0;
            } else if (node.visited !== -1) {
                node.visited++;
            }
            if (node.visited === -1 || (agentParams.longestSinceVisit !== -1 && node.visited > agentParams.longestSinceVisit)) {
                agentParams.longestSinceVisit = node.visited;
            }
        }
    }


}

module.exports = Logic;
