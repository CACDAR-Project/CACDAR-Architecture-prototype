let Utils = require(process.cwd() + '/tools/utils.js');

let gridBFS = require(process.cwd() + '/agent/decisionLogic/algorithms/gridBFS.js');

module.exports.algorithm = gridBFS;

module.exports.initialActions = function(agentParams) {
    return [];
};

module.exports.checkForTargets = function(agentParams, sensorInfo, actionList) {
    if (agentParams.helpTarget) return agentParams.helpTarget;
    checkHelpRequests(agentParams, sensorInfo, actionList);
    if (agentParams.guidanceTarget) return agentParams.guidanceTarget;
    if (tooMuchGarbage(agentParams)) return 'T';
};

module.exports.processSensorInfo = function(agentParams, sensorInfo) {
    let actions = [];

    if (agentParams.currentTile) {
        let tileAction = tileActions(agentParams, sensorInfo);
        if (tileAction) actions.push(tileAction);
    }

    for (let info of sensorInfo) {
        switch (info.name) {
            case "agentSpotted":
                if (info.content.id === agentParams.helpId) {
                    actions.push(agentParams.helpCommand);
                    agentParams.helpId = false;
                    agentParams.helpCommand = false;
                    agentParams.helpTarget = false;
                }
                break;
            case "mapInformation":
                if (!agentParams.hasMap) actions.push({actionName: "initializeMap", content: info.content});
                break;
            case "openDoor":
                actions.push({actionName: "openDoor", content: info.content});
                break;
            case "guidanceRequest":
                if (agentParams.guidanceId || agentParams.helpId) break;
                agentParams.interruptPath = true;
                agentParams.guidanceId = info.content.id;
                agentParams.guidanceTarget = info.content.target;
                break;
        }
    }
    return actions;
};

let tileActions = function(agentParams) {
    let name;
    switch(agentParams.currentTile.symbol) {
        case "*":
            if (!tooMuchGarbage(agentParams)) name = "collectGarbage";
            break;
        case "T":
            if (agentParams.garbageHeld > 0) name = "garbageToTrashCan";
            break;
        case "O":
            name = "closeDoor";
            break;
        case agentParams.guidanceTarget:
            agentParams.guidanceId = false;
            agentParams.guidanceTarget = false;
            name = "move";
            break;
    }

    if (name) return {actionName: name, content: {x: agentParams.currentTile.x, y: agentParams.currentTile.y}};
};

let checkHelpRequests = function(agentParams, sensorInfo, actionList) {
    for (let info of sensorInfo) {
        if (info.name === "helpRequest") {
            if (Utils.actionInList(info.content.command.actionName, actionList) &&
                    !agentParams.guidanceId && !agentParams.helpId) {
                agentParams.interruptPath = true;
                agentParams.helpId = info.content.id;
                agentParams.helpCommand = info.content.command;
                agentParams.helpCommand["isHelpRequest"] = true;
                agentParams.helpTarget = info.content.coordinates;
            }
        }
    }
};

let tooMuchGarbage = function(agentParams) {
    return (agentParams.maxGarbage &&
        agentParams.garbageHeld >= agentParams.maxGarbage);
};


