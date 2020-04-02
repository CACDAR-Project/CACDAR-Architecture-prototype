module.exports.name = "garbageToTrashCan";

module.exports.perform = function(command, agentParams, environment) {
    if (agentParams.garbageHeld) {
        agentParams.garbageHeld = 0;

        // Interact with environment?
    }
};