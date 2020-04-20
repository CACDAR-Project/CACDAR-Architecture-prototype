let Utils = require(process.cwd() + '/tools/utils.js');

let gridBFS = require(process.cwd() + '/agent/decisionLogic/algorithms/gridBFS.js');

module.exports.algorithm = gridBFS;

module.exports.initialActions = function(agentParams) {
    let actions = [];
    if (agentParams.exit) actions.push({actionName: "exit"});
    return actions;
};

module.exports.checkForTargets = function(agentParams, sensorInfo, actionList) {
    if (agentParams.hasMap && agentParams.deliveryComplete) {
        return 'E';
    } else if (agentParams.hasMap) {
        return agentParams.goal;
    }
};

module.exports.processSensorInfo = function(agentParams, sensorInfo) {
    let actions = [];

    if (agentParams.currentTile) {
        let tileAction = tileActions(agentParams, sensorInfo);
        if (tileAction) actions.push(tileAction);
    }

    for (let info of sensorInfo) {
        switch (info.name) {
            case "mapInformation":
                if (!agentParams.hasMap) actions.push({actionName: "initializeMap", content: info.content});
                break;
            case "agentSpotted":
                if (!agentParams.hasMap) startRequestingGuidance(agentParams);
                break;
            case "guidance":
                return [{actionName: "move", content: info.content.coordinates}];
            case "openDoor":
                actions.push({actionName: "openDoor", content: info.content});
                break;
        }
    }

    if (agentParams.pendingGuidanceRequest) return agentParams.pendingGuidanceRequest;

    return actions;
};

let startRequestingGuidance = function(agentParams) {
    let target = agentParams.goal;
    if (agentParams.deliveryComplete) target = 'E';
    agentParams.pendingGuidanceRequest = [{actionName: "guidanceRequest", content: {id: agentParams.id,
            target: target, coordinates: agentParams.coordinates}}];
}

let tileActions = function(agentParams) {
    switch(agentParams.currentTile.symbol) {
        case "E":
            if (agentParams.deliveryComplete) {
                /*
                When the first delivery is complete, the agent essentially has a (limited) map
                based on the tiles traversed, which can be used in the future
                */
                agentParams.exit = true;
                agentParams.hasMap = true;
                agentParams.pendingGuidanceRequest = false;
            }
            break;
        case agentParams.goal:
            agentParams.deliveryComplete = true;
            agentParams.pendingGuidanceRequest = false;
            break;
    }

    // Request for guidance if the tile is different from last visit, as it implies the area might have changed (WIP)
    // Must take into account some special cases like doors and trash
    if (agentParams.hasMap) {
        let visited = agentParams.visitList.find(node => Utils.xyEqual(node, agentParams.currentTile));
        if (agentParams.currentTile.symbol !== 'O' && agentParams.currentTile.symbol !== '*'
            && agentParams.currentTile.symbol !== visited.symbol) {
            visited.symbol = agentParams.currentTile.symbol;
            startRequestingGuidance(agentParams);
        }
    }
};


